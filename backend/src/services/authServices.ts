import { APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET } from "src/constants/env.js";
import { CONFLICT } from "src/constants/http.js";
import  jwt  from 'jsonwebtoken';
import { oneYearFromNow } from "src/util/date.js";
import prisma from "src/db/prismaClient.js";
import { appAsert } from "src/util/appAsert.js";
import bcrypt from 'bcrypt'
import { getVerifyEmailTemplate, sendMail } from "src/util/mail.js";
import VerificationCodeType from "src/constants/verificationCodeType.js";

type User = {
    username: string,
    email: string,
    password: string,
}

type CreateAccountParams = {
    username: string;
    email: string;
    password: string;
    userAgent?: string | undefined;
}

export const createAccount = async (data:CreateAccountParams) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: data.username },
                { email: data.email }
            ]
        },
        select: {
            id: true,
        }
    });

    appAsert(!existingUser, CONFLICT, "Email or User name already in use.")

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const newUser = await prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            password: hashedPassword
        }
    })

    // Create verification code
    const verificationCode = await VerificationCodeModel.create({
        userId: newUser.id,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow()
    })

    // Send verification email
    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
    const {error} = await sendMail({
        to: newUser.email,
        ...getVerifyEmailTemplate(url),
    });

    if(error){
        console.log(error);
    }

    // Create session
    const session = await SessionModel.create({
        userId: user._id,
        userAgent: data.userAgent,
    });

    // Sign access token & refresh token
    const refreshToken = jwt.sign(
        { sessionId: session._id },
        JWT_REFRESH_SECRET, {
            audience: ['user'],
            expiresIn: "30d",
        }
    );

    const accessToken = jwt.sign(
        {
            userId: user._id,
            sessionId: session._id
        },
        JWT_SECRET, {
            audience: ['user'],
            expiresIn: "15m",
        }
    );

    // Return user and tokens
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    }
}