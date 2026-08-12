"use client";

import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CourseOptions({ setcourseData, setStep, initialValues }: any) {
  const [benifits, setBenifits] = useState(
    initialValues?.benifits && initialValues.benifits.length > 0
      ? initialValues.benifits
      : [
        {
          placeholder: "e.g. Master React, Next.js 14, and TypeScript from scratch",
          value: "",
        },
      ]
  );
  const [prevreq, setPrereq] = useState(
    initialValues?.prevreq && initialValues.prevreq.length > 0
      ? initialValues.prevreq
      : [
        {
          placeholder: "e.g. Basic understanding of HTML, CSS, and JavaScript",
          value: "",
        },
      ]
  );
  const [error, setError] = useState("");

  const addNewBenefit = () => {
    setBenifits((prev) => [
      ...prev,
      {
        placeholder: "e.g. Build production-ready web applications",
        value: "",
      },
    ]);
  };

  const removeBenefit = (index: number) => {
    if (benifits.length <= 1) return;
    setBenifits((prev) => prev.filter((_, i) => i !== index));
  };

  const addNewPrereq = () => {
    setPrereq((prev) => [
      ...prev,
      {
        placeholder: "e.g. Code editor installed (e.g. VS Code)",
        value: "",
      },
    ]);
  };

  const removePrereq = (index: number) => {
    if (prevreq.length <= 1) return;
    setPrereq((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const isBenifitsValid = benifits.every((b) => b.value.trim().length >= 3);
    const isPrevreqValid = prevreq.every((p) => p.value.trim().length >= 3);
    if (!isBenifitsValid || !isPrevreqValid) {
      setError("All fields are required and must be at least 3 characters long.");
      return;
    }
    setError("");
    setcourseData((prev: any) => ({ ...prev, courseOptions: { benifits, prevreq } }));
    setStep(3);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 my-4">
      <Card className="bg-slate-900/80 border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-slate-800/80 pb-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl text-white font-extrabold tracking-tight">
                Benefits & Prerequisites
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Define what students will gain and what they need before starting this course.
              </CardDescription>
            </div>
            <Badge variant="default" className="bg-indigo-600/90 text-white font-medium text-xs px-3 py-1">
              Step 2 of 4
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-8">
          {/* Benefits Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="text-emerald-400" style={{ fontSize: 20 }} />
              <h2 className="text-sm font-bold text-slate-100">
                What are the benefits for students in this course?
              </h2>
            </div>

            <div className="space-y-3">
              {benifits.map((val, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
                    placeholder={val.placeholder || "Enter course benefit"}
                    value={val.value}
                    onChange={(e) => {
                      const newBenefits = [...benifits];
                      newBenefits[index].value = e.target.value;
                      setBenifits(newBenefits);
                    }}
                  />
                  {benifits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Remove Benefit"
                    >
                      <DeleteIcon style={{ fontSize: 18 }} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addNewBenefit}
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors pt-1 cursor-pointer"
              >
                <AddCircleIcon style={{ fontSize: 18 }} />
                <span>Add Another Benefit</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800/80" />

          {/* Prerequisites Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="text-cyan-400" style={{ fontSize: 20 }} />
              <h2 className="text-sm font-bold text-slate-100">
                What are the prerequisites for students in this course?
              </h2>
            </div>

            <div className="space-y-3">
              {prevreq.map((val, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
                    placeholder={val.placeholder || "Enter prerequisite requirement"}
                    value={val.value}
                    onChange={(e) => {
                      const newPrereq = [...prevreq];
                      newPrereq[index].value = e.target.value;
                      setPrereq(newPrereq);
                    }}
                  />
                  {prevreq.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePrereq(index)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Remove Prerequisite"
                    >
                      <DeleteIcon style={{ fontSize: 18 }} />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addNewPrereq}
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors pt-1 cursor-pointer"
              >
                <AddCircleIcon style={{ fontSize: 18 }} />
                <span>Add Another Prerequisite</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400">
              {error}
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all cursor-pointer"
            >
              <ArrowBackIcon style={{ fontSize: 16 }} />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowForwardIcon style={{ fontSize: 16 }} />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}