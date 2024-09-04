import { Request, Response } from "express";
import Exception from "../../lib/Exception";
import { AdminLocal } from "../../types/global";
import adminService from "./admin.service";
import { comparePassword, generateAccessToken } from "../../lib/helpers";
import { GlobalSchema } from "../../lib/schemas";

export async function profile(req: Request, res: Response<{}, AdminLocal>) {
  try {
    const admin = res.locals.admin;
    const profile = await adminService.findOne({ _id: admin._id }, true);

    return res.json({
      message: "Profile found",
      data: { ...profile?.toJSON() },
    });
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to retrieve admin password",
    });
  }
}

export async function adminLogin(
  req: Request<{}, {}, GlobalSchema["Login"]["body"]>,
  res: Response
) {
  try {
    const { username, password } = req.body;

    // check if account exists
    const existingAccount = await adminService.findOne({
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
        role: "admin",
      },
      "1d"
    );

    // send jwt
    return res.json({
      message: "Login successful",
      data:token,
    });
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to login",
    });
  }
}