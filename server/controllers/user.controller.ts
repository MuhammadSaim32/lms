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
        throw new ErrorHandler("User already exists", 400);
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
        throw new ErrorHandler("Invalid email or password", 401);
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        throw new ErrorHandler("Invalid email or password", 401);
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

export const updateRefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken || ""

    if (!refreshToken) {
        throw new ErrorHandler("unAuthorized", 401)
    }

    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret) as { id: string }

    if (!user) {
        throw new ErrorHandler("unAuthorized", 401)
    }

    const userData = await redis.get(user.id)

    if (!userData) {
        throw new ErrorHandler("unAuthorized", 401)
    }
    const userObj = JSON.parse(userData).user as IUser
    sendTokens(userObj, 200, res)

})



export const getUserProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser;
    res.status(200).json({
        success: true,
        data: {
            user
        }
    })
})

export const socailLogin = catchAsync(async (req: Request, res: Response) => {
    const { name, email, avatar } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ name, email, avatar });
    }
    sendTokens(user, 200, res);
});


export const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { name, email } = req.body;

    if (!name && !email) {
        throw new ErrorHandler("At Least One Field is Required", 400);
    }

    let dbUser = await User.findOne({ _id: user._id }).select("-password");
    if (email) {
        const isEmailExists = await User.findOne({ email });

        if (isEmailExists) {
            throw new ErrorHandler("Email already exists", 400);
        }
    }

    if (!dbUser) {
        throw new ErrorHandler("User not found", 404);
    }

    dbUser.email = email || dbUser.email
    dbUser.name = name || dbUser.name

    await dbUser.save()
    await redis.set(dbUser._id.toString(), JSON.stringify({ user: dbUser }))
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
            user: dbUser
        }
    })




})


export const updatePassword = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { oldPassword, newPassword } = req.body;

    const userData = await User.findById(user._id)

    if (oldPassword === newPassword) {
        throw new ErrorHandler("New password cannot be the same as the old password", 400);
    }

    if (userData == null) {
        throw new ErrorHandler("User not found", 404);
    }

    if (userData.password == undefined) {
        throw new ErrorHandler("Password not set for this user", 400);
    }

    if (!(await userData.comparePassword(oldPassword))) {
        throw new ErrorHandler("Old password is incorrect", 400);
    }



    userData.password = newPassword;
    await userData.save();


    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});

export const updateAvatar = catchAsync(async (req: Request, res: Response) => {

    if (req.body?.avatar == undefined) {
        throw new ErrorHandler("Avatar is required", 400)
    }


    const { avatar } = req.body;


    const user = req.user as IUser;
    const userdata = await User.findById(user._id)

    if (userdata == null) {
        throw new ErrorHandler("User not found", 404);
    }

    if (!avatar) {
        throw new ErrorHandler("Avatar is required", 400)
    };

    if (!avatar.public_id == undefined) {
        await cloudinary.uploader.destroy(avatar.public_id)

    }

    const result = await cloudinary.uploader.upload(avatar)
    userdata.avatar = {
        public_id: result.public_id,
        url: result.secure_url
    }
    await userdata.save()
    await redis.set(userdata._id.toString(), JSON.stringify({ user: userdata }))
    res.status(200).json({
        success: true,
        message: "Avatar updated successfully",
        data: {
            user: userdata
        }
    })
})



export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.status(200).json({
        success: true,
        users
    })
})



export const updateRole = catchAsync(async (req: Request, res: Response) => {
    const { id, role } = req.body;
    const user = await User.findById(id);
    if (!user) {
        throw new ErrorHandler("User not found", 404);
    }
    user.role = role;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Role updated successfully",
        data: {
            user
        }
    })

})



export const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        throw new ErrorHandler("User not found", 404);
    }
    await user.deleteOne();

    await redis.del(user._id.toString())
    res.status(200).json({

        success: true,
        message: "User deleted successfully"
    })

})