"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import courseApi from "@/api/CourseApi";
import routes from "@/routes";


import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PublishIcon from "@mui/icons-material/Publish";
import SchoolIcon from "@mui/icons-material/School";
import MovieIcon from "@mui/icons-material/Movie";
import TagIcon from "@mui/icons-material/LocalOffer";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CoursePreview({ courseData, setStep, isEdit = false, courseId }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const info = courseData?.courseInfo || {};
  const options = courseData?.courseOptions || {};
  const content = courseData?.courseContent || {};

  const handlePublishCourse = async () => {
    setIsSubmitting(true);

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

    if (info.public_id) {
      payload.public_id = info.public_id;
    }

    if (info.pic && typeof info.pic === "string" && info.pic.startsWith("data:image/")) {
      payload.pic = info.pic;
    }

    try {
      if (isEdit && courseId) {
        const response = await courseApi.updateCourse(
          routes.updateCourse(courseId),
          payload
        );
        toast.success(response?.message || "Course updated successfully!");
      } else {
        const response = await courseApi.createCourse(
          routes.uploadCourse,
          payload
        );
        toast.success(response?.message || "Course created successfully!");
      }
      router.push("/admin/courses");
    } catch (error: any) {
      console.error("Failed to save course:", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to save course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tagsList = info.courseTags
    ? info.courseTags.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 my-4 space-y-6">
      {/* Top Card Banner */}
      <Card className="bg-slate-900/80 border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-slate-800/80 pb-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl text-white font-extrabold tracking-tight flex items-center gap-2">
                <SchoolIcon className="text-indigo-400" style={{ fontSize: 24 }} />
                Course Preview & Final Publish
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Review your course details, curriculum structure, and pricing before publishing.
              </CardDescription>
            </div>
            <Badge variant="default" className="bg-emerald-600/90 text-white font-medium text-xs px-3 py-1">
              Step 4 of 4
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-8">
          {/* Main Course Header Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Thumbnail Preview */}
            <div className="md:col-span-1">
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video md:aspect-square flex items-center justify-center">
                {info.pic ? (
                  <img
                    src={info.pic}
                    alt={info.courseName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-500 text-xs flex flex-col items-center gap-2">
                    <PlayCircleIcon style={{ fontSize: 32 }} />
                    <span>No Thumbnail</span>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-slate-900/90 text-indigo-400 border-indigo-500/30 text-[10px]">
                    {info.courseLevel || "All Levels"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Main Info */}
            <div className="md:col-span-2 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h1 className="text-xl font-black text-white leading-snug">
                  {info.courseName || "Untitled Course"}
                </h1>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {info.courseDescription || "No description provided."}
                </p>
              </div>

              {/* Tags */}
              {tagsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tagsList.map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/80"
                    >
                      <TagIcon style={{ fontSize: 11 }} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Pricing Display */}
              <div className="pt-2 flex items-baseline gap-3">
                <span className="text-2xl font-black text-indigo-400">
                  ${info.coursePrice || "0.00"}
                </span>
                {info.estimatedPrice && Number(info.estimatedPrice) > 0 && (
                  <span className="text-sm text-slate-500 line-through">
                    ${info.estimatedPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80" />

          {/* Benefits & Prerequisites (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Benefits */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <CheckCircleIcon className="text-emerald-400" style={{ fontSize: 16 }} />
                What You'll Learn
              </h3>
              <ul className="space-y-2">
                {(options.benifits || []).map((b: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{b.value || b.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <CheckCircleIcon className="text-cyan-400" style={{ fontSize: 16 }} />
                Prerequisites
              </h3>
              <ul className="space-y-2">
                {(options.prevreq || []).map((p: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{p.value || p.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/80" />

          {/* Curriculum Structure */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MovieIcon className="text-indigo-400" style={{ fontSize: 18 }} />
              Curriculum Overview ({(content.Sections || []).length} Sections)
            </h3>

            <div className="space-y-3">
              {(content.Sections || []).map((section: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden"
                >
                  <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>
                      Section {idx + 1}: {section.SectionName}
                    </span>
                    <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-700">
                      {(section.SectionItems || []).length} Lectures
                    </Badge>
                  </div>
                  <div className="p-3 divide-y divide-slate-800/60">
                    {(section.SectionItems || []).map((item: any, iIdx: number) => (
                      <div
                        key={iIdx}
                        className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 text-slate-300">
                          <PlayCircleIcon className="text-indigo-400" style={{ fontSize: 14 }} />
                          <span className="font-medium">{item.Videotitle}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {item.videoLength ? `${item.videoLength} mins` : "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Navigation Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              <ArrowBackIcon style={{ fontSize: 16 }} />
              <span>Back to Content</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handlePublishCourse}
              className="inline-flex items-center gap-2 px-7 py-3 text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Publishing Course...</span>
                </>
              ) : (
                <>
                  <PublishIcon style={{ fontSize: 16 }} />
                  <span>Publish Course Now</span>
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}