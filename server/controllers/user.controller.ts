
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
import sendTokens from "../utils/jwt.js";
import { redis } from "../utils/redis.js";

interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
}


interface IActivateUser {
    activationCode: string;
    token: string
}

interface IActivationTokenPayload {
    user: IRegisterUser;
    hashedActivationCode: string;
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


    const { token, activationCode } = await createActivationToken(user)
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

export const activateUser = catchAsync(async (req: Request, res: Response) => {
    const { activationCode, token } = req.body
    const { user, hashedActivationCode } = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET as Secret) as IActivationTokenPayload

    const compare = await bcrypt.compare(activationCode, hashedActivationCode)
    if (!compare) {
        throw (new ErrorHandler("Invalid activation code", 400))
    }

    User.create(user)
    res.status(200).json({
        success: true,
        message: "Account Activated Successfully"
    })



})



const createActivationToken = async (user: IRegisterUser): Promise<{ token: string, activationCode: string }> => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedActivationCode = await bcrypt.hash(activationCode, 10)
    const token = jwt.sign({ user, hashedActivationCode }, process.env.ACTIVATION_TOKEN_SECRET as Secret, {
        expiresIn: "5m"
    })
    return { token, activationCode }
}


export const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    sendTokens(user, 200, res)

})


export const logoutUser = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    const user = req.user as IUser;
    // await redis.del(user._id.toString());
    res.status(200).json({
        success: true,
        message: "Logout successful"
    })
})