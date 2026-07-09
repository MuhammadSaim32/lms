"use client"

import { useState } from "react"
import CourseInfo from "./components/CourseInfo"
import CourseOptions from "./components/courseOptions"
import CourseContent from "./components/courseContent"
export default function CreateCourse() {
    const [step, setStep] = useState(3)
    const [courseData, setcourseData] = useState({
        courseInfo: {},
        courseOptions: {},
        courseContent: {},
        coursePreview: {}

    })




    return (

        <div className="w-full">
            {step == 1 && <CourseInfo setcourseData={setcourseData} setStep={setStep} />}
            {step == 2 && <CourseOptions setcourseData={setcourseData} setStep={setStep} />}
            {step == 3 && <CourseContent />}


        </div>


    )



}