import express from "express"
import { registerUser, activateUser, loginUser, logoutUser } from "../controllers/user.controller.js"
import { AuthMiddleware } from "../middleware/auth.js"
const UserRouter = express.Router()

UserRouter.post("/register", registerUser)
UserRouter.post("/activate-user", activateUser)
UserRouter.post("/login", loginUser)
UserRouter.get("/logout", AuthMiddleware, logoutUser)


export default UserRouter