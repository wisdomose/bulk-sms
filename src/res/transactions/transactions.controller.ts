import { Request, Response } from "express";
import { UserLocal } from "../../types/global";
import Exception from "../../lib/Exception";
import transactionService from "./transaction.service";
import { TransactionRouter } from "./transaction.schema";
import config from "../../lib/config";

export async function userStats(req: Request, res: Response<{}, UserLocal>) {
  try {
    const { _id } = res.locals.user;

    const stats = await transactionService.stats(_id);

    res.send({
      message: "Transaction stats",
      data: stats,
    });
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to generate transaction stats",
    });
  }
}

export async function findAll(
  req: Request<{}, {}, {}, TransactionRouter["FindAll"]["query"]>,
  res: Response<{}, UserLocal>
) {
  try {
    const { _id } = res.locals.user;
    const perPage = Number(req.query.perPage ?? config.perPage);
    const page = Number(req.query.page ?? "1");
    const status = req.query.status ?? "";
    const order = req.query.order ?? "DESC";
    const sortBy = req.query.sortBy ?? "createdAt";
    let query: Record<any, any> = {};

    // status
    if (status) query["status"] = status;

    // user
    query["ownerId"] = res.locals.user!._id;

    const transactions = await transactionService.find(
      {
        ownerId: _id,
      },
      {
        skip: (page - 1) * perPage,
        limit: perPage,
        shouldPopulate: true,
        sort: { [sortBy]: order === "ASC" ? 1 : -1 },
      }
    );

    res.send({
      message: "Transactions found",
      data: transactions,
    });
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to find transactions",
    });
  }
}
