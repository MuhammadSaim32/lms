import express from "express"
import { registerUser } from "../controllers/user.controller.js"
const UserRouter =express.Router()

UserRouter.post("/register",registerUser)


export default UserRouter