import { Router } from "express";
import {
  verifyMonnifyPayment,
  verifyPaystackPayment,
} from "./callback.controller";

export default function callbackRouter() {
  const router = Router();

  /**
   * @swagger
   * /callback/monnify:
   *  post:
   *    summary: Monnify webhook
   *    tags: [Webhooks]
   */
  router.post("/monnify", verifyMonnifyPayment);
  /**
   * @swagger
   * /callback/paystack:
   *  post:
   *    summary: Paystack webhook
   *    tags: [Webhooks]
   */
  router.post("/paystack", verifyPaystackPayment);

  return router;
}
