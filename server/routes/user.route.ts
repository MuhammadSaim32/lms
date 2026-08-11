import express from "express"
import { getUsersAnalytics, googleAuth, deleteUser, getAllUsers, registerUser, activateUser, loginUser, logoutUser, getUserProfile, updateUserProfile, updatePassword, githubAuth } from "../controllers/user.controller.js"
import { AuthMiddleware, RoleMiddleware } from "../middleware/auth.js"
const UserRouter = express.Router()
UserRouter.use(express.json({ limit: "50mb" }))


UserRouter.post("/register/github", githubAuth)
UserRouter.post("/register/google", googleAuth)
UserRouter.post("/register", registerUser)
UserRouter.post("/activate-user", activateUser)
UserRouter.post("/login", loginUser)
UserRouter.get("/logout", AuthMiddleware, logoutUser)
UserRouter.get("/me", AuthMiddleware, getUserProfile)
UserRouter.put("/update-profile", AuthMiddleware, updateUserProfile)
UserRouter.put("/update-password", AuthMiddleware, updatePassword)
UserRouter.get("/get-all-users", AuthMiddleware, RoleMiddleware("admin"), getAllUsers)
UserRouter.delete("/delete-user/:id", AuthMiddleware, RoleMiddleware("admin"), deleteUser)
UserRouter.get("/users-analytics", AuthMiddleware, RoleMiddleware("admin"), getUsersAnalytics)
export default UserRouter