import { Router } from "express";
import { adminLogin, profile } from "./admin.controller";
import protectedRoute from "../../middleware/protectedRoute";
import schemaParser from "../../middleware/schemaParser";
import { loginSchema } from "../../lib/schemas";

export default function adminRouter() {
  const router = Router();

  /**
   * @swagger
   * /admin/login:
   *  post:
   *    summary: Admin login
   *    tags: [Admin]
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *          schema:
   *            $ref: '#/components/schemas/login'
   */
  router.post("/login", schemaParser(loginSchema), adminLogin);

  /**
   * @swagger
   * /admin/profile:
   *  get:
   *    summary: Get admin profile
   *    tags: [Admin]
   */
  router.get("/profile", protectedRoute("admin"), profile);
  return router;
}
