import dotenv from 'dotenv';
dotenv.config()
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/error.js";
import UserRouter from './routes/user.route.js';
import CourseRouter from './routes/course.route.js';
import OrderRouter from './routes/order.route.js';
import NotificationRouter from './routes/notification.route.js';
export const app = express();


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))


app.use(express.json({ limit: "50mb" }))

app.use(cookieParser())


app.get("/test", (_, res) => {
    res.status(200).json({
        success: true,
        message: "Api is working..."
    })
})


app.use("/api/v1", UserRouter, OrderRouter, CourseRouter, NotificationRouter)

app.all("*name", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not exists`) as any
    err.status = "404"
    next(err)
})






app.use(ErrorMiddleware)