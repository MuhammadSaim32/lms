import express from "express"
import { AuthMiddleware, RoleMiddleware } from "../middleware/auth.js"
import { createLayout, getLayout } from "../controllers/layout.controller.js"

const LayoutRouter = express.Router()

LayoutRouter.use(express.json({ limit: "50mb" }))

LayoutRouter.post("/create-layout", AuthMiddleware, RoleMiddleware("admin"), createLayout)
LayoutRouter.get("/get-layout", getLayout)

export default LayoutRouter
