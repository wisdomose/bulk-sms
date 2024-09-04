import { Application } from "express";
import UsersRouter from "../res/users/users.router";
import callbackRouter from "../res/callback/callback.router";
import transactionService from "../res/transactions/transaction.service";
import walletService from "../res/wallet/wallet.service";
import adminService from "../res/admin/admin.service";
import usersService from "../res/users/users.services";
import settingsService from "../res/settings/settings.service";
import MessageRouter from "../res/messages/messages.router";
import transactionRouter from "../res/transactions/transaction.router";
import settingsRouter from "../res/settings/settings.router";
import adminRouter from "../res/admin/admin.router";
import walletRouter from "../res/wallet/wallet.router";
import MessagesService from "../res/messages/messages.service";

export default function router(app: Application) {
  /**
   * @swagger
   * tags:
   *  name: Health check
   * /health-check:
   *  get:
   *    summary: Check if the API is up and running
   *    tags: [Health check]
   *    responses:
   *      200:
   *        description: The API is up and running
   */

  app.get("/health-check", (req, res) => {
    return res.send(200);
  });

  /**
   * @swagger
   * tags:
   *   name: Users
   */
  app.use("/users", UsersRouter());

  /**
   * @swagger
   * tags:
   *   name: Admin
   */
  app.use("/admin", adminRouter());

  /**
   * @swagger
   * tags:
   *   name: Messages
   */
  app.use("/messages", MessageRouter());

  /**
   * @swagger
   * tags:
   *   name: Webhooks
   *   description: Webhooks related routes
   */
  app.use("/callback", callbackRouter());

  /**
   * @swagger
   * tags:
   *   name: Wallet
   */
  app.use("/wallet", walletRouter());

  /**
   * @swagger
   * tags:
   *   name: Transactions
   */
  app.use("/transactions", transactionRouter());

  /**
   * @swagger
   * tags:
   *   name: Settings
   */
  app.use("/settings", settingsRouter());

  // dev - call this route when there are changes to the schema of any model to update the changes
  app.use("/dev-update", async (req, res) => {
    try {
      await adminService.devUpdate();
      await MessagesService.devUpdate();
      await settingsService.devUpdate();
      await transactionService.devUpdate();
      await usersService.devUpdate();
      await walletService.devUpdate();
      return res.send("done");
    } catch (error: any) {
      res.status(400).send(error.message ?? "failed");
    }
  });
}
