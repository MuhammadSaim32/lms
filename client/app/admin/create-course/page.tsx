"use client"

import { useState } from "react"
import CourseInfo from "./components/CourseInfo"
import CourseOptions from "./components/courseOptions"
import CourseContent from "./components/courseContent"
import CoursePreview from "./components/coursePreview"
import courseApi from "../../../api/CourseApi"
import routes from "../../../routes"

export default function CreateCourse() {
    const [step, setStep] = useState(1)
    const [courseData, setcourseData] = useState({
        courseInfo: {},
        courseOptions: {},
        courseContent: {},
        coursePreview: {}
    })

    const handleSubmit = async (contentValue: any) => {
        const updatedData = { ...courseData, courseContent: contentValue };
        setcourseData(updatedData);

        const info = updatedData.courseInfo as any;
        const options = updatedData.courseOptions as any;
        const content = updatedData.courseContent as any;

        // Reshape to match backend Mongoose schema exactly
        const payload = {
            name: info.courseName,
            price: Number(info.coursePrice),
            estimatedPrice: Number(info.estimatedPrice) || 0,
            tags: info.courseTags ? info.courseTags.split(",").map((t: string) => t.trim()) : [],
            level: info.courseLevel,
            demoUrl: info.demoUrl,
            description: info.courseDescription,
            benefits: (options.benifits || []).map((b: any) => ({ title: b.value })),
            prerequisites: (options.prevreq || []).map((p: any) => ({ title: p.value })),
            courseData: (content.Sections || []).map((section: any) => ({
                videoSection: section.SectionName,
                videoSectionData: (section.SectionItems || []).map((item: any) => ({
                    title: item.Videotitle,
                    description: item.Videodescription,
                    videoUrl: item.Videourl,
                    thumbnail: {},
                    suggestion: item.linkTitle || "",
                })),
            })),
        };

        console.log("Submitting course payload:", payload);

        try {
            const response = await courseApi.createCourse(routes.uploadCourse, payload);
            console.log("Course created successfully:", response);
        } catch (error) {
            console.error("Failed to create course:", error);
        }
    }




    return (

        <div className="w-full">
            {step == 1 && <CourseInfo setcourseData={setcourseData} setStep={setStep} />}
            {step == 2 && <CourseOptions setcourseData={setcourseData} setStep={setStep} />}
            {step == 3 && <CourseContent handleSubmit={handleSubmit} setStep={setStep} />}
            {step == 4 && <CoursePreview />}


        </div>


    )



}