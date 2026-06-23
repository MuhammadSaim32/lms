
import dotenv from "dotenv";
dotenv.config();
import { type Request, type Response, type NextFunction } from "express";
import User, { type IUser } from "../models/user.models.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsync from "../middleware/catchAsync.js";
import jwt, { type Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendEmail from "../utils/sendMail.js";
import bcrypt from "bcryptjs"

interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
}


export const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, avatar }: IRegisterUser = req.body;
    const isEmailExits = await User.findOne({ email });
    if (isEmailExits) {
        return next(new ErrorHandler("User already exists", 400));
    }
    const user: IRegisterUser = {
        name,
        email,
        password,
    }


    const { token, activationCode } = createActivationToken(user)
    const pathToFile = path.join(import.meta.dirname, "../mails/activation-mail.ejs")
    const data = { user: { name: user.name }, activationCode };
    const html = await ejs.renderFile(pathToFile, data)
    await sendEmail({ html, subject: "Account Activation Email", UserEmail: user.email })

    res.status(200).json({
        success: true,
        message: "Activation Email Sent",
        data: {
            token: token
        }

    })


})

interface IActivateUser {
    activationCode: string;
    token: string
}

const activateUser = catchAsync(async (req: Request, res: Response) => {

    const { activationCode, token } = req.body
    const data = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET as Secret)
    conssole.log(data)
    // const compare = await bcrypt.compare(activationCode, hashedActivationCode)

    // if (!compare) {
    //     throw (new ErrorHandler("Invalid activation code", 400))
    // }
    // User.create(user)
    // res.status(200).json({
    //     success: true,
    //     message: "Account Activated Successfully"
    // })



})



const createActivationToken = async (user: IRegisterUser) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedActivationCode = await bcrypt.hash(activationCode, 10)
    console.log(activationCode, hashedActivationCode)
    const token = jwt.sign({ user, hashedActivationCode }, process.env.ACTIVATION_TOKEN_SECRET as Secret, {
        expiresIn: "5m"
    })
    return { token, activationCode }
}