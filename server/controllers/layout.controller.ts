import { type Request, type Response, type NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import catchAsync from "../middleware/catchAsync.js";
import LayoutModel from "../models/layout.models.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createLayout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    let LayoutDb
    if (data.type == "Banner") {

        const uploadResult = await cloudinary.uploader.upload(data.image, { folder: "Banner" })
        const bannerData = {
            image: {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            },
            title: data.title,
            subTitle: data.subTitle
        }
        LayoutDb = await LayoutModel.create({ type: data.type, banner: bannerData })


    }

    if (data.type == "FAQ") {
        const faqData = data.faq
        LayoutDb = await LayoutModel.create({ type: data.type, faq: faqData })
    }

    if (data.type == "Category") {
        const categoryData = data.categories
        LayoutDb = await LayoutModel.create({ type: data.type, categories: categoryData })
    }

    res.status(201).json({
        success: true,
        message: " Layout Created Successfully",
        data: { LayoutDb }


    })
})

export const getLayout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.query
    const layout = await LayoutModel.findOne({ type })
    res.status(200).json({
        success: true,
        layout,
    })
})