import { Router } from "express";
import { loginHandler, signupHandler } from "./handler";

const router = Router();

// Authentication routes
router.post("/signup", signupHandler);
router.post("/login", loginHandler);

export default router;
