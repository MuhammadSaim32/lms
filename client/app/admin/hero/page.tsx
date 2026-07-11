"use client"
import { useState } from "react";
import { Formik, Form } from "formik";

export default function Hero() {
    const [fileUrl, setFileUrl] = useState(null);
    const [fileType, setFileType] = useState("");

    return (
        <Formik
            initialValues={{ file: null }}
            onSubmit={(values) => {
                console.log("Submitting file:", values.file);
            }}
        >
            {({ setFieldValue, dirty, }) => (
                <Form className="h-[70%] w-[80%] bg-gray-300 mt-2">


                    {fileUrl && fileType.startsWith("image/") && (
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
                </Form>
            )}
        </Formik>
    );
}