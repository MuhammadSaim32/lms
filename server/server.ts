import dotenv from 'dotenv';
dotenv.config()
import { app } from './app.js';
import connectDB from './utils/db.js';
app.listen(process.env.PORT, () => {
    console.log(`Server Started At  Port ${process.env.PORT}`)
    connectDB()
})