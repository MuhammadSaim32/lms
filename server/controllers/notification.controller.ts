import { type Request, type Response, type NextFunction } from "express";
import User, { type IUser } from "../models/user.models.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsync from "../middleware/catchAsync.js";
import jwt, { type Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendEmail from "../utils/sendMail.js";
import bcrypt from "bcryptjs"
import sendTokens from "../utils/jwt.js";
import { redis } from "../utils/redis.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notificatoin.models.js";


export const getAllNotification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const notifications = await Notification.find().sort({ createdAt: -1 })

    res.status(200).json({
        success: true,
        notifications
    })
})



export const updateNotificationStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
        return next(new ErrorHandler("Notification not found", 404))
    }

    notification.status = "read"
    await notification.save()
    const notifications = await Notification.find().sort({ createdAt: -1 })

    res.status(200).json({
        success: true,
        notifications,
        message: "Notification updated successfully"
    })
})


