import { Router } from "express";
import { loginHandler, signupHandler } from "./handler";

const router = Router();

// Authentication routes
router.post("/auth/signup", signupHandler);
router.post("/auth/login", loginHandler);

export default router;
