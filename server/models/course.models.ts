import mongoose, { Document, model, Schema } from "mongoose";

export interface IComment {
    user: Object
    question: string
    QuestionReply?: IComment[]
}


interface IReview {
    user: Object
    rating: number
    comment: string
    commentReplies?: { user: Object, comment: string }[]
}


interface ILink extends Document {
    title: string
    url: string
}

interface ICourseDatat extends Document {
    videoSection: string;
    videoSectionData: [
        {
            title: string;
            description: string;
            videoUrl: string;
            thumbnail: Object;
            questions: IComment[];
            suggestion: string
        }
    ]

}


interface ICourse extends Document {
    courseData: ICourseDatat[]
    price: number;
    estimatedPrice: number;
    purchased?: number,
    rating?: number;
    reviews?: IReview[];
    tags: string[];
    level: string;
    demoUrl: string;
    benefits?: { title: string }[];
    prerequisites?: { title: string }[];
    name: string;
    description: string
    thumbnail: Object
}

const commentSchema = new Schema<IComment>({
    user: { type: Object, required: true },
    question: { type: String, required: true },
    QuestionReply: [Object]

})


const reviewSchema = new Schema<IReview>({
    user: { type: Object, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    commentReplies: [
        {
            user: Object,
            comment: String
        }
    ]
})


const linkSchema = new Schema<ILink>({
    title: { type: String, required: true },
    url: { type: String, required: true },
})

const courseDataSchema = new Schema<ICourseDatat>({
    videoSection: { type: String, required: true },
    videoSectionData: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            videoUrl: { type: String, required: true },
            thumbnail: { type: Object, required: true },
            questions: [commentSchema],
            suggestion: { type: String, required: true }
        }

    ],

})

const courseSchema = new Schema<ICourse>({
    price: { type: Number, required: true },
    estimatedPrice: { type: Number, required: true },
    purchased: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], default: [] },
    tags: { type: [String], required: true },
    level: { type: String, required: true },
    demoUrl: { type: String, required: true },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    courseData: [courseDataSchema],
    name: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: {
        public_id: { type: String },
        url: { type: String }
    }

})

const CourseModel = model<ICourse>("Course", courseSchema);
export default CourseModel;