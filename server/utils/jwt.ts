
import { type Response } from "express";
import { type IUser } from "../models/user.models.js";
import { redis } from "./redis.js"

const sendTokens = (user: IUser, statusCode: number, res: Response) => {
    const accessToken = user.giveAccessToken()
    const refreshToken = user.giveRefreshToken()


    redis.set(user._id.toString(), JSON.stringify({ user }))

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN ?? "60", 10) * 60 * 1000
    })

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15", 10) * 60 * 1000
    })


    res.status(statusCode).json({
        success: true,
        message: "Login successful",
    })


}

export default sendTokens
