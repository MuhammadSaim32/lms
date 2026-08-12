"use client";
import { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import layoutApi from "../../../api/LayoutApi";
import DeleteIcon from "@mui/icons-material/Delete";
import routes from "../../../routes";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import SaveIcon from "@mui/icons-material/Save";
import * as yup from "yup";
import toast from "react-hot-toast";

export default function Faq() {
  const [pageLoading, setPageLoading] = useState(true);

  const faqObject = yup.object({
    question: yup
      .string()
      .required("Question is required")
      .min(5, "Minimum question length is 5")
      .max(200, "Maximum question length is 200"),
    answer: yup
      .string()
      .required("Answer is required")
      .min(5, "Minimum answer length is 5")
      .max(500, "Maximum answer length is 500"),
    _id: yup.string(),
  });

  const FaqSchema = yup.object({
    faq: yup.array().of(faqObject).min(1, "Minimum 1 question is required"),
  });

  const [data, setData] = useState({
    faq: [
      {
        question: "",
        answer: "",
      },
    ],
  });
  const [down, setDown] = useState<number | null>(0);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await layoutApi.getLayout(routes.getLayout("FAQ"));
        if (res?.layout?.faq?.length > 0) {
          setData({ faq: res.layout.faq });
        }
      } catch (error) {
        console.error("Failed to fetch FAQ:", error);
      } finally {
        setPageLoading(false);
      }
    };
    fetchFaq();
  }, []);

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-xs">Loading FAQ management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl shadow-xl flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <LiveHelpIcon className="text-indigo-400" />
              Manage FAQ Accordions
            </h1>
            <p className="text-xs text-slate-400">
              Create, edit, or reorganize student frequently asked questions.
            </p>
          </div>
        </div>

        <Formik
          initialValues={data}
          enableReinitialize={true}
          validationSchema={FaqSchema}
          onSubmit={async (values) => {
            try {
              const res = await layoutApi.createLayout(routes.createLayout, {
                type: "FAQ",
                faq: values.faq,
              });
              toast.success(res?.message || "FAQ layout updated successfully");
            } catch (error: any) {
              console.error("Failed to update FAQ:", error);
              toast.error(error?.message || "Failed to update FAQ layout");
            }
          }}
        >
          {({ values, errors, touched, isSubmitting, dirty }) => (
            <Form className="space-y-6">
              <FieldArray name="faq">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {values.faq.map((item, index) => {
                      const isOpen = down === index;
                      return (
                        <div
                          key={index}
                          className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg backdrop-blur-xl transition-all"
                        >
                          {/* Accordion Bar Header */}
                          <div className="p-4 sm:p-5 flex items-center gap-3">
                            <span className="w-7 h-7 rounded-xl bg-slate-800 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>

                            <div className="flex-1">
                              <Field
                                name={`faq.${index}.question`}
                                placeholder="Enter Question title..."
                                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white placeholder-slate-500 outline-none transition-all"
                              />
                              <ErrorMessage
                                name={`faq.${index}.question`}
                                component="p"
                                className="text-red-400 text-[11px] mt-1 font-medium"
                              />
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => setDown(isOpen ? null : index)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                                title={isOpen ? "Collapse" : "Expand"}
                              >
                                {isOpen ? (
                                  <RemoveIcon className="w-4 h-4" />
                                ) : (
                                  <AddIcon className="w-4 h-4" />
                                )}
                              </button>

                              {values.faq.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors cursor-pointer"
                                  title="Delete Question"
                                >
                                  <DeleteIcon className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Accordion Answer Content */}
                          {isOpen && (
                            <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/60 bg-slate-950/40 space-y-2">
                              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mt-3">
                                Answer Explanation
                              </label>
                              <Field
                                as="textarea"
                                rows={3}
                                name={`faq.${index}.answer`}
                                placeholder="Enter the detailed Answer description..."
                                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3.5 text-xs text-slate-300 placeholder-slate-500 outline-none transition-all leading-relaxed resize-none"
                              />
                              <ErrorMessage
                                name={`faq.${index}.answer`}
                                component="p"
                                className="text-red-400 text-[11px] font-medium"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Add Question CTA */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          push({ question: "", answer: "" });
                          setDown(values.faq.length);
                        }}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-400 font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <AddIcon className="w-4 h-4" />
                        Add Question Item
                      </button>

                      {errors.faq &&
                        typeof errors.faq === "string" &&
                        touched.faq && (
                          <span className="text-red-400 text-xs font-semibold">
                            {errors.faq}
                          </span>
                        )}
                    </div>
                  </div>
                )}
              </FieldArray>

              {/* Save CTA */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSubmitting || !dirty}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <SaveIcon className="w-4 h-4" />
                  {isSubmitting ? "Updating FAQ Layout..." : "Save FAQ Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
