import express from "express"
import { AuthMiddleware } from "../middleware/auth.js"
import { getAllCourses, getSingleCourse, uploadCourse, updateCourse, getCoureseByUser, addQuestion, addAnswer, addReview, addReplyReview, addAnswer } from "../controllers/course.conroller.js"
const CourseRouter = express.Router()

CourseRouter.post("/upload-course", AuthMiddleware, uploadCourse)
CourseRouter.put("/update-course/:id", AuthMiddleware, updateCourse)
CourseRouter.get("/get-course/:id", getSingleCourse)
CourseRouter.get("/get-all-courses", getAllCourses)
CourseRouter.get("/get-courses-by-use/:id", AuthMiddleware, getCoureseByUser)
CourseRouter.put("/add-question", AuthMiddleware, addQuestion)
CourseRouter.put("/add-answer", AuthMiddleware, addAnswer)
CourseRouter.put("/add-review/:id", AuthMiddleware, addReview)
CourseRouter.put("/add-reply-to-review", AuthMiddleware, addReplyReview)


export default CourseRouter