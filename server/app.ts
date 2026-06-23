import dotenv from 'dotenv';
dotenv.config()
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middleware/error.js";
import UserRouter from './routes/user.route.js';
export const app = express();


app.use(cors({
    origin: process.env.ORIGIN
}))


app.use(express.json({ limit: "50mb" }))

app.use(cookieParser())


app.get("/test", (_, res) => {
    res.status(200).json({
        success: true,
        message: "Api is working..."
    })
})


app.use("/api/v1",UserRouter)

app.all("*name", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not exists`) as any
    err.status = "404"
    next(err)
})






app.use(ErrorMiddleware)