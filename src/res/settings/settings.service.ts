import { UpdateQuery } from "mongoose";
import logger from "../../lib/logger";
import SettingsModel, { TSettings } from "./settings.model";

async function init() {
  try {
    const existing = await SettingsModel.find();
    if (existing.length > 0) {
      logger.info("Settings initialized");
      return;
    }

    await SettingsModel.create({
      costPerPage: 4, // in NGN
    });

    logger.info(`Settings initialized`);
  } catch (error) {
    logger.error("An error occured while initializing settings");
  }
}

async function find() {
  const result = await SettingsModel.find();
  let settings = result[0];
  return settings;
}

async function update(update: UpdateQuery<TSettings>) {
  const result = await SettingsModel.find();
  let settings = result[0];

  const doc = await SettingsModel.findByIdAndUpdate(settings._id, update, {
    new: true,
  });
  return doc;
}

async function devUpdate() {}

const settingsService = { update, find, devUpdate, init };

export default settingsService;
