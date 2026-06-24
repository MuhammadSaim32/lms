import { type Request, type Response, type NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import { redis } from "../utils/redis.js"
import catchAsync from "./catchAsync.js";

export const AuthMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const accessToken = req.cookies.accessToken || ""

    if (!accessToken) {
        throw new ErrorHandler("Please Login To Access this Resource", 401)
    }

    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret) as JwtPayload

    if (!user) {
        throw new ErrorHandler("Access Token  is inavlid", 401)
    }
    const userData = await redis.get(user.id)
    if (!userData) {
        throw new ErrorHandler("user not found", 401)
    }

    req.user = JSON.parse(userData).user

    next()


})