import { Router } from "express";
import { getUserHandler } from "../controller/userController.js";

export const userRoutes = Router();

userRoutes.get("/", getUserHandler);
