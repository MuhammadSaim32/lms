"use client";

import { useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as yup from "yup";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MovieIcon from "@mui/icons-material/Movie";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CourseContent({
  setcourseData,
  setStep,
  handleSubmit,
  initialValues,
}: any) {
  const [active, setActive] = useState([true]);

  const courseContentSchema = yup.object({
    Sections: yup
      .array()
      .of(
        yup.object({
          SectionName: yup.string().required("Section name is required"),
          SectionItems: yup
            .array()
            .of(
              yup.object({
                Videotitle: yup.string().required("Video title is required"),
                Videourl: yup
                  .string()
                  .matches(
                    /^[A-Za-z0-9_-]{11}$/,
                    "Video ID must be a valid 11-character YouTube ID"
                  )
                  .required("Video ID is required"),
                Videodescription: yup
                  .string()
                  .required("Description is required"),
                videoLength: yup
                  .number()
                  .typeError("Video length must be a number")
                  .required("Video length is required"),
              })
            )
            .min(1, "At least one video item is required in the section"),
        })
      )
      .min(1, "At least one section is required"),
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 my-4">
      <Card className="bg-slate-900/80 border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-slate-800/80 pb-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl text-white font-extrabold tracking-tight">
                Course Curriculum & Content
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Organize your course into structured sections and add video lectures.
              </CardDescription>
            </div>
            <Badge variant="default" className="bg-indigo-600/90 text-white font-medium text-xs px-3 py-1">
              Step 3 of 4
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Formik
            initialValues={
              initialValues &&
              initialValues.Sections &&
              initialValues.Sections.length > 0
                ? initialValues
                : {
                    Sections: [
                      {
                        SectionName: "Introduction",
                        SectionItems: [
                          {
                            Videotitle: "",
                            Videourl: "",
                            Videodescription: "",
                            videoLength: "",
                          },
                        ],
                      },
                    ],
                  }
            }
            enableReinitialize={true}
            validationSchema={courseContentSchema}
            onSubmit={async (values) => {
              if (typeof setcourseData === "function") {
                setcourseData((prev: any) => ({ ...prev, courseContent: values }));
              }
              if (typeof handleSubmit === "function") {
                await handleSubmit(values);
              }
              setStep(4);
            }}
          >
            {({ values }) => (
              <Form className="space-y-6">
                <FieldArray name="Sections">
                  {({ push, remove }) => (
                    <div className="space-y-6">
                      {values.Sections.map((section: any, index: number) => {
                        const isExpanded = active[index] !== false;

                        return (
                          <div
                            key={index}
                            className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-md"
                          >
                            {/* Section Header */}
                            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="p-2 rounded-lg bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
                                  Section {index + 1}
                                </span>
                                <Field
                                  name={`Sections.${index}.SectionName`}
                                  placeholder="e.g. Getting Started with React"
                                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80"
                                />
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActive((prev) => {
                                      const arr = [...prev];
                                      arr[index] = !isExpanded;
                                      return arr;
                                    });
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                                  title={isExpanded ? "Collapse Section" : "Expand Section"}
                                >
                                  {isExpanded ? (
                                    <KeyboardArrowUpIcon fontSize="small" />
                                  ) : (
                                    <KeyboardArrowDownIcon fontSize="small" />
                                  )}
                                </button>
                                {values.Sections.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                                    title="Delete Section"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <ErrorMessage
                              name={`Sections.${index}.SectionName`}
                              component="div"
                              className="px-4 py-1 text-xs text-rose-400 font-medium"
                            />

                            {/* Section Items Body */}
                            {isExpanded && (
                              <div className="p-4 sm:p-5 space-y-5">
                                <FieldArray name={`Sections.${index}.SectionItems`}>
                                  {({ push: pushItem, remove: removeItem }) => (
                                    <div className="space-y-4">
                                      {section.SectionItems.map(
                                        (item: any, iIndex: number) => (
                                          <div
                                            key={iIndex}
                                            className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-4 relative group"
                                          >
                                            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                                              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                                <MovieIcon className="text-indigo-400" style={{ fontSize: 16 }} />
                                                <span>Lecture {iIndex + 1}</span>
                                              </div>
                                              {section.SectionItems.length > 1 && (
                                                <button
                                                  type="button"
                                                  onClick={() => removeItem(iIndex)}
                                                  className="text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                                >
                                                  Remove Lecture
                                                </button>
                                              )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                              {/* Video Title */}
                                              <div className="space-y-1">
                                                <label className="block text-[11px] font-semibold text-slate-300">
                                                  Video Title <span className="text-rose-400">*</span>
                                                </label>
                                                <Field
                                                  name={`Sections.${index}.SectionItems.${iIndex}.Videotitle`}
                                                  placeholder="e.g. Introduction & Setup"
                                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80"
                                                />
                                                <ErrorMessage
                                                  name={`Sections.${index}.SectionItems.${iIndex}.Videotitle`}
                                                  component="div"
                                                  className="text-[11px] text-rose-400 font-medium"
                                                />
                                              </div>

                                              {/* Video ID */}
                                              <div className="space-y-1">
                                                <label className="block text-[11px] font-semibold text-slate-300">
                                                  YouTube Video ID (11 chars) <span className="text-rose-400">*</span>
                                                </label>
                                                <Field
                                                  name={`Sections.${index}.SectionItems.${iIndex}.Videourl`}
                                                  placeholder="e.g. dQw4w9WgXcQ"
                                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80"
                                                />
                                                <ErrorMessage
                                                  name={`Sections.${index}.SectionItems.${iIndex}.Videourl`}
                                                  component="div"
                                                  className="text-[11px] text-rose-400 font-medium"
                                                />
                                              </div>
                                            </div>

                                            {/* Description & Length */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                              <div className="sm:col-span-2 space-y-1">
                                                <label className="block text-[11px] font-semibold text-slate-300">
                                                  Video Description <span className="text-rose-400">*</span>
                                                </label>
                                                <Field
                                                  name={`Sections.${index}.SectionItems.${iIndex}.Videodescription`}
                                                  placeholder="Brief overview of lecture content..."
                                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80"
                                                />
                                                <ErrorMessage
                                                  name={`Sections.${index}.SectionItems.${iIndex}.Videodescription`}
                                                  component="div"
                                                  className="text-[11px] text-rose-400 font-medium"
                                                />
                                              </div>

                                              <div className="space-y-1">
                                                <label className="block text-[11px] font-semibold text-slate-300">
                                                  Duration (Mins) <span className="text-rose-400">*</span>
                                                </label>
                                                <Field
                                                  type="number"
                                                  name={`Sections.${index}.SectionItems.${iIndex}.videoLength`}
                                                  placeholder="12"
                                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80"
                                                />
                                                <ErrorMessage
                                                  name={`Sections.${index}.SectionItems.${iIndex}.videoLength`}
                                                  component="div"
                                                  className="text-[11px] text-rose-400 font-medium"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}

                                      <button
                                        type="button"
                                        onClick={() =>
                                          pushItem({
                                            Videotitle: "",
                                            Videourl: "",
                                            Videodescription: "",
                                            videoLength: "",
                                          })
                                        }
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors pt-1 cursor-pointer"
                                      >
                                        <AddCircleIcon style={{ fontSize: 16 }} />
                                        <span>Add Lecture Video</span>
                                      </button>
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Add Section Button */}
                      <button
                        type="button"
                        onClick={() => {
                          push({
                            SectionName: `Section ${values.Sections.length + 1}`,
                            SectionItems: [
                              {
                                Videotitle: "",
                                Videourl: "",
                                Videodescription: "",
                                videoLength: "",
                              },
                            ],
                          });
                          setActive((prev) => [...prev, true]);
                        }}
                        className="w-full py-3 border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/60 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                      >
                        <AddCircleIcon className="text-indigo-400" style={{ fontSize: 18 }} />
                        <span>Add New Curriculum Section</span>
                      </button>
                    </div>
                  )}
                </FieldArray>

                {/* Navigation Actions Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all cursor-pointer"
                  >
                    <ArrowBackIcon style={{ fontSize: 16 }} />
                    <span>Previous</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ArrowForwardIcon style={{ fontSize: 16 }} />
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
