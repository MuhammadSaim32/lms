import mongoose from "mongoose";
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


