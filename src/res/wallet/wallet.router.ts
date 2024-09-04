import { Router } from "express";
import { find } from "./wallet.controller";
import protectedRoute from "../../middleware/protectedRoute";

export default function walletRouter() {
  const router = Router();

  // router.get("/admin", protectedRoute("admin"), adminFind);

  /**
   * @swagger
   * /wallet:
   *  get:
   *    summary: find my wallet
   *    tags: [Wallet]
   */
  router.get("/", protectedRoute("user"), find);

  return router;
}
