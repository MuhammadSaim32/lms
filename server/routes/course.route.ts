import express from "express"
import { AuthMiddleware, RoleMiddleware } from "../middleware/auth.js"
import { deleteCourse, getAllCoursesForAdmin, getAllCourses, getSingleCourse, uploadCourse, updateCourse, addQuestion, addAnswer, addReview, addReplyReview, } from "../controllers/course.conroller.js"
const CourseRouter = express.Router()
CourseRouter.use(express.json({ limit: "50mb" }))

CourseRouter.post("/upload-course", AuthMiddleware, RoleMiddleware("admin"), uploadCourse)
CourseRouter.put("/update-course/:id", AuthMiddleware, RoleMiddleware("admin"), updateCourse)
CourseRouter.get("/get-course/:id", getSingleCourse)
CourseRouter.get("/get-all-courses", getAllCourses)
CourseRouter.put("/add-question", AuthMiddleware, addQuestion)
CourseRouter.put("/add-answer", AuthMiddleware, addAnswer)
CourseRouter.put("/add-review/:id", AuthMiddleware, addReview)
CourseRouter.put("/add-reply-to-review", AuthMiddleware, RoleMiddleware("admin"), addReplyReview)
CourseRouter.get("/get-all-courses-for-admin", AuthMiddleware, RoleMiddleware("admin"), getAllCoursesForAdmin)
CourseRouter.delete("/delete-course/:id", AuthMiddleware, RoleMiddleware("admin"), deleteCourse)
export default CourseRouter