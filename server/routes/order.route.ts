import express from "express"
import { AuthMiddleware } from "../middleware/auth.js"
import { createOrder, createCheckoutSession, handleStripeWebhook } from "../controllers/order.controller.js"
const OrderRouter = express.Router()

OrderRouter.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook)
OrderRouter.use(express.json({ limit: "50mb" }))
OrderRouter.post("/create-order", AuthMiddleware, createOrder)
OrderRouter.get('/createSession/:id', AuthMiddleware, createCheckoutSession)

export default OrderRouter
