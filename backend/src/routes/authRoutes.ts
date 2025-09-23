import { Router } from "express";
import { registerHandler } from "src/controller/authController.js";

export const authRoutes = Router();

//Prefix: /auth
authRoutes.post("/register", registerHandler);