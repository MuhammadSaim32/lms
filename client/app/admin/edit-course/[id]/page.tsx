"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CourseInfo from "../../create-course/components/CourseInfo";
import CourseOptions from "../../create-course/components/courseOptions";
import CourseContent from "../../create-course/components/courseContent";
import CoursePreview from "../../create-course/components/coursePreview";
import courseApi from "../../../../api/CourseApi";
import routes from "../../../../routes";

export default function EditCourse() {
  const params = useParams();
  const id = params?.id as string;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [courseData, setcourseData] = useState<any>({
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

  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      try {
        const response = await courseApi.getCourses(routes.getCourse(id));
        const course = response.data?.course;
        console.log("edit course page", course);
        if (course) {
          setcourseData({
            courseInfo: {
              courseName: course.name || "",
              courseDescription: course.description || "",
              coursePrice: course.price?.toString() || "",
              estimatedPrice: course.estimatedPrice?.toString() || "",
              courseTags: course.tags ? course.tags.join(", ") : "",
              courseLevel: course.level || "",
              demoUrl: course.demoUrl || "",
              pic: course.thumbnail.url || "",
              public_id: course.thumbnail.public_id || "",
            },
            courseOptions: {
              benifits: (course.benefits || []).map((b: any) => ({
                placeholder: "Enter Benigits",
                value: b.title || "",
              })),
              prevreq: (course.prerequisites || []).map((p: any) => ({
                placeholder: "Enter PreReq",
                value: p.title || "",
              })),
            },
            courseContent: {
              Sections: (course.courseData || []).map((section: any) => ({
                SectionName: section.videoSection || "",
                SectionItems: (section.videoSectionData || []).map(
                  (item: any) => ({
                    Videotitle: item.title || "",
                    Videourl: item.videoUrl || "",
                    Videodescription: item.description || "",
                    videoLength: item.videoLength || "",
                  }),
                ),
              })),
            },
            coursePreview: {},
          });
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleSubmit = async (contentValue: any) => {
    const updatedData = { ...courseData, courseContent: contentValue };
    setcourseData(updatedData);

    const info = updatedData.courseInfo as any;
    const options = updatedData.courseOptions as any;
    const content = updatedData.courseContent as any;
    console.log("info in teh apge", info);
    // Reshape to match backend Mongoose schema exactly
    const payload: any = {
      name: info.courseName,
      price: Number(info.coursePrice),
      estimatedPrice: Number(info.estimatedPrice) || 0,
      tags: info.courseTags
        ? info.courseTags.split(",").map((t: string) => t.trim())
        : [],
      level: info.courseLevel,
      demoUrl: info.demoUrl,
      description: info.courseDescription,
      public_id: info.public_id,
      benefits: (options.benifits || []).map((b: any) => ({ title: b.value })),
      prerequisites: (options.prevreq || []).map((p: any) => ({
        title: p.value,
      })),
      courseData: (content.Sections || []).map((section: any) => ({
        videoSection: section.SectionName,
        videoSectionData: (section.SectionItems || []).map((item: any) => ({
          title: item.Videotitle,
          description: item.Videodescription,
          videoUrl: item.Videourl,
          videoLength: item.videoLength,
        })),
      })),
    };

    if (info.picIsNew && info.pic) {
      payload.pic = info.pic;
    }

    console.log("Updating course payload:", payload);

    try {
      const response = await courseApi.updateCourse(
        routes.updateCourse(id),
        payload,
      );
      console.log("Course updated successfully:", response);
    } catch (error) {
      console.error("Failed to update course:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading course data...</p>
      </div>
    );
  }

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
          isEdit={true}
          courseId={id}
        />
      )}
    </div>
  );
}
