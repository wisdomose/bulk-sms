import { Router } from "express";
import { userStats, findAll } from "./transactions.controller";
import protectedRoute from "../../middleware/protectedRoute";

export default function transactionRouter() {
  const router = Router();

  //   USER
  // TODO: pagination
  /**
   * @swagger
   * /transactions:
   *  get:
   *    summary: find all logged-in users transactions
   *    tags: [Transactions]
   */
  router.get("/", protectedRoute("user"), findAll);


  // router.get("/stats", protectedRoute("user"), userStats);

  //   ADMIN
  // TODO admin stats
  return router;
}
