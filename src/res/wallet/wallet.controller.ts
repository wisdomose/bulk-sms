import { Request, Response } from "express";
import { AdminLocal, GlobalLocal, UserLocal } from "../../types/global";
import Exception from "../../lib/Exception";
import walletService from "./wallet.service";
import transactionService from "../transactions/transaction.service";

// export async function adminFind(req: Request, res: Response<{}, AdminLocal>) {
//   try {
//     const wallets = await walletService.find({});
//     return res.json({
//       message: "Wallet found",
//       data: { wallets },
//     });
//   } catch (error: any) {
//     throw new Exception({
//       code: 400,
//       message: error?.message ?? "Failed to retrieve wallet",
//     });
//   }
// }

export async function find(req: Request, res: Response<{}, GlobalLocal>) {
  try {
    if ((res.locals as AdminLocal).admin) {
    } else if ((res.locals as UserLocal).user) {
      const user = (res.locals as UserLocal).user;
      const wallet = await walletService.findOne({
        ownerId: user._id,
      });
      const transactions = await transactionService.find(
        {
          ownerId: user._id,
          // type: { $in: ["deposit", "withdrawal"] },
        },
        { sort: { createdAt: -1 }, shouldPopulate: true }
      );

      return res.json({
        message: "wallet found",
        data: { wallet, transactions },
      });
    } else {
    }
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to retrieve wallet",
    });
  }
}
