import { CREATED, OK, UNAUTHORIZED } from "src/constants/http.js";
import prisma from "src/db/prismaClient.js";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  verifyEmail,
} from "src/services/authServices.js";
import { appAsert } from "src/util/appAsert.js";
import { catchErrors } from "src/util/catchErrors.js";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "src/util/cookies.js";
import { verifyToken } from "src/util/jwt.js";
import z from "zod";

const registerSchema = z
  .object({
    username: z.string().min(3).max(25),
    email: z.string().min(1).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match.",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1).max(255),
  unhashedPassword: z.string().min(6).max(255),
  userAgent: z.string().optional(),
});

const verificationCodeSchema = z.string().min(1).max(25);

export const registerHandler = catchErrors(async (req, res) => {
  // validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  // call service
  const { user, accessToken, refreshToken } = await createAccount(request);
  // return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});

export const loginHandler = catchErrors(async (req, res) => {
  // Validate request
  const request = loginSchema.parse({
    ...req.body,
    userAgen: req.headers["user-agent"],
  });
  // Call service
  const { accessToken, refreshToken } = await loginUser(request);
  // return response
  return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    message: "Login successfull.",
  });
});

export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const { payload } = verifyToken(accessToken);

  if (payload) {
    await prisma.session.delete({
      where: {
        id: payload.sessionId,
      },
    });
  }

  return clearAuthCookies(res).status(OK).json({
    message: "Logout successful",
  });
});

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAsert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  const { accessToken, newRefreshToken } =
    await refreshUserAccessToken(refreshToken);

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access token refreshed",
    });
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  return res.status(OK).json({
    message: "Email was succesfuly verified",
  });
});
