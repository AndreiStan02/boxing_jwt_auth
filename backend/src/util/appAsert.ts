import assert from "node:assert"
import { AppError, AppErrorCode } from "./appError.js"
import type { HttpStatusCode } from "../constants/http.js"

type AppAsert = (
    condition: any,
    httpStatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode,
) => asserts condition;

export const appAsert: AppAsert = (condition, httpStatusCode, message, appErrorCode) => assert(condition, 
    new AppError(httpStatusCode, message, appErrorCode))