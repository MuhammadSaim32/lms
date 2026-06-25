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
import Course from "../models/course.models.js";
import Order from "../models/order.models.js";
import Notification from "../models/notificatoin.models.js";



export const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, payment_info } = req.body;


    const isCourseAlreadyPurchased = req.user?.course.some((course: any) => course.courseId === courseId);

    if (isCourseAlreadyPurchased) {
        return next(new ErrorHandler("Course already purchased", 400));
    }


    const isCourse = await Course.findById(courseId);

    if (!isCourse) {
        throw new ErrorHandler("Course not found", 404);
    }




    const order = await Order.create({
        courseId,
        userId: req.user!._id.toString(),
    });

    const pathToFile = path.join(import.meta.dirname, "../mails/order.ejs")
    const data = { order: { userName: req.user?.name, courseName: isCourse.name, price: isCourse.price } }
    const html = await ejs.renderFile(pathToFile, data)
    await sendEmail({ html, subject: "Order Confirmation", UserEmail: req.user!.email })

    const user = await User.findById(req.user!._id.toString())
    user?.course.push(courseId)
    await user?.save()

    const notification = await Notification.create({
        userId: req.user!._id.toString(),
        title: "New Order",
        message: `You have new orderd from ${isCourse.name} course`,
        status: "unread",
    })

    isCourse.purchased! += 1
    await isCourse.save()

    res.status(201).json({
        success: true,
        order,
    });
})



export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.status(200).json({
        success: true,
        orders
    })
})