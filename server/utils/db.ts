import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const dbUrl: string = process.env.DB_URI || ""

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl)
        console.log("Database Connected")
    } catch (error) {
        console.log(error)
    }
}

export default connectDB


