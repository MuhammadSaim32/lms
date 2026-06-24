import dotenv from 'dotenv';
dotenv.config()
import { app } from './app.js';
import connectDB from './utils/db.js';
import seedTestUser from './utils/seedUser.js';

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