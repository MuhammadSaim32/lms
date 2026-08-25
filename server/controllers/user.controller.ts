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
    if (user.provider !== "local") {
        throw new ErrorHandler(`Please login using ${user.provider}`, 400);
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
    res.status(200).json({
        success: true,
        message: "Logout successful"
    })
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




export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.status(200).json({
        success: true,
        users
    })
})






export const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        throw new ErrorHandler("User not found", 404);
    }
    await user.deleteOne();

    res.status(200).json({

        success: true,
        message: "User deleted successfully"
    })

})


export const githubAuth = catchAsync(async (req: Request, res: Response) => {
    const { code } = req.body;

    if (code == undefined) {
        throw new ErrorHandler("Code is required", 400)
    }

    const tokenResponse = await fetch(process.env.GITHUB_CODE_EXCHANGE_URI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_SECRET,
            code: code
        })
    })

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
        throw new ErrorHandler(tokenData.error_description || "GitHub auth failed", 400)
    }

    const userEmail = await fetch(process.env.GITHUB_USER_INFO_URI + "/emails", {
        headers: {
            "Authorization": `token ${tokenData.access_token}`,
            "Accept": "application/json"
        }
    })

    const EmailData = await userEmail.json();
    const primaryEmail = EmailData.find((e) => e.primary && e.verified);

    if (!primaryEmail) {
        throw new ErrorHandler("GitHub auth failed", 400)
    }

    const email = primaryEmail?.email;

    const user = await User.findOne({ email });

    if (user && user.provider !== "github") {
        if (user.provider === "google") {
            throw new ErrorHandler(`Please login using Google`, 400)
        }
        throw new ErrorHandler(`User with that Email already exists`, 400)
    }

    const userData = await fetch(process.env.GITHUB_USER_INFO_URI, {
        headers: {
            "Authorization": `token ${tokenData.access_token}`,
            "Accept": "application/json"
        }
    })

    const userInfo = await userData.json();

    const name = userInfo.name || userInfo.login;
    const image = userInfo.avatar_url;
    if (!user) {

        const newUser = await User.create({ name, email, avatar: { public_id: "", url: image }, provider: "github", isVerified: true });
        return sendTokens(newUser, 200, res);
    }

    const updatedData = await User.findOneAndUpdate({ email }, { name, avatar: { public_id: "", url: image } }, { new: true })
    sendTokens(updatedData, 200, res);
})



export const googleAuth = catchAsync(async (req: Request, res: Response) => {
    const { code } = req.body;

    if (code == undefined) {
        throw new ErrorHandler("Code is required", 400)
    }
    const tokenResponse = await fetch(process.env.GOOGLE_CODE_EXCHANGE_URI, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            client_id: process.env.GOOGE_CLIENT_ID,
            client_secret: process.env.GOOGE_SECRET,
            code: code,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code"
        })
    })

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
        throw new ErrorHandler("Google auth failed", 400)
    }
    const userInfoResponse = await fetch(process.env.GOOGLE_USER_INFO_URI, {
        headers: {
            "Authorization": `Bearer ${tokenData.access_token}`,
            "Accept": "application/json"
        }
    })
    const userInfo = await userInfoResponse.json();
    if (!userInfo.verified_email) {
        throw new ErrorHandler("Google auth failed Email is not verified", 400)
    }

    const name = userInfo.name
    const email = userInfo.email;
    const image = userInfo.picture;

    const user = await User.findOne({ email });

    if (user && user.provider !== "google") {
        if (user.provider === "github") {
            throw new ErrorHandler(`Please login using GitHub`, 400)
        }
        throw new ErrorHandler(`User with that Email already exists`, 400)
    }

    if (!user) {

        const newUser = await User.create({ name, email, avatar: { public_id: "", url: image }, provider: "google", isVerified: true });
        return sendTokens(newUser, 200, res);
    }

    const updatedData = await User.findOneAndUpdate({ email }, { name, avatar: { public_id: "", url: image } }, { new: true })
    sendTokens(updatedData, 200, res);


})



export const getUsersAnalytics = catchAsync(async (req: Request, res: Response) => {

    const data = await User.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalCount: { $sum: 1 }
            }
        }
    ])

    const months = [{ name: "January", count: 0 }, { name: "February", count: 0 }, { name: "March", count: 0 }, { name: "April", count: 0 }, { name: "May", count: 0 }, { name: "June", count: 0 }, { name: "July", count: 0 }, { name: "August", count: 0 }, { name: "September", count: 0 }, { name: "October", count: 0 }, { name: "November", count: 0 }, { name: "December", count: 0 }]
    const analyticsdata = data.map((item) => {
        const monthIndex = item._id - 1;
        months[monthIndex].count = item.totalCount;
    })

    res.status(200).json({
        success: true,
        months
    })

})