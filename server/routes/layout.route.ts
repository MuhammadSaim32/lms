import express from "express"
import { AuthMiddleware } from "../middleware/auth.js"
import { createLayout, getLayout } from "../controllers/layout.controller.js"

const LayoutRouter = express.Router()

LayoutRouter.post("/create-layout", AuthMiddleware, createLayout)
LayoutRouter.get("/get-layout", getLayout)

export default LayoutRouter
