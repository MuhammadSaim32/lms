"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import Faq from "../components/faq"
import courseApi from "@/api/CourseApi";
import layoutApi from "@/api/LayoutApi";
import { routes } from "@/routes";
import Image from "next/image";
import Loading from "./Loading";

const Hero = () => {
    const [courses, setCourses] = useState([]);
    const [banner, setBanner] = useState(null);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseApi.getCourses(routes.getAllCourses);
                setCourses(response.data?.courses || []);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };

        const fetchBanner = async () => {
            try {
                const response = await layoutApi.getLayout(routes.getLayout("Banner"));
                setBanner(response?.layout?.banner || null);
            } catch (error) {
                console.error("Failed to fetch banner:", error);
            }
        };

        fetchCourses();
        fetchBanner();
    }, []);

    return (

        <div className="bg-slate-900  min-h-screen flex flex-col justify-center items-center  border-t-2 border-white p-10 overflow-y-clip">

            <div className="h-screen w-screen font-bold text-white bg-slate-900 flex justify-evenly items-center ">
                <div className="h-[80%] w-[40%]">
                    {banner?.image?.url ?
                        <Avatar
                            sx={{ width: "400px", height: "400px" }}
                            component="span" // Avatar renders as span so we can nest Image
                        >
                            <Image
                                src={banner?.image?.url}
                                alt={banner?.title || 'Hero'}
                                width={400}
                                height={400}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                priority
                            />
                        </Avatar> : (
                            null
                        )
                    }
                </div>
                <div className="w-[40%] h-[80%]">
                    <div className="text-6xl mb-2">{banner?.subTitle}</div>
                    <div className="h-[10%] text-xl">{banner?.title}</div>
                </div>
            </div>
            <div className="h-auto mb-28 flex justify-start flex-col items-center "
                id="courses">
                <h1 className="text-3xl mb-8 text-center font-bold text-white  ">
                    Expand Your opportunities with Our Courses
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
                                    <h2 className="text-xl text-white font-bold">{course.name}</h2>
                                    <p className="mt-2 text-green-400">
                                        {course.price === 0 ? "Free" : `$${course.price}`}
                                    </p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        null
                    )}
                </div>
            </div>

            <Faq />
        </div>
    )
}


export default Hero;