import { Router } from "express";
import schemaParser from "../../middleware/schemaParser";
import { loginSchema } from "../../lib/schemas";
import { signupSchema } from "./user.schema";
import { generateAPIKey, profile, userLogin, userSignup } from "./users.controller";
import protectedRoute from "../../middleware/protectedRoute";

export default function UsersRouter() {
  const router = Router();

  /**
   * @swagger
   * /users/signup:
   *  post:
   *    summary: User signup
   *    tags: [Users]
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *          schema:
   *            $ref: '#/components/schemas/signup'
   */
  router.post("/signup", schemaParser(signupSchema), userSignup);

  /**
   * @swagger
   * /users/login:
   *  post:
   *    summary: User login
   *    tags: [Users]
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *          schema:
   *            $ref: '#/components/schemas/login'
   */
  router.post("/login", schemaParser(loginSchema), userLogin);

  /**
   * @swagger
   * /users/api-key:
   *  get:
   *    summary: Get API key
   *    description: Generates a new key
   *    tags: [Users]
   */
  router.get("/api-key", protectedRoute("user"),  generateAPIKey);
 
  /**
   * @swagger
   * /users/profile:
   *  get:
   *    summary: Get Logged-in user profile
   *    tags: [Users]
   */
  router.get("/profile", protectedRoute("user"), profile);

  return router;
}
