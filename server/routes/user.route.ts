import express from "express"
import { deleteUser, updateRole, getAllUsers, registerUser, activateUser, loginUser, logoutUser, updateRefreshToken, getUserProfile, socailLogin, updateUserProfile, updatePassword, updateAvatar } from "../controllers/user.controller.js"
import { AuthMiddleware } from "../middleware/auth.js"
const UserRouter = express.Router()

UserRouter.post("/register", registerUser)
UserRouter.post("/activate-user", activateUser)
UserRouter.post("/login", loginUser)
UserRouter.get("/logout", AuthMiddleware, logoutUser)
UserRouter.get("/refresh-token", updateRefreshToken)
UserRouter.get("/me", AuthMiddleware, getUserProfile)
UserRouter.post("/social-login", socailLogin)
UserRouter.put("/update-profile", AuthMiddleware, updateUserProfile)
UserRouter.put("/update-password", AuthMiddleware, updatePassword)
UserRouter.put("/update-avatar", AuthMiddleware, updateAvatar)
UserRouter.get("/get-all-users", AuthMiddleware, getAllUsers)
UserRouter.put("/update-role", AuthMiddleware, updateRole)
UserRouter.delete("/delete-user/:id", AuthMiddleware, deleteUser)
export default UserRouter