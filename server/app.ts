import dotenv from 'dotenv';
dotenv.config()
import express from "express"
import cors from "cors"
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/error.js";
import UserRouter from './routes/user.route.js';
import CourseRouter from './routes/course.route.js';
import OrderRouter from './routes/order.route.js';
import NotificationRouter from './routes/notification.route.js';
import LayoutRouter from './routes/layout.route.js';
import morgan from 'morgan';
const app = express();
export const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"],
        credentials: true
    }
});



app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))

app.set('io', io);







app.use(cookieParser())
app.set('trust proxy', 1);

app.use(cookieParser());
app.use(morgan(':remote-addr :method :url :status :response-time ms - :date[iso]'));

app.get("/test", (_, res) => {
    res.status(200).json({
        success: true,
        message: "Api is working..."
    })
})



app.use("/api/v1", OrderRouter, UserRouter, CourseRouter, NotificationRouter, LayoutRouter)

app.all("*name", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not exists`) as any
    err.status = "404"
    next(err)
})






app.use(ErrorMiddleware)