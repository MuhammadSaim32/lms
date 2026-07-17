import dotenv from 'dotenv';
dotenv.config()
import { httpServer as app } from './app.js';
import connectDB from './utils/db.js';
import seedTestUser from './utils/seedUser.js';
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.CLOUD_API_KEY as string,
    api_secret: process.env.CLOUD_API_SECRET as string
});

const start = async () => {
    try {
        await connectDB();
        await seedTestUser();
        app.listen(process.env.PORT, () => {
            console.log(`Server Started At  Port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error(error)
    }
}

start();