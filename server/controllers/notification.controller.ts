import { type Request, type Response, type NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsync from "../middleware/catchAsync.js";
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


