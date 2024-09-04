import { FilterQuery, QueryOptions, Types } from "mongoose";
import TransactionModel, { TTransaction } from "./transactions.model";

const populate = [
  {
    path: "owner",
    select: "-password",
    populate: {
      path: "profile",
    },
  },
];

async function findOne(params: FilterQuery<TTransaction>) {
  const result = await TransactionModel.findOne(params);
  return result;
}
async function find(
  params: FilterQuery<TTransaction>,
  opts?: QueryOptions<TTransaction>
) {
  const result = await TransactionModel.find(params, {}, opts).populate(
    populate
  );
  return result;
}
async function create(
  params: Pick<
    TTransaction,
    "ownerId" | "reference" | "type" | "amount" | "status" | "description"
  > & { ownerId: string | Types.ObjectId }
) {
  const { ownerId, reference, type, amount, status } = params;
  const transaction = await TransactionModel.create({
    ownerId,
    reference,
    type,
    amount,
    status,
  });

  return transaction;
}
async function aggregate(aggregate: any) {
  const result = await TransactionModel.aggregate(aggregate);

  return result;
}
async function count(params: FilterQuery<TTransaction>) {
  const total = await TransactionModel.countDocuments(params);
  return total;
}
// TODO
async function stats(userId: string | Types.ObjectId) {}
async function devUpdate() {}

const transactionService = {
  findOne,
  create,
  devUpdate,
  aggregate,
  count,
  stats,
  find,
};

export default transactionService;
