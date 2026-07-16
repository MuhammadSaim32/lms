import { type Request, type Response, type NextFunction } from "express";
import CourseModel from "../models/course.models.js";
import catchAsync from "../middleware/catchAsync.js";
import { redis } from "../utils/redis.js";
import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../utils/ErrorHandler.js";
import { type IUser } from "../models/user.models.js"
import { type IComment } from "../models/course.models.js"
import sendEmail from "../utils/sendMail.js";

export const uploadCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const data = req.body;
    const thumbnail = data.pic;
    if (thumbnail) {
        console.log("here")
        const uploadResult = await cloudinary.uploader.upload(thumbnail, { folder: "courses" })
        data.thumbnail = {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url
        }
    }

    const course = await CourseModel.create(data)
    res.status(201).json({
        success: true,
        message: "Course Uploaded Successfully",
        data: {
            course
        }
    })

})


export const updateCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id;

    const courseData = req.body
    const thumbnail = courseData.thumbnail
    if (thumbnail) {
        await cloudinary.uploader.destroy(courseData.thumbnail.public_id)
        const uploadResult = await cloudinary.uploader.upload(thumbnail, { folder: "courses" })
        courseData.thumbnail = {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url
        }
    }

    const course = await CourseModel.findByIdAndUpdate(courseId, courseData, { new: true, runValidators: true });
    res.status(200).json({
        success: true,
        message: "Course Updated Successfully",
        data: {
            course
        }
    })

})

export const getSingleCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id as string;
    if (!courseId) {

        throw new ErrorHandler("Course Id is required", 400);
    }

    const isCache = await redis.get(courseId);
    if (isCache) {

        res.status(200).json({
            success: true,
            message: "Course Fetched Successfully",
            data: {
                course: JSON.parse(isCache)
            }
        })



    }
    const course = await CourseModel.findById(courseId)

    await redis.set(courseId, JSON.stringify(course));


    res.status(200).json({
        success: true,
        message: "Course Fetched Successfully",
        data: {
            course
        }
    })

})


export const getAllCourses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const isCache = await redis.get("allCourses");
    if (isCache) {
        res.status(200).json({
            success: true,
            message: "Courses Fetched Successfully",
            data: {
                courses: JSON.parse(isCache)
            }
        })
    }



    const courses = await CourseModel.find().select("-courseData.videoPlayer -courseData.videoUrl -courseData.videoSection -courseData.Links -courseData.questions -courseData.suggestions");
    await redis.set("allCourses", JSON.stringify(courses));
    res.status(200).json({
        success: true,
        message: "Courses Fetched Successfully",
        data: {
            courses
        }
    })

})



export const getCoureseByUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ErrorHandler("User Id is required", 400);
    }

    const courseId = req.params.id as string;

    if (!courseId) {
        throw new ErrorHandler("Course Id is required", 400);
    }


    if (!req.user) {
        throw new ErrorHandler("User not found", 400);
    }
    const isUserEnrolled = req.user.course.find((item: any) => item.courseId === courseId)


    if (!isUserEnrolled) {
        throw new ErrorHandler("You are not enrolled in this course", 400);
    }
    const course = await CourseModel.findById(courseId);



    res.status(200).json({
        success: true,
        message: "Course Fetched Successfully",
        data: {
            course
        }
    })
})


export const addQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { question, courseId, contentId } = req.body;
    const course = await CourseModel.findById(courseId);

    if (!course) {
        throw new ErrorHandler("Course not found", 404);
    }

    let courseData = course.courseData.map((item: any) => item.videoSectionData.find((item) => item._id == contentId));

    if (!courseData) {
        throw new ErrorHandler("Content not found", 404);
    }
    const user = req.user as IUser;

    course.courseData.find((item: any) => item.videoSectionData.find((item) => {
        if (item._id == contentId) {
            item.questions.push({ question, user })
        }
    }));

    await course.save();

    res.status(200).json({
        success: true,
        message: "Question added successfully",
        data: {
            course
        }
    })

})

export const addAnswer = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { answer, questionId, courseId, contentId } = req.body
    const course = await CourseModel.findById(courseId)
    if (!course) {
        throw new ErrorHandler("Course not found", 404)
    }
    const courseData = course.courseData.map((item: any) => item.videoSectionData.find((item) => item._id == contentId));
    console.log("here i courseData", courseData)

    if (!courseData) {
        throw new ErrorHandler("Content not found", 404)
    }
    const question = courseData.find((item: any) => item.questions.find((val) => val?._id == questionId))
    if (!question) {
        throw new ErrorHandler("Question not found", 404)
    }
    const user = req.user as IUser

    course.courseData.map((item: any) => item.videoSectionData.find((item) => {

        if (item._id == contentId) {

            item.questions.map((val) => {
                if (val?._id == questionId) {
                    val.QuestionReply.push({ answer: answer, user })
                }
            })
        }
    }));




    //also implment notifcation here for admin when new answer added

    await course.save()
    res.status(200).json({
        success: true,
        message: "Answer added successfully",
        data: {
            course
        }
    })

})


export const addReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { review, rating } = req.body;
    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId);


    const isEligible = req.user!.course.some((item: any) => item.courseId === courseId)
    // if (!isEligible) {
    //     throw new ErrorHandler("You are not eligible for adding review to this course", 400);
    // }

    if (!course) {
        throw new ErrorHandler("Course not found", 404);
    }

    const user = req.user as IUser;

    course.reviews!.push({ comment: review, user, rating });
    let avg = 0;
    course.reviews!.forEach((item: any) => {
        avg += item.rating;
    })
    course.rating = avg / course.reviews!.length;

    await course.save();

    res.status(200).json({
        success: true,
        message: "Review added successfully",
        data: {
            course
        }
    })
})



export const addReplyReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { review, courseId, reviewId } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!course) {
        throw new ErrorHandler("Course not found", 404);
    }
    const user = req.user as IUser;

    const isReview = course.reviews!.find((item: any) => item._id.toString() === reviewId.toString());

    if (!isReview) {
        throw new ErrorHandler("Review not found", 404);
    }

    isReview.commentReplies?.push({ user, comment: review })

    await course.save();
    res.status(200).json({
        success: true,
        message: "Review added successfully",
        data: {
            course
        }
    })
})


export const getAllCoursesForAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const courses = await CourseModel.find().sort({ createdAt: -1 })

    res.status(200).json({
        success: true,
        message: "Courses Fetched Successfully",
        data: {
            courses
        }
    })

})


export const deleteCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const course = await CourseModel.findById(id);
    if (!course) {
        throw new ErrorHandler("Course not found", 404);
    }
    await course.deleteOne();
    res.status(200).json({
        success: true,
        message: "Course deleted successfully"
    })
})


//admin role autrized
//notifcation 
//send email
//allso setup cron job for deleteing unpurshased course after 24 hours
//allso delte fro, the redis a single course so that data might not be stale

