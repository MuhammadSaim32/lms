"use client";

import { useState } from "react";
import CourseInfo from "./components/CourseInfo";
import CourseOptions from "./components/courseOptions";
import CourseContent from "./components/courseContent";
import CoursePreview from "./components/coursePreview";

export default function CreateCourse() {
  const [step, setStep] = useState(1);
  const [courseData, setcourseData] = useState({
    courseInfo: {
      courseName: "",
      courseDescription: "",
      coursePrice: "",
      estimatedPrice: "",
      courseTags: "",
      courseLevel: "",
      demoUrl: "",
      pic: "",
    },
    courseOptions: {
      benifits: [],
      prevreq: [],
    },
    courseContent: {
      Sections: [],
    },
    coursePreview: {},
  });

  return (
    <div className="w-full">
      {step === 1 && (
        <CourseInfo
          setcourseData={setcourseData}
          setStep={setStep}
          initialValues={courseData.courseInfo}
        />
      )}
      {step === 2 && (
        <CourseOptions
          setcourseData={setcourseData}
          setStep={setStep}
          initialValues={courseData.courseOptions}
        />
      )}
      {step === 3 && (
        <CourseContent
          setcourseData={setcourseData}
          setStep={setStep}
          initialValues={courseData.courseContent}
        />
      )}
      {step === 4 && (
        <CoursePreview
          courseData={courseData}
          setStep={setStep}
        />
      )}
    </div>
  );
}
