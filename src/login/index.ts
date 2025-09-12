import { Router } from "express";
import { signupHandler, loginHandler } from "./handler";
import { signupSchema, loginSchema } from "./schema";

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/Signup'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or duplicate user
 */
router.post("/signup", signupHandler);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post("/login", loginHandler);

export default router;
