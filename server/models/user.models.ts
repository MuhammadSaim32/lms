import mongoose, { Document, model, Schema } from "mongoose";
import jwt, { type Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    otp: string
    course: Array<{ courseId: string }>
    comparePassword: (password: string) => Promise<boolean>;
    giveAccessToken: () => string;
    giveRefreshToken: () => string;

}


const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Enter your email"],
        validate: {
            validator: function (v: string) {
                return emailRegex.test(v)
            },
            message: "Please enter valid email"
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, "Enter your password"],
        minLength: [6, "Password must be at least 6 characters long"]

    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    course: [{ courseId: String }]


}, { timestamps: true })


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.giveAccessToken = function () {
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN ? parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN) : 15;
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: expiresIn * 60 })
}

userSchema.methods.giveRefreshToken = function () {
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN ? parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN) : 60;
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: expiresIn * 60 })
}


export default model<IUser>("User", userSchema);