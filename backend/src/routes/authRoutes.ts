import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
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
authRoutes.get("/logout", logoutHandler);
