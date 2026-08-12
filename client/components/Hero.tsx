"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import Faq from "../components/faq";
import courseApi from "@/api/CourseApi";
import layoutApi from "@/api/LayoutApi";
import { routes } from "@/routes";
import Image from "next/image";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

const Hero = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [banner, setBanner] = useState<any>(null);

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
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Text Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <AutoAwesomeIcon className="w-4 h-4" />
                Next-Gen Interactive Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {banner?.title || "Improve Your Online Learning Experience Instantly"}
              </h1>

              <p className="text-slate-300 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {banner?.subTitle || "Explore thousands of live interactive courses led by top industry experts to boost your career and master new skills."}
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href="#courses"
                  className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 text-base cursor-pointer"
                >
                  Explore Courses
                  <ArrowForwardIcon className="w-5 h-5" />
                </a>
              </div>

              <div className="pt-6 flex items-center justify-center lg:justify-start gap-6 text-slate-400 text-xs font-medium border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-indigo-400"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  <StarIcon className="w-4 h-4" />
                  <span className="text-slate-200 font-bold">4.9/5</span> Rating
                </div>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>

                <div className="relative bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-2xl overflow-hidden max-w-[420px]">
                  {banner?.image?.url ? (
                    <div className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] rounded-2xl overflow-hidden">
                      <Image
                        src={banner.image.url}
                        alt={banner?.title || "Hero Image"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-[340px] h-[340px] bg-slate-950 rounded-2xl flex flex-col items-center justify-center text-slate-600">
                      <SchoolIcon className="w-20 h-20 mb-3 opacity-40" />
                      <span className="text-sm font-semibold">Elevate Your Learning</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Catalog Section */}
      <section id="courses" className="py-16 bg-slate-900/40 border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Curated Syllabus
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Expand Your Opportunities With Our Courses
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Discover top-rated live interactive programs designed to accelerate your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.length > 0 ? (
              courses.map((course: any) => (
                <Link href={`/course/${course._id}`} key={course._id} className="group">
                  <div className="bg-slate-900 border border-slate-800/90 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full">
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-slate-950 overflow-hidden">
                      {course.thumbnail?.url ? (
                        <img
                          src={course.thumbnail.url}
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950">
                          <PlayCircleIcon className="w-12 h-12 mb-1 opacity-30" />
                          <span className="text-xs">No Preview</span>
                        </div>
                      )}
                      <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-emerald-400 font-bold text-xs border border-slate-800">
                        {course.price === 0 ? "Free" : `$${course.price}`}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                      <div className="space-y-2">
                        <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                          {course.tags || "Live Course"}
                        </span>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                          {course.name}
                        </h3>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                        <span>Enroll Now</span>
                        <ArrowForwardIcon className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 text-sm">
                No courses available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Faq />
        </div>
      </section>
    </div>
  );
};

export default Hero;