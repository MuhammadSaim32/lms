"use client"
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import layoutApi from "../../../api/LayoutApi";
import routes from "../../../routes";
import toast from "react-hot-toast"
import Button from "../../../components/Button"
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import IconButton from '@mui/material/IconButton';

import { useRef } from "react";
export default function Hero() {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState("");
    const fileInputRef = useRef(null);
    const [initialValues, setInitialValues] = useState({
        file: null,
        title: "",
        subTitle: "",
        imageUrl: "",
    });

    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        layoutApi.getLayout(routes.getLayout("Banner")).then((res) => {
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
        }).catch(() => { });
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={async (values) => {
                try {
                    const payload = { type: "Banner" };

                    if (values.file) {
                        const base64: string = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result as string);
                            reader.onerror = reject;
                            reader.readAsDataURL(values.file as unknown as File);
                        });
                        payload.image = base64;
                    }

                    if (values.title !== initialValues.title) payload.title = values.title;
                    if (values.subTitle !== initialValues.subTitle) payload.subTitle = values.subTitle;

                    const data = await layoutApi.createLayout(routes.createLayout, payload);
                    toast.success(data.message);

                } catch (err) {
                    toast.error(err.message);
                }
            }}
        >
            {({ setFieldValue, dirty, getFieldProps, isSubmitting }) => (
                <Form className="h-screen w-screen bg-slate-900 mt-2 flex justify-around text-white">

                    <div className="flex justify-center flex-col ">
                        {fileUrl && (
                            <div className="h-[400px] w-[400px] rounded-full relative overflow-hidden">

                                <img
                                    className="w-full h-full object-cover"
                                    src={fileUrl}
                                    alt="Preview"
                                />
                                <button
                                    className="absolute bottom-16 right-12"
                                    onClick={openFilePicker}

                                ><CameraAltRoundedIcon /></button>
                            </div>
                        )}


                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*,video/*,audio/*"
                            className="bg-red-600 rounded-full  w-5 h-5 hidden"
                            placeholder="chose file"

                            onChange={(e) => {
                                const selectedFile = e.target.files[0];
                                if (!selectedFile) return;

                                setFieldValue("file", selectedFile);

                                const generatedUrl = URL.createObjectURL(selectedFile);
                                setFileUrl(generatedUrl);
                                setFileType(selectedFile.type);
                            }}
                        />


                    </div>

                    <div className="flex flex-col justify-center h-auto w-[45%] gap-7">
                        <textarea
                            className=" text-6xl overflow-clip h-auto  outline-0 field-sizing-content"
                            {...getFieldProps('subTitle')}

                        ></textarea>
                        <textarea
                            className="text-2xl overflow-clip h-auto  outline-0 field-sizing-content"
                            {...getFieldProps('title')}
                        ></textarea>



                        <Button
                            text={`${isSubmitting ? " updating.." : "Update"}`}
                            type="submit"
                            className={`disabled:opacity-50 cursor-pointer hover:bg-blue-700 disabled:bg-blue-700`}
                            disabled={!dirty || isSubmitting}
                        />



                        {dirty && <p className="text-red-500 text-xl">You have an unsaved file selected.</p>}
                    </div>


                </Form>

            )}
        </Formik>
    );
}