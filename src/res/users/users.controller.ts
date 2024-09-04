import { Request, Response } from "express";
import Exception from "../../lib/Exception";
import { UserRouter } from "./user.schema";
import usersService from "./users.services";
import {
  comparePassword,
  generateAccessToken,
  hashPassword,
} from "../../lib/helpers";
import logger from "../../lib/logger";
import walletService from "../wallet/wallet.service";
import { GlobalSchema } from "../../lib/schemas";
import { UserLocal } from "../../types/global";
import { v4 } from "uuid";

export async function userSignup(
  req: Request<{}, {}, UserRouter["Signup"]["body"]>,
  res: Response
) {
  try {
    const { email, password, displayName } = req.body;

    // check for duplicate account
    const duplicateEmail = await usersService.findOne({
      email: email ?? "".toLowerCase(),
    });

    if (duplicateEmail)
      throw new Exception({
        code: 409,
        message: "Account already exists with this email",
      });

    // hash password
    const hashedPassword = await hashPassword(password);

    // create account
    logger.info("Creating user account");
    const createdUser = await usersService.createUser({
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName,
    });

    // create wallet
    await walletService.initWallet({
      ownerId: createdUser._id.toString(),
    });

    logger.info("Account created");

    // TTODO: send confirmation mail

    return res.json({
      message: "Account created",
    });
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error.message ?? "Failed to create account",
    });
  }
}

export async function userLogin(
  req: Request<{}, {}, GlobalSchema["Login"]["body"]>,
  res: Response
) {
  try {
    const { username, password } = req.body;

    // check if account exists
    const existingAccount = await usersService.findOne({
      email: username.toLowerCase(),
    });

    if (!existingAccount) throw new Error("Incorrect credentials");

    // compare passwords
    const samePassword = await comparePassword(
      password,
      existingAccount.password
    );

    if (!samePassword)
      throw new Exception({ code: 400, message: "Incorrect credentials" });

    // generate jwt
    const token = generateAccessToken(
      {
        _id: existingAccount._id,
        role: "user",
      },
      "1d"
    );

    // send jwt
    return res.json({
      message: "Login successful",
      data: token,
    });
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to login",
    });
  }
}

export async function generateAPIKey(
  req: Request,
  res: Response<{}, UserLocal>
) {
  try {
    const { _id, apiKey } = res.locals.user;
    let key = await usersService.genererateKey();

    await usersService.edit(_id, { apiKey: key });

    return res.json({
      message: "API key generated",
      data: key,
    });
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to generate API key",
    });
  }
}

export async function profile(req: Request, res: Response<{}, UserLocal>) {
  try {
    const user = res.locals.user;

    return res.json({
      message: "Profile found",
      data: user,
    });
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to find profile",
    });
  }
}
