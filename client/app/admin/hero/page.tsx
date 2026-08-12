"use client";
import { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import layoutApi from "../../../api/LayoutApi";
import routes from "../../../routes";
import toast from "react-hot-toast";
import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import SaveIcon from "@mui/icons-material/Save";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function Hero() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [initialValues, setInitialValues] = useState({
    file: null,
    title: "",
    subTitle: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    layoutApi
      .getLayout(routes.getLayout("Banner"))
      .then((res) => {
        if (res.layout?.banner) {
          const { title, subTitle, image } = res.layout.banner;
          setInitialValues({
            file: null,
            title: title || "",
            subTitle: subTitle || "",
            imageUrl: image?.url || "",
          });
          if (image?.url) setFileUrl(image.url);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-xs">Loading Hero banner settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl shadow-xl space-y-1">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <ImageIcon className="text-indigo-400" />
            Hero Banner Customization
          </h1>
          <p className="text-xs text-slate-400">
            Edit main landing titles, subtitles, and hero media image visible to students.
          </p>
        </div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={async (values) => {
            try {
              const payload: any = { type: "Banner" };

              if (values.file) {
                const base64: string = await new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.onerror = reject;
                  reader.readAsDataURL(values.file as unknown as File);
                });
                payload.image = base64;
              }

              if (values.title !== initialValues.title)
                payload.title = values.title;
              if (values.subTitle !== initialValues.subTitle)
                payload.subTitle = values.subTitle;

              const data = await layoutApi.createLayout(
                routes.createLayout,
                payload,
              );
              toast.success(data.message || "Banner updated successfully!");

              const returnedUrl = data?.data?.LayoutDb?.banner?.image?.url;
              const newInitial = {
                file: null,
                title: payload.title ?? initialValues.title,
                subTitle: payload.subTitle ?? initialValues.subTitle,
                imageUrl: returnedUrl || initialValues.imageUrl,
              };

              setInitialValues(newInitial);
              if (returnedUrl) setFileUrl(returnedUrl);
            } catch (err: any) {
              toast.error(err?.message || "Failed to update hero banner");
            }
          }}
        >
          {({ setFieldValue, dirty, getFieldProps, isSubmitting, values }) => (
            <Form className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Media Picker Preview Column */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
                <div className="relative group w-full max-w-[360px] aspect-square rounded-3xl overflow-hidden bg-slate-950 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 transition-all flex items-center justify-center">
                  {fileUrl ? (
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={fileUrl}
                      alt="Banner Preview"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 p-6 text-center space-y-2">
                      <CloudUploadIcon className="w-16 h-16 text-indigo-400 opacity-60" />
                      <span className="text-xs font-semibold">Upload Hero Banner Image</span>
                    </div>
                  )}

                  {/* Upload Overlay Button */}
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="absolute bottom-4 right-4 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center"
                    aria-label="Upload banner image"
                  >
                    <CameraAltRoundedIcon className="w-5 h-5" />
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (!selectedFile) return;

                    setFieldValue("file", selectedFile);
                    const generatedUrl = URL.createObjectURL(selectedFile);
                    setFileUrl(generatedUrl);
                  }}
                />

                <p className="text-[11px] text-slate-500 font-medium text-center">
                  Click camera button to select a new image asset
                </p>
              </div>

              {/* Text Fields Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Main Banner Title
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-4 text-xl sm:text-2xl font-extrabold text-white outline-none transition-all resize-none leading-snug"
                    placeholder="e.g. Improve Your Online Learning Experience Instantly"
                    {...getFieldProps("title")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Subtitle Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-4 text-sm text-slate-300 outline-none transition-all resize-none leading-relaxed"
                    placeholder="e.g. Explore thousands of live interactive courses..."
                    {...getFieldProps("subTitle")}
                  />
                </div>

                {/* Unsaved notification indicator */}
                {(values.file ||
                  (fileUrl && fileUrl !== initialValues.imageUrl)) && (
                  <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs font-semibold">
                    <WarningAmberIcon className="w-4 h-4" />
                    You have unsaved changes in the image asset.
                  </div>
                )}

                {/* Save CTA Button */}
                <button
                  type="submit"
                  disabled={!dirty || isSubmitting}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <SaveIcon className="w-4 h-4" />
                  {isSubmitting ? "Saving Banner..." : "Save Banner Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

