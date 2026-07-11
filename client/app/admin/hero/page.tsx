"use client"
import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import layoutApi from "../../../api/LayoutApi";
import routes from "../../../routes";

export default function Hero() {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState("");
    const [initialValues, setInitialValues] = useState({
        file: null,
        title: "",
        subTitle: "",
        imageUrl: "",
    });

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
            onSubmit={async (values, { setSubmitting }) => {
                try {

                    // Convert image file to base64
                    const base64: string = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = reject;
                        reader.readAsDataURL(values.file as unknown as File);
                    });


                    await layoutApi.createLayout(routes.createLayout, {
                        type: "Banner",
                        image: base64,
                        title: values.title,
                        subTitle: values.subTitle,
                    });


                    console.log("Layout created successfully");
                } catch (err) {
                    console.error("Failed to create layout:", err);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ setFieldValue, dirty, getFieldProps }) => (
                <Form className="h-[70%] w-[80%] bg-gray-300 mt-2 flex justify-around">

                    <div>
                        {fileUrl && (
                            <img
                                className="h-72 w-72 rounded-full"
                                src={fileUrl}
                                alt="Preview"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*,video/*,audio/*"
                            className="bg-red-600 rounded-full  w-5 h-5 "
                            onChange={(e) => {
                                const selectedFile = e.target.files[0];
                                if (!selectedFile) return;

                                setFieldValue("file", selectedFile);

                                const generatedUrl = URL.createObjectURL(selectedFile);
                                setFileUrl(generatedUrl);
                                setFileType(selectedFile.type);
                            }}
                        />

                        {/* Disable submit until a file is actually picked */}
                        <button type="submit" disabled={!dirty}>
                            Upload
                        </button>

                        {dirty && <p>You have an unsaved file selected.</p>}
                    </div>

                    <div>
                        <input type="text" className="border"  {...getFieldProps('title')} />
                        <textarea
                            className="border"
                            {...getFieldProps('subTitle')}
                        ></textarea>
                    </div>
                </Form>
            )}
        </Formik>
    );
}