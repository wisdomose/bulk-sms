import { Router } from "express";
import protectedRoute from "../../middleware/protectedRoute";
import schemaParser from "../../middleware/schemaParser";
import { sendMessageSchema } from "./messages.schema";
import { findMyMessages, sendMessage } from "./messages.controller";

export default function MessageRouter() {
  const router = Router();

  /**
   * @swagger
   * /messages:
   *  get:
   *    summary: find all logged-in users past messages
   *    tags: [Messages]
   *  parameters:
   *     - $ref: '#/components/parameters/page'
   *     - $ref: '#/components/parameters/perPage'
   */
  router.get("/", protectedRoute("user"), findMyMessages);

  /**
   * @swagger
   * /messages/send:
   *  post:
   *    summary: send a bulk message
   *    tags: [Messages]
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *          schema:
   *            $ref: '#/components/schemas/messages/send'
   *    parameters:
   *      - $ref: '#/components/parameters/apiKey'
   */
  router.post(
    "/send",
    protectedRoute("user"),
    schemaParser(sendMessageSchema),
    sendMessage
  );

  return router;
}
