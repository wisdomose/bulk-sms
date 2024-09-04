import { Types } from "mongoose";
import bcrypt from "bcrypt";
import AdminModel, { TAdmin } from "./admin.model";
import config from "../../lib/config";
import logger from "../../lib/logger";

const populate = {};
const select = { password: 0 };

async function init() {
  try {
    AdminModel.syncIndexes();
    const existing = await AdminModel.findOne({
      email: config.SUPER_ADMIN_EMAIL,
    });
    if (existing) {
      logger.info("Super admin exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      config.SUPER_ADMIN_PASSWORD,
      config.SALT
    );

    await AdminModel.create({
      email: config.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
    });

    logger.info(`Super admin created`);
  } catch (error) {
    console.log(error);
    logger.error("An error occured while setting up super admin");
  }
}

async function findOne(props: Record<string, any>, shouldPopulate = false) {
  if (shouldPopulate) {
    const result = await AdminModel.findOne(props).select(select);
    return result;
  } else {
    const result = await AdminModel.findOne(props);
    return result;
  }
}

async function edit(id: Types.ObjectId, params: Partial<TAdmin>) {
  const result = await AdminModel.findByIdAndUpdate(id, params);
  return result;
}

async function create(
  props: Pick<TAdmin, "email" | "password"> & { profileId: Types.ObjectId }
) {
  await AdminModel.create(props);
}

async function comparePassword(password: string, hashed: string) {
  const samePassword = await bcrypt.compare(password, hashed);
  return samePassword;
}

async function devUpdate() {}

const adminService = {
  init,
  findOne,
  edit,
  create,
  comparePassword,
  devUpdate,
};

export default adminService;
