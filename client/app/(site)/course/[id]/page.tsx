"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import courseApi from "@/api/CourseApi";
import { routes } from "@/routes";
import { useAuth } from "@/context/AuthContext";

export default function CourseDetail() {
  const params = useParams();
  const [course, setCourse] = useState(null);
  const { data: userData } = useAuth();
  useEffect(() => {
    const fetchCourseData = async () => {
      const id = params?.id as string;
      if (id) {
        try {
          const response = await courseApi.getCourses(routes.getCourse(id));
          setCourse(response.data?.course || null);
        } catch (error) {
          console.error("Failed to fetch course details:", error);
        }
      }
    };

    fetchCourseData();
  }, [params]);
  console.log(course);

  return (
    <div className="flex h-screen w-screen  bg-gray-500 justify-between p-6">
      <div className="w-[65%] flex flex-col gap-6 bg">
        <h1 className="text-white text-2xl">{course?.name}</h1>

        <div className="flex flex-col gap-3">
          <h1>What You Will Learn From THis Course</h1>
          <div className="flex flex-col gap-2">
            {course?.benefits.map((val, idx) => (
              <div key={idx}>{val.title}</div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h1>What are the prerequisites for this course </h1>
          <div className="flex flex-col gap-2">
            {course?.prerequisites.map((val, idx) => (
              <div key={idx}>{val.title}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <iframe
          width="560"
          height="315"
          src={`${course?.demoUrl}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>

        {userData?.userData?.course?.some(
          (c: any) => c.courseId === params?.id,
        ) ? (
          <a
            href={`/course-access/${params?.id}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md text-center block"
          >
            Enter Course
          </a>
        ) : (
          <button
            onClick={async () => {
              const id = params?.id as string;
              if (!id) return;
              try {
                const data = await courseApi.createSession(
                  routes.createSession(id),
                );
                if (data?.url) {
                  window.location.href = data.url;
                }
              } catch (err) {
                console.error("Failed to start checkout session:", err);
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md text-center "
          >
            Buy Course
          </button>
        )}
      </div>
    </div>
  );
}
