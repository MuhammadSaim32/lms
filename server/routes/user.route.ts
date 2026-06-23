import express from "express"
import { registerUser, activateUser } from "../controllers/user.controller.js"
const UserRouter = express.Router()

UserRouter.post("/register", registerUser)
UserRouter.post("/activate-user", activateUser)


export default UserRouter