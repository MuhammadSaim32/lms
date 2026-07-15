import { type Request, type Response, type NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import catchAsync from "../middleware/catchAsync.js";
import LayoutModel from "../models/layout.models.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createLayout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    let LayoutDb;

    const isTypeExist = await LayoutModel.findOne({ type: data.type });

    if (isTypeExist) {
        if (data.type === "Banner") {
            const bannerData: any = {
                title: data.title !== undefined ? data.title : isTypeExist.banner?.title,
                subTitle: data.subTitle !== undefined ? data.subTitle : isTypeExist.banner?.subTitle,
                image: isTypeExist.banner?.image
            };

            if (data.image) {
                if (isTypeExist.banner?.image?.public_id) {
                    await cloudinary.uploader.destroy(isTypeExist.banner.image.public_id)
                }
                const uploadResult = await cloudinary.uploader.upload(data.image, { folder: "Banner" });
                bannerData.image = {
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url
                };
            }

            LayoutDb = await LayoutModel.findByIdAndUpdate(isTypeExist._id, { banner: bannerData }, { new: true });
        } else if (data.type === "FAQ") {
            LayoutDb = await LayoutModel.findByIdAndUpdate(isTypeExist._id, { faq: data.faq || isTypeExist.faq }, { new: true });
        } else if (data.type === "Category") {
            LayoutDb = await LayoutModel.findByIdAndUpdate(isTypeExist._id, { categories: data.categories || isTypeExist.categories }, { new: true });
        }

        return res.status(200).json({
            success: true,
            message: "Layout Updated Successfully",
            data: { LayoutDb }
        });
    }

    if (data.type === "Banner") {
        if (!data.image || !data.title || !data.subTitle) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        const uploadResult = await cloudinary.uploader.upload(data.image, { folder: "Banner" });
        const bannerData = {
            image: {
                public_id: uploadResult.public_id,
                url: uploadResult.secure_url
            },
            title: data.title,
            subTitle: data.subTitle
        };
        LayoutDb = await LayoutModel.create({ type: data.type, banner: bannerData });

    } else if (data.type === "FAQ") {
        if (!data.faq) throw new ErrorHandler("All fields are required", 400)
        LayoutDb = await LayoutModel.create({ type: data.type, faq: data.faq });

    } else if (data.type === "Category") {
        if (!data.categories) throw new ErrorHandler("All fields are required", 400)
        LayoutDb = await LayoutModel.create({ type: data.type, categories: data.categories });
    }

    res.status(201).json({
        success: true,
        message: "Layout Created Successfully",
        data: { LayoutDb }
    });
});

export const getLayout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.query
    const layout = await LayoutModel.findOne({ type })
    res.status(200).json({
        success: true,
        layout,
    })
})