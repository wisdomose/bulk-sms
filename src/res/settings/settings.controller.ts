import { Request, Response } from "express";
import Exception from "../../lib/Exception";
import { AdminLocal } from "../../types/global";
import { SettingsRouter } from "./settings.schema";
import { TSettings } from "./settings.model";
import settingsService from "./settings.service";

export async function updateSettings(
  req: Request<{}, {}, SettingsRouter["Update"]["body"]>,
  res: Response<{}, AdminLocal>
) {
  try {
    const { costPerPage } = req.body;

    const settings = await settingsService.update({
      costPerPage,
    });

    if (!settings) throw new Error("Failed to update settings");

    return res.json({
      message: "Settings updated successfully",
      data: settings.toJSON(),
    });
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to update settings",
    });
  }
}

export async function findSettings(req: Request, res: Response) {
  try {
    const settings = await settingsService.find();

    return res.json({
      message: "Settings found",
      data: settings.toJSON(),
    });
  } catch (error: any) {
    throw new Exception({
      code: 400,
      message: error?.message ?? "Failed to find settings",
    });
  }
}
