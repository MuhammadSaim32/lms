"use client";

import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ImageIcon from "@mui/icons-material/Image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CourseInfo({
  setcourseData,
  setStep,
  initialValues,
}: any) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isNewPic, setIsNewPic] = useState(false);
  const fileRef = useRef<any>(null);

  const courseInfoSchema = yup.object({
    courseName: yup.string().required("Course name is required"),
    courseDescription: yup.string().required("Course description is required"),
    coursePrice: yup.number().required("Course price is required"),
    estimatedPrice: yup.number(),
    courseTags: yup.string().required("Course tags is required"),
    courseLevel: yup.string().required("Course level is required"),
    demoUrl: yup
      .string()
      .matches(
        /^[A-Za-z0-9_-]{11}$/,
        "Video ID must be a valid 11-character YouTube ID"
      )
      .required("Video ID is required"),
    pic: yup
      .mixed()
      .required("Course thumbnail is required")
      .test("fileType", "Only image files are allowed", (value) => {
        if (!value) return false;
        if (typeof value === "string") return true;
        return value.type && value.type.startsWith("image/");
      }),
  });

  useEffect(() => {
    if (
      initialValues &&
      initialValues.pic &&
      typeof initialValues.pic === "string"
    ) {
      setFileUrl(initialValues.pic);
      setIsNewPic(false);
    }
  }, [initialValues]);

  const formik = useFormik({
    initialValues: initialValues || {
      courseName: "",
      courseDescription: "",
      coursePrice: "",
      estimatedPrice: "",
      courseTags: "",
      courseLevel: "",
      demoUrl: "",
      pic: "",
    },
    enableReinitialize: true,
    validationSchema: courseInfoSchema,
    onSubmit: async (values) => {
      if (typeof values.pic !== "string") {
        const base64: string = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(values.pic as unknown as File);
        });

        values.pic = base64;
      }

      values.picIsNew = isNewPic;

      console.log("values in the course data ", values);
      setcourseData((prev: any) => ({ ...prev, courseInfo: values }));

      setStep(2);
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 my-4">
      <Card className="bg-slate-900/80 border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-slate-800/80 pb-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl text-white font-extrabold tracking-tight">
                Course Details
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Provide the main metadata, pricing structure, and thumbnail for your course.
              </CardDescription>
            </div>
            <Badge variant="default" className="bg-indigo-600/90 text-white font-medium text-xs px-3 py-1">
              Step 1 of 4
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Course Title */}
            <div className="space-y-2">
              <label htmlFor="courseName" className="block text-xs font-semibold text-slate-300">
                Course Name <span className="text-rose-400">*</span>
              </label>
              <input
                id="courseName"
                type="text"
                placeholder="e.g. Complete Web Development Bootcamp 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
                {...formik.getFieldProps("courseName")}
              />
              {formik.touched.courseName && formik.errors.courseName && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{String(formik.errors.courseName)}</p>
              )}
            </div>

            {/* Course Description */}
            <div className="space-y-2">
              <label htmlFor="courseDescription" className="block text-xs font-semibold text-slate-300">
                Course Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="courseDescription"
                rows={4}
                placeholder="Write a detailed description explaining what students will learn..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all resize-none"
                {...formik.getFieldProps("courseDescription")}
              />
              {formik.touched.courseDescription && formik.errors.courseDescription && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{String(formik.errors.courseDescription)}</p>
              )}
            </div>

            {/* Pricing Section (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="coursePrice" className="block text-xs font-semibold text-slate-300">
                  Course Price ($) <span className="text-rose-400">*</span>
                </label>
                <input
                  id="coursePrice"
                  type="number"
                  placeholder="29.99"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
                  {...formik.getFieldProps("coursePrice")}
                />
                {formik.touched.coursePrice && formik.errors.coursePrice && (
                  <p className="text-xs text-rose-400 mt-1 font-medium">{String(formik.errors.coursePrice)}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="estimatedPrice" className="block text-xs font-semibold text-slate-300">
                  Estimated / Original Price ($)
                </label>
                <input
                  id="estimatedPrice"
                  type="number"
                  placeholder="99.99"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
                  {...formik.getFieldProps("estimatedPrice")}
                />
                {formik.touched.estimatedPrice && formik.errors.estimatedPrice && (
                  <p className="text-xs text-rose-400 mt-1 font-medium">{String(formik.errors.estimatedPrice)}</p>
                )}
              </div>
            </div>

            {/* Course Tags */}
            <div className="space-y-2">
              <label htmlFor="courseTags" className="block text-xs font-semibold text-slate-300">
                Course Tags <span className="text-rose-400">*</span>
              </label>
              <input
                id="courseTags"
                type="text"
                placeholder="e.g. Next.js, React, Tailwind, TypeScript"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
                {...formik.getFieldProps("courseTags")}
              />
              {formik.touched.courseTags && formik.errors.courseTags && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{String(formik.errors.courseTags)}</p>
              )}
            </div>

            {/* Level & Demo URL (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="courseLevel" className="block text-xs font-semibold text-slate-300">
                  Difficulty Level <span className="text-rose-400">*</span>
                </label>
                <input
                  id="courseLevel"
                  type="text"
                  placeholder="e.g. Beginner, Intermediate, Advanced"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
                  {...formik.getFieldProps("courseLevel")}
                />
                {formik.touched.courseLevel && formik.errors.courseLevel && (
                  <p className="text-xs text-rose-400 mt-1 font-medium">{String(formik.errors.courseLevel)}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="demoUrl" className="block text-xs font-semibold text-slate-300">
                  Demo Video ID <span className="text-rose-400">*</span>
                </label>
                <input
                  id="demoUrl"
                  type="text"
                  placeholder="e.g. https://www.youtube.com/embed/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
                  {...formik.getFieldProps("demoUrl")}
                />
                {formik.touched.demoUrl && formik.errors.demoUrl && (
                  <p className="text-xs text-rose-400 mt-1 font-medium">{String(formik.errors.demoUrl)}</p>
                )}
              </div>
            </div>

            {/* Thumbnail Image File Upload Area */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-300">
                Course Thumbnail <span className="text-rose-400">*</span>
              </label>

              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                className="hidden"
                name="pic"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith("image/")) {
                    formik.setFieldError("pic", "Only image files are allowed");
                    return;
                  }
                  setIsNewPic(true);
                  formik.setFieldValue("pic", file);
                  const generatedUrl = URL.createObjectURL(file);
                  setFileUrl(generatedUrl);
                }}
              />

              <div
                onClick={() => fileRef.current?.click()}
                className={`w-full min-h-[160px] border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${fileUrl
                    ? "border-indigo-500/60 bg-indigo-500/5 hover:bg-indigo-500/10"
                    : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
              >
                {fileUrl ? (
                  <div className="relative group w-full flex flex-col items-center">
                    <img
                      src={fileUrl}
                      alt="Thumbnail Preview"
                      className="max-h-44 rounded-lg object-cover shadow-lg border border-slate-700"
                    />
                    <span className="mt-3 text-xs text-indigo-400 font-semibold group-hover:underline">
                      Click to change image
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center py-4">
                    <div className="p-3 rounded-full bg-slate-900 text-indigo-400 border border-slate-800">
                      <CloudUploadIcon style={{ fontSize: 28 }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Click to upload course thumbnail
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {formik.touched.pic && formik.errors.pic && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{String(formik.errors.pic)}</p>
              )}
            </div>

            {/* Form Actions Footer */}
            <div className="flex justify-end pt-4 border-t border-slate-800/80">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowForwardIcon style={{ fontSize: 16 }} />
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
