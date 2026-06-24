import express from "express"
import { registerUser, activateUser, loginUser, logoutUser,updateRefreshToken,getUserProfile,socailLogin } from "../controllers/user.controller.js"
import { AuthMiddleware } from "../middleware/auth.js"
const UserRouter = express.Router()

UserRouter.post("/register", registerUser)
UserRouter.post("/activate-user", activateUser)
UserRouter.post("/login", loginUser)
UserRouter.get("/logout", AuthMiddleware, logoutUser)
UserRouter.get("/refresh-token" ,updateRefreshToken)
UserRouter.get("/me", AuthMiddleware, getUserProfile)
UserRouter.post("/social-login", socailLogin)


export default UserRouter