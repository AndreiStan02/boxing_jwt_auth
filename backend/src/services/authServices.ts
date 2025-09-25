import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  APP_ORIGIN,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
} from "src/constants/env.js";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from "src/constants/http.js";
import VerificationCodeType from "src/constants/verificationCodeType.js";
import prisma from "src/db/prismaClient.js";
import { appAsert } from "src/util/appAsert.js";
import {
  ONE_DAY_MS,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "src/util/date.js";
import { RefreshTokenPayload, verifyToken } from "src/util/jwt.js";
import { getVerifyEmailTemplate, sendMail } from "src/util/mail.js";

type CreateAccountParams = {
  username: string;
  email: string;
  password: string;
  userAgent?: string | undefined;
};

export const createAccount = async (data: CreateAccountParams) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username: data.username }, { email: data.email }],
    },
    select: {
      id: true,
    },
  });

  appAsert(!existingUser, CONFLICT, "Email or User name already in use.");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const newUser = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
    },
  });

  // Create verification code
  const newVerificationCode = await prisma.verificationCode.create({
    data: {
      userId: newUser.id,
      type: VerificationCodeType.EmailVerification,
      expiresAt: oneYearFromNow(),
    },
  });

  // Send verification email
  const url = `${APP_ORIGIN}/email/verify/${newVerificationCode.id}`;
  const { error } = await sendMail({
    to: newUser.email,
    ...getVerifyEmailTemplate(url),
  });

  if (error) {
    console.log(error);
  }

  // Create session
  const newSession = await prisma.session.create({
    data: {
      userId: newUser.id,
      userAgent: data.userAgent,
      expiresAt: thirtyDaysFromNow(),
    },
  });
  // Sign access token & refresh token
  const refreshToken = jwt.sign(
    { sessionId: newSession.id },
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );

  const accessToken = jwt.sign(
    {
      userId: newUser.id,
      sessionId: newSession.id,
    },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );

  // Return user and tokens
  const { id, password, ...publicUser } = newUser;
  return {
    user: publicUser,
    accessToken,
    refreshToken,
  };
};

type LoginParams = {
  usernameOrEmail: string;
  unhashedPassword: string;
  userAgent?: string | undefined;
};

export const loginUser = async ({
  usernameOrEmail,
  unhashedPassword,
  userAgent,
}: LoginParams) => {
  // Find user with user name or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
  });
  appAsert(user, UNAUTHORIZED, "Invalid email or password.");

  // Check if password is right
  const validPassword = await bcrypt.compare(unhashedPassword, user.password);
  appAsert(validPassword, UNAUTHORIZED, "Invalid email or password.");

  // Create session
  const newSession = await prisma.session.create({
    data: {
      userId: user.id,
      userAgent: userAgent,
      expiresAt: thirtyDaysFromNow(),
    },
  });
  // Sign access token & refresh token
  const refreshToken = jwt.sign(
    { sessionId: newSession.id },
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );

  const accessToken = jwt.sign(
    {
      userId: user.id,
      sessionId: newSession.id,
    },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );

  // Return user and tokens
  const { id, password, ...publicUser } = user;
  return {
    user: publicUser,
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  // We get the refreshToken from the user
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: JWT_REFRESH_SECRET,
  });
  appAsert(payload, UNAUTHORIZED, "Invalid refresh token");

  // We search the session with the same id
  const session = await prisma.session.findFirst({
    where: {
      id: payload.sessionId,
    },
  });
  const now = Date.now();
  appAsert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  // Refresh the session if it expires in the next 24h
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: thirtyDaysFromNow(),
      },
    });
  }

  const newRefreshToken = sessionNeedsRefresh
    ? jwt.sign({ sessionId: session.id }, JWT_REFRESH_SECRET, {
        audience: ["user"],
        expiresIn: "30d",
      })
    : undefined;

  const accessToken = jwt.sign(
    {
      userId: session.userId,
      sessionId: session.id,
    },
    JWT_SECRET,
    {
      audience: ["user"],
      expiresIn: "15m",
    }
  );

  return {
    accessToken: accessToken,
    newRefreshToken: newRefreshToken,
  };
};

export const verifyEmail = async (code: string) => {
  console.log(code);
  //Get the verification code
  const validCode = await prisma.verificationCode.findFirst({
    where: {
      id: code,
      type: VerificationCodeType.EmailVerification,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
  appAsert(validCode, NOT_FOUND, "Invalid or expired verification code");

  //Update user verified to true
  const user = await prisma.user.update({
    where: {
      id: validCode.userId,
    },
    data: {
      verified: true,
    },
  });
  appAsert(user, INTERNAL_SERVER_ERROR, "Failed to verify email");

  //Delete verification code from db
  await prisma.verificationCode.delete({
    where: {
      id: validCode.id,
    },
  });

  //Return user
  const { id, password, ...publicUser } = user;
  return {
    user: publicUser,
  };
};
