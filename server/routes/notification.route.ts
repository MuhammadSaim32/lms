import express from "express"
import { AuthMiddleware } from "../middleware/auth.js"
import { getAllNotification, updateNotificationStatus } from "../controllers/notification.controller.js"
const NotificationRouter = express.Router()

NotificationRouter.get("/get-all-notification", AuthMiddleware, getAllNotification)
NotificationRouter.put("/update-notification-status/:id", AuthMiddleware, updateNotificationStatus)


export default NotificationRouter
