import { Request, Response } from "express";
import Exception from "../../lib/Exception";
import logger from "../../lib/logger";
import walletService from "../wallet/wallet.service";
import { UserLocal } from "../../types/global";
import { SMSRouter } from "./messages.schema";
import usersService from "../users/users.services";
import axios from "axios";
import MessagesService from "./messages.service";
import settingsService from "../settings/settings.service";
import transactionService from "../transactions/transaction.service";
import config from "../../lib/config";

export async function findMyMessages(
  req: Request,
  res: Response<{}, UserLocal>
) {
  try {
    const { _id } = res.locals.user;

    const sms = await MessagesService.find({ ownerId: _id });

    return res.json({
      message: "Messages found",
      data: {
        results: sms,
      },
    });
  } catch (error: any) {
    throw new Exception({
      code: error?.code ?? 400,
      message: error?.message ?? "Failed to find your Messages",
    });
  }
}

export async function sendMessage(
  req: Request<{}, {}, SMSRouter["Send"]["body"], SMSRouter["Send"]["query"]>,
  res: Response
) {
  try {
    const { message, recipients } = req.body;
    const { api_key } = req.query;

    logger.info("MESSAGE: verifying key");
    const user = await usersService.findOne({ apiKey: api_key });

    if (!user) throw new Error("Invalid API key");

    logger.info("MESSAGE: key verification sucessful");

    // get cost per page
    const settings = await settingsService.find();

    if (!settings)
      throw new Exception({ message: "Settings not initialized", code: 500 });

    logger.info("MESSAGE: Checking user wallet balance");
    const wallet = await walletService.findOne({ ownerId: user._id });
    if (!wallet) throw new Error("No wallet found for this account");

    // check if users balance can cater for the sms
    const pages = message.length > 160 ? Math.floor(message.length / 153) : 1;
    const costPerPerson = pages * settings.costPerPage;
    const totalCost = recipients.length * costPerPerson;

    if (wallet.balance < totalCost)
      throw new Error(
        `Insufficient wallet balance. Minimum balance of N${totalCost} is required`
      );
    logger.info("MESSAGE: Sufficient wallet balance");

    // send sms
    logger.info("MESSAGE: Sending messages");
    const parsedNumbers = MessagesService.prepareNumbers(recipients);
    const form = new FormData();
    form.append("username", "Sandbox");
    form.append("to", parsedNumbers.join(","));
    form.append("message", message);
    form.append("from", config.SMS_API_SHORT_CODE);

    const smsResponse: {
      SMSMessageData: {
        Message: string;
        Recipients: {
          cost: string;
          messageId: string;
          number: string;
          status: string;
          statusCode: number;
        }[];
      };
    } = await axios({
      method: "POST",
      url: config.SMS_API_URL,
      //   url: `https://api.africastalking.com/version1/messaging`,
      data: form,
      headers: {
        Accept: "application/json",
        apiKey: config.SMS_API_KEY,
      },
    }).then((res) => res.data);

    logger.info("MESSAGE: Messages sent");

    logger.info("MESSAGE: Debiting user");
    const successful = smsResponse.SMSMessageData.Recipients.filter(
      (entry) => [100, 101, 102].includes(entry.statusCode) //processed,  sent, queued
    );

    // charge for only successful deliveries
    const total = successful.length * costPerPerson;
    await walletService.depositWithdraw({ ownerId: user._id, amount: total });

    await transactionService.create({
      ownerId: user._id,
      type: "debit",
      amount: total,
      status: "successful",
      description: `Bulk SMS`,
    });

    logger.info("MESSAGE: User debited");

    // add it to history
    await MessagesService.create({
      ownerId: user._id,
      message,
      failed: smsResponse.SMSMessageData.Recipients.length - successful.length,
      successful: successful.length,
      cost: total,
      pagesPerMessage: pages,
      recipients: parsedNumbers,
    });

    return res.json({
      message: "SMS delivered",
      data: {
        successful: successful.length,
        failed:
          smsResponse.SMSMessageData.Recipients.length - successful.length,
        totalCharge: total,
      },
    });
  } catch (error: any) {
    throw new Exception({
      code: error?.code ?? 400,
      message: error?.message ?? "Failed to generate API key",
    });
  }
}
