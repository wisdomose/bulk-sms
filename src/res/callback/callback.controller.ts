import { Request, Response } from "express";
import Exception from "../../lib/Exception";
import transactionService from "../transactions/transaction.service";
import logger from "../../lib/logger";
import walletService from "../wallet/wallet.service";

type MonnifyCompletedResponse = {
  eventData: {
    product: {
      reference: string;
      type: string;
    };
    transactionReference: string;
    paymentReference: string;
    paidOn: string;
    paymentDescription: string;
    metaData: {
      name: string;
      age: string;
    };
    paymentSourceInformation: never[];
    destinationAccountInformation: {};
    amountPaid: number;
    totalPayable: number;
    cardDetails: {
      last4: string;
      expMonth: string;
      expYear: string;
      bin: string;
      reusable: boolean;
    };
    paymentMethod: string;
    currency: string;
    settlementAmount: string;
    paymentStatus: string;
    customer: {
      name: string;
      email: string;
    };
  };
  eventType: string;
};
type MonnifyRejectedResponse = {
  eventData: {
    metaData?: Record<string, any>;
    product: {
      reference: string;
      type: string;
    };
    amount: number;
    paymentSourceInformation: {
      bankCode: string;
      amountPaid: number;
      accountName: string;
      sessionId: string;
      accountNumber: string;
    };
    transactionReference: string;
    created_on: string;
    paymentReference: string;
    paymentRejectionInformation: {
      bankCode: string;
      destinationAccountNumber: string;
      bankName: string;
      rejectionReason: string;
      expectedAmount: number;
    };
    paymentDescription: string;
    customer: {
      name: string;
      email: string;
    };
  };
  eventType: string;
};
type MonnifysuccessfulResponse = {
  eventType: string;
  eventData: {
    product: {
      reference: string;
      type: string;
    };
    transactionReference: string;
    paymentReference: string;
    paidOn: string;
    paymentDescription: string;
    metaData: {};
    paymentSourceInformation: {
      bankCode: string;
      amountPaid: number;
      accountName: string;
      sessionId: string;
      accountNumber: string;
    }[];
    destinationAccountInformation: {
      bankCode: string;
      bankName: string;
      accountNumber: string;
    };
    amountPaid: number;
    totalPayable: number;
    cardDetails: {};
    paymentMethod: string;
    currency: string;
    settlementAmount: string;
    paymentStatus: string;
    customer: {
      name: string;
      email: string;
    };
  };
};
type PaystackResponse = {
  event: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: { user: string };
  };
};

// TODO: add secret key for comparing hash
/**
 * NOTE
 * eventData.paymentReference is the id of the user making the payment
 */
export async function verifyMonnifyPayment(
  req: Request<
    {},
    {},
    | MonnifyCompletedResponse
    | MonnifyRejectedResponse
    | MonnifysuccessfulResponse
  >,
  res: Response
) {
  try {
    // const computedHash = crypto
    //   .createHmac("sha512")
    //   .update(JSON.stringify(req.body))
    //   .digest("hex");

    // const correctHash = computedHash === req.header("monnify-signature");
    const { eventData, eventType } = req.body;
    logger.info(
      `VERIFY_MONNIFY_DEPOSIT: refrence - ${eventData.paymentReference}`
    );

    if (eventType === "SUCCESSFUL_TRANSACTION") {
      const data = eventData as MonnifyCompletedResponse["eventData"];

      //  send the response to avoid timeout
      res.status(200).send("").end();

      await transactionService.create({
        ownerId: data.paymentReference,
        reference: eventData.transactionReference,
        type: "deposit",
        amount: data.amountPaid,
        status: "successful",
      });

      await walletService.depositWithdraw({
        ownerId: data.paymentReference,
        amount: data.amountPaid,
      });

      logger.info(
        `VERIFY_MONNIFY_DEPOSIT: completed - ${data.transactionReference}`,
        eventData
      );
    } else if (eventType === "REJECTED_PAYMENT") {
      //  send the response to avoid timeout
      res.status(200).send("").end();
      // TODO: reference not included
      const data = eventData as MonnifyRejectedResponse["eventData"];
      await transactionService.create({
        ownerId: data.paymentReference,
        reference: eventData.transactionReference,
        type: "deposit",
        amount: data.amount,
        status: "failed",
      });
      logger.warn(
        `VERIFY_MONNIFY_DEPOSIT: rejected - ${data.transactionReference}`
      );
    }

    // status code already sent
    return;
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to verify monnify deposit",
    });
  }
}

export async function verifyPaystackPayment(
  req: Request<{}, {}, PaystackResponse>,
  res: Response
) {
  try {
    const { data } = req.body;
    const { status, reference, metadata } = data;
    const amount = data.amount / 100; // convert to naira

    logger.info(`VERIFY_PAYSTACK_DEPOSIT: recieved - ${reference}`);

    if (status === "success") {
      res.status(200).send("").end();

      await transactionService.create({
        ownerId: metadata.user,
        reference: reference,
        type: "deposit",
        amount: amount,
        status: "successful",
      });

      await walletService.depositWithdraw({
        ownerId: metadata.user,
        amount,
      });

      logger.info(
        `VERIFY_PAYSTACK_DEPOSIT: completed - ${reference} ${JSON.stringify(
          data
        )}`
      );
    } else {
      res.status(200).send("").end();

      await transactionService.create({
        ownerId: metadata.user,
        reference: reference,
        type: "deposit",
        amount: amount,
        status: "failed",
      });

      logger.info(
        `VERIFY_PAYSTACK_DEPOSIT: failed - ${reference} ${JSON.stringify(data)}`
      );
    }
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to verify paystack deposit",
    });
  }
}
