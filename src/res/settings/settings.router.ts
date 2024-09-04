import { Router } from "express";
import { findSettings, updateSettings } from "./settings.controller";
import { updateSettingsSchema } from "./settings.schema";
import protectedRoute from "../../middleware/protectedRoute";
import schemaParser from "../../middleware/schemaParser";

export default function settingsRouter() {
  const router = Router();

  /**
   * @swagger
   * /settings:
   *  put:
   *    summary: Update settings
   *    tags: [Settings]
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/settings/update'
   */
  router.put(
    "/",
    protectedRoute("admin"),
    schemaParser(updateSettingsSchema),
    updateSettings
  );

  /**
   * @swagger
   * /settings:
   *  get:
   *    summary: Get settings
   *    tags: [Settings]
   */
  router.get("/", protectedRoute(["user", "admin"]), findSettings);

  return router;
}
