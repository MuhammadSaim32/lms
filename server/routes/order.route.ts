import express from "express"
import { AuthMiddleware } from "../middleware/auth.js"
import { createOrder } from "../controllers/order.controller.js"
const OrderRouter = express.Router()

OrderRouter.post("/create-order", AuthMiddleware, createOrder)


export default OrderRouter
