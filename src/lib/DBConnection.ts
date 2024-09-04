import mongoose from "mongoose";
import config from "./config";
import logger from "./logger";
import adminService from "../res/admin/admin.service";
import walletService from "../res/wallet/wallet.service";
import usersService from "../res/users/users.services";
import settingsService from "../res/settings/settings.service";

export default async function connection() {
  logger.info("Initializing...");
  logger.info("Attempting to establish DB connection");
  await mongoose
    .connect(config.DB_URI)
    .then(async () => {
      logger.info("DB connection successful");
      logger.info("Starting Initialization");
      await adminService.init();
      await usersService.init();
      await walletService.init();
      await settingsService.init();
      logger.info("Initialization complete");
    })
    .catch((err) => {
      logger.error(`DB connection failed - ${err.message}`);
    });

  // remove onbsolete collections
  const toDelete: string[] = []; // names of collections to be deleted
  const collections = mongoose.connection.collections;
  for (let collection of Object.keys(collections)) {
    if (toDelete.includes(collection)) {
      await mongoose.connection.dropCollection(collection);
    }
  }
}
