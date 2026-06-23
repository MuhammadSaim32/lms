import ErrorHandler from "../utils/ErrorHandler.js";
import { type Request, type Response, type NextFunction } from "express";



export default (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";


    if (err.name == "CastError") {

        const message = `Resourec not found`;
        err = new ErrorHandler(message, 400)
    }


    if (err.code == 11000) {
        const message = `Resource already exists`;
        err = new ErrorHandler(message, 400)
    }

    if (err.name == "JsonWebTokenError") {
        const message = `Invalid token`;
        err = new ErrorHandler(message, 400)
    }

    if (err.name == "TokenExpiredError") {
        const message = `Token expired`;
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })


}