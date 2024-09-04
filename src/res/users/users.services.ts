import { Types, UpdateQuery } from "mongoose";
import bcrypt from "bcrypt";
import UserModel, { TUser } from "./users.model";
import { v4 } from "uuid";
import transactionService from "../transactions/transaction.service";
import walletService from "../wallet/wallet.service";

const populate = {};
const select = { password: 0 };

async function init() {
  await UserModel.syncIndexes();
}

async function findAll(
  props: Record<string, any>,
  params: { skip: number; limit: number }
) {
  const result = await UserModel.find(props)
    .select(select)
    .sort({ createdAt: -1 })
    .skip(params.skip)
    .limit(params.limit);
  return result;
}

async function findOne(props: Record<string, any>, shouldPopulate = false) {
  if (shouldPopulate) {
    const result = await UserModel.findOne(props).select(select);
    return result;
  } else {
    const result = await UserModel.findOne(props);
    return result;
  }
}

async function edit(id: Types.ObjectId, params: UpdateQuery<TUser>) {
  const result = await UserModel.findByIdAndUpdate(id, params);
  return result;
}

async function createUser(props: UpdateQuery<TUser>) {
  const user = await UserModel.create(props);
  return user;
}

async function comparePassword(password: string, hashed: string) {
  const samePassword = await bcrypt.compare(password, hashed);
  return samePassword;
}

async function count(params: Record<string, any>) {
  const total = await UserModel.countDocuments(params);
  return total;
}

async function stats(_id: string | Types.ObjectId) {
  return {};
}

async function genererateKey() {
  let key = "";
  while (!key) {
    let tempKey = v4().replaceAll("-", "");
    let res = await UserModel.findOne({ apiKey: key });
    if (!res) key = tempKey;
  }

  return key;
}

async function devUpdate() {}

const usersService = {
  init,
  findAll,
  findOne,
  edit,
  createUser,
  comparePassword,
  devUpdate,
  count,
  stats,
  genererateKey
};

export default usersService;
