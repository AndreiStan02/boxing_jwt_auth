import "express";
import type { RequestHandler } from "express";
import { AppErrorCode } from "../constants/appErrorCode.js";
import { UNAUTHORIZED } from "../constants/http.js";
import { appAsert } from "../util/appAsert.js";
import { verifyToken } from "../util/jwt.js";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    sessionId?: string;
  }
}

export const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAsert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken);
  appAsert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  req.userId = payload.userId as string;
  next();
};
