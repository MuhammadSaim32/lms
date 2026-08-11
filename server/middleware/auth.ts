import { type Request, type Response, type NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import catchAsync from "./catchAsync.js";
import userModel from "../models/user.models.js";

export const AuthMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const accessToken = req.cookies.accessToken || ""

    if (!accessToken) {
        throw new ErrorHandler("Please Login To Access this Resource", 401)
    }

    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as Secret) as JwtPayload

    if (!user) {
        throw new ErrorHandler("Access Token  is inavlid", 401)
    }
    const userData = await userModel.findById(user.id)

    if (!userData) {
        throw new ErrorHandler("user not found", 401)
    }

    // req.user = JSON.parse(userData).user
    req.user = userData

    next()


})