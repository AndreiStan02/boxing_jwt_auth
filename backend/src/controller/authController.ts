import { CREATED } from "src/constants/http.js";
import { createAccount } from "src/services/authServices.js";
import { catchErrors } from "src/util/catchErrors.js";
import { setAuthCookies } from "src/util/cookies.js";
import z from "zod";

const registerSchema = z.object({
    username: z.string().min(3).max(25),
    email: z.string().email().min(1).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match.",
    path: ["confirmPassword"],
});

export const registerHandler = catchErrors( 
    async (req, res) => {
        // validate request
        const request = registerSchema.parse({...req.body, userAgent: req.headers["user-agent"],});
        // call service
        const {user, accessToken, refreshToken} = await createAccount(request);
        // return response
        return setAuthCookies({res, accessToken, refreshToken})
            .status(CREATED)
            .json(user);
    }
);