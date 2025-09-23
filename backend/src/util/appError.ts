import type { HttpStatusCode } from "../constants/http.js";

export enum AppErrorCode {
    InvalidAccessToken = "InvalidAccessToken",
}

export class AppError extends Error {
    constructor(
        public statusCode: HttpStatusCode,
        public message: string,
        public errorCode?: AppErrorCode
    ){
        super(message);
    }
}