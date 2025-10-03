import { Router } from "express";
import { authenticate } from "src/middleware/authenticate.js";
import { getUserHandler } from "../controller/userController.js";

export const userRoutes = Router();

userRoutes.get("/", authenticate, getUserHandler);
