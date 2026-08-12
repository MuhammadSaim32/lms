"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import courseApi from "@/api/CourseApi";
import { routes } from "@/routes";
import { useAuth } from "@/context/AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

export default function CourseDetail() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const { data: userData } = useAuth();

  useEffect(() => {
    const fetchCourseData = async () => {
      const id = params?.id as string;
      if (id) {
        try {
          setLoading(true);
          const response = await courseApi.getCourses(
            routes.getCourseNoAuth(id),
          );
          setCourse(response.data?.course || null);
        } catch (error) {
          console.error("Failed to fetch course details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourseData();
  }, [params]);

  const isEnrolled = userData?.userData?.course?.some(
    (c: any) => c.courseId === params?.id || c._id === params?.id,
  );

  const handleBuyCourse = async () => {
    const id = params?.id as string;
    if (!id) return;
    try {
      setPurchasing(true);
      const data = await courseApi.createSession(routes.createSession(id));
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Failed to start checkout session:", err);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-sm">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-medium cursor-pointer group"
        >
          <ArrowBackIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Courses
        </button>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Section (Course Details) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                  {course?.tags || "Interactive Live Class"}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <WorkspacePremiumIcon className="w-4 h-4 text-amber-400" />
                  Verified Certification
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {course?.name}
              </h1>

              <p className="text-slate-300 text-base leading-relaxed">
                {course?.description || "Master new skills with step-by-step guidance, real-world projects, and expert mentorship."}
              </p>
            </div>

            {/* What You Will Learn Card */}
            {course?.benefits && course.benefits.length > 0 && (
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2.5">
                  <CheckCircleIcon className="text-indigo-400" />
                  What You Will Learn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.benefits.map((val: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/50 hover:border-slate-700/60 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-400 mt-2 shrink-0" />
                      <span className="text-sm text-slate-200 leading-snug">{val.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites Card */}
            {course?.prerequisites && course.prerequisites.length > 0 && (
              <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2.5">
                  <MenuBookIcon className="text-indigo-400" />
                  Course Prerequisites
                </h2>
                <ul className="space-y-3">
                  {course.prerequisites.map((val: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span>{val.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Sidebar Section (Video Preview & Action Card) */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
              {/* Media Preview Container */}
              <div className="relative aspect-video bg-black w-full overflow-hidden">
                {course?.demoUrl ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${course?.demoUrl}?autoplay=0&rel=0`}
                    title="Course Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-950">
                    <PlayCircleIcon className="w-16 h-16 mb-2 opacity-50" />
                    <span className="text-sm font-medium">Video Preview Unavailable</span>
                  </div>
                )}
              </div>

              {/* Action Box */}
              <div className="p-6 space-y-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-white">
                      ${course?.price ? course.price : "Free"}
                    </span>
                    {course?.estimatedPrice && (
                      <span className="text-slate-500 line-through text-sm ml-2">
                        ${course.estimatedPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Full Lifetime Access
                  </span>
                </div>

                {/* Main Action Button */}
                {isEnrolled ? (
                  <a
                    href={`/course-access/${params?.id}`}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-center text-base"
                  >
                    <LockOpenIcon className="w-5 h-5" />
                    Enter Live Course Area
                  </a>
                ) : (
                  <button
                    onClick={handleBuyCourse}
                    disabled={purchasing}
                    className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 text-center text-base cursor-pointer disabled:opacity-50"
                  >
                    <ShoppingBagIcon className="w-5 h-5" />
                    {purchasing ? "Processing..." : "Enroll & Start Now"}
                  </button>
                )}

                <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Course Level</span>
                    <span className="text-slate-200 font-semibold">{course?.level || "Beginner to Advanced"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language</span>
                    <span className="text-slate-200 font-semibold">English</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Certificate</span>
                    <span className="text-slate-200 font-semibold">Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

