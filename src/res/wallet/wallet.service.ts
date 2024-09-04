import { FilterQuery, QueryOptions, Types } from "mongoose";
import WalletModel, { TWallet } from "./wallet.model";
import logger from "../../lib/logger";

const populate = {
  path: "owner",
};

async function init() {
  await WalletModel.syncIndexes();
}

async function initWallet({ ownerId }: { ownerId: Types.ObjectId | string }) {
  logger.info(`WALLET_SETUP: USER:${ownerId}`);
  const result = await WalletModel.create({ ownerId: ownerId, balance: 0 });
  logger.info(`WALLET_successful: USER:${ownerId}`);
  return result;
}

async function depositWithdraw({
  ownerId,
  amount,
}: {
  ownerId: Types.ObjectId | string;
  amount: number;
}) {
  const result = await WalletModel.findOneAndUpdate(
    { ownerId: ownerId },
    { $inc: { balance: amount } },
    { new: true }
  );

  return result;
}

async function findOne(params: FilterQuery<TWallet>) {
  const result = await WalletModel.findOne(params);
  return result;
}

async function count(params: FilterQuery<TWallet>) {
  const total = await WalletModel.countDocuments(params);
  return total;
}

async function find(
  params: FilterQuery<TWallet>,
  opts?: QueryOptions<TWallet>
) {
  const result = await WalletModel.find(params, {}, opts);
  return result;
}

async function aggregate(aggregate: any) {
  const result = await WalletModel.aggregate(aggregate);

  return result;
}

async function devUpdate() {}

const walletService = {
  init,
  depositWithdraw,
  findOne,
  devUpdate,
  initWallet,
  aggregate,
  find,
  count,
};

export default walletService;
