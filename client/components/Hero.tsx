"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import courseApi from "@/api/CourseApi";
import { routes } from "@/routes";

const Hero = () => {
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseApi.getCourses(routes.getAllCourses);
                setCourses(response.data?.courses || []);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };
        fetchCourses();
    }, []);

    return (

        <div className="bg-slate-900  min-h-screen flex flex-col justify-center items-center text-white border p-10">
            <h1 className="text-3xl mb-8">
                Elearning
            </h1>
            <div className="flex  gap-4 justify-center">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <Link href={`/course/${course._id}`} key={course._id}>
                            <div className="border border-white p-4 w-[300px] h-full cursor-pointer flex flex-col">
                                {course.thumbnail?.url ? (
                                    <img
                                        src={course.thumbnail.url}
                                        alt={course.name}
                                        className="w-full h-[150px] object-cover mb-4"
                                    />
                                ) : (
                                    <div className="w-full h-[150px] border border-gray-500 mb-4 flex items-center justify-center">
                                        No Image
                                    </div>
                                )}
                                <h2 className="text-xl font-bold">{course.name}</h2>
                                <p className="mt-2 text-green-400">
                                    {course.price === 0 ? "Free" : `$${course.price}`}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div>Loading courses...</div>
                )}
            </div>
        </div>
    )
}


export default Hero;