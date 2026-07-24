import { Redis } from 'ioredis'
import dotenv from 'dotenv';
dotenv.config({
     path: `.env.${process.env.NODE_ENV}`,

})
const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log("Redis Connected")
        return process.env.REDIS_URL
    } else {
        throw new Error("Redis Connection Failed")
    }
}

export const redis = new Redis(redisClient())
