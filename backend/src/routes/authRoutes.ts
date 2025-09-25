import { Router } from "express";
import {
  loginHandler,
  refreshHandler,
  registerHandler,
  verifyEmailHandler,
} from "src/controller/authController.js";

export const authRoutes = Router();

//Prefix: /auth
authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);
