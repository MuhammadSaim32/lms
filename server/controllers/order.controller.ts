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
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


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

export const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id
    const course = await Course.findOne({ _id: id })
    if (!course) {
        throw new ErrorHandler("course not find", 404)
    }

    const isCourseAlreadyPurchased = req.user?.course.some((course: any) => course.courseId === id);

    if (isCourseAlreadyPurchased) {
        throw new ErrorHandler("Course already purchased", 400)
    }
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            metadata: {
                user_id: req.user?._id.toString(),
                courseId: course._id.toString(),
            },
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course.name,
                            images: [course.thumbnail.url],

                        },
                        unit_amount: course.price * 100,

                    },
                    quantity: 1
                },
            ],
            success_url: `${process.env.CLIENT_URL}/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/payment-fail`,
        })
        res.json({ url: session.url })
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

export const handleStripeWebhook = catchAsync(async (req, res) => {
    const webhookSecret = process.env.WEBHOOK_SECRET;
    let event;

    try {
        const signature = req.headers["stripe-signature"];
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed: ${err.message}`);
        return res.sendStatus(400);
    }

    const data = event.data.object;
    const eventType = event.type;

    if (eventType === "checkout.session.completed") {
        const session = event.data.object
        const userId = session.metadata.user_id;
        const courseId = session.metadata.courseId;
        console.log(`Checkout session completed for user ${userId} and order ${courseId}`);
        const findUser = await User.findById(userId);
        if (findUser) {
            findUser.course.push({ courseId: courseId });
            await findUser.save();
        }

    }

    res.status(200).end();
});