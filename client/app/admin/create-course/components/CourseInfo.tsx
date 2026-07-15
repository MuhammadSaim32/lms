import { useState } from "react";
import { useFormik } from "formik";
import { useRef } from "react";
import Button from "@/components/Button";
import *  as yup from "yup"
export default function courseInfo({ setcourseData, setStep, initialValues }: any) {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const fileRef = useRef(null)

    const courseInfoSchema = yup.object({
        courseName: yup.string().required("Course name is required"),
        courseDescription: yup.string().required("Course description is required"),
        coursePrice: yup.number().required("Course price is required"),
        estimatedPrice: yup.number(),
        courseTags: yup.string().required("Course tags is required"),
        courseLevel: yup.string().required("Course level is required"),
        demoUrl: yup.string().required("Demo url is required"),
        pic: yup.mixed().required("course pic is requried"),

    })


    const formik = useFormik({
        initialValues: initialValues || {
            courseName: '',
            courseDescription: '',
            coursePrice: '',
            estimatedPrice: '',
            courseTags: '',
            courseLevel: '',
            demoUrl: '',
            pic: ""
        },
        enableReinitialize: true,
        validationSchema: courseInfoSchema,
        onSubmit: async values => {
            const base64: string = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(values.pic as unknown as File);
            });


            values.pic = base64
            console.log(values)

            setcourseData((prev: any) => ({ ...prev, courseInfo: values }))

            setStep(2)

        },
    });
    return (

        <form onSubmit={formik.handleSubmit} className="h-screen  flex  w-[80%]  border-2  items-center   flex-col overflow-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">

            <div className="flex w-[80%] flex-col text-white gap-5">
                <div className="w-full">
                    <label htmlFor="courseName">Course Name</label>
                    <br />
                    <input
                        className="w-full border-2 border-gray-300 mt-2 outline-0 "
                        id="courseName"
                        type="text"
                        {...formik.getFieldProps('courseName')}
                    />
                    {formik.touched.courseName && formik.errors.courseName ? (
                        <div className="text-red-500 mt-3">{formik.errors.courseName}</div>
                    ) : null}
                </div>

                <div className="w-full">
                    <label htmlFor="courseDescription">Course Description</label>
                    <br />
                    <textarea
                        className="w-full h-36 border-2 border-gray-300 mt-2 outline-0  resize-none"

                        id="courseDescription"
                        {...formik.getFieldProps('courseDescription')}
                    />
                    {formik.touched.courseDescription && formik.errors.courseDescription ? (
                        <div className="text-red-500 mt-3">{formik.errors.courseDescription}</div>
                    ) : null}
                </div>
                <div className="flex justify-between w-full">
                    <div className="w-full " >
                        <label htmlFor="coursePrice">Course Price</label>
                        <br />
                        <input
                            className="w-[96%] border-2 border-gray-300 mt-2 outline-0"

                            id="coursePrice"
                            type="number"
                            {...formik.getFieldProps('coursePrice')}
                        />
                        {formik.touched.coursePrice && formik.errors.coursePrice ? (
                            <div className="text-red-500 mt-3">{formik.errors.coursePrice}</div>
                        ) : null}
                    </div>

                    <div className="w-full">
                        <label htmlFor="estimatedPrice">Estimated Price</label>
                        <br />
                        <input
                            className="w-full border-2 border-gray-300 mt-2 outline-0"

                            id="estimatedPrice"
                            type="number"
                            {...formik.getFieldProps('estimatedPrice')}
                        />
                        {formik.touched.estimatedPrice && formik.errors.estimatedPrice ? (
                            <div className="text-red-500 mt-3">{formik.errors.estimatedPrice}</div>
                        ) : null}
                    </div>
                </div>


                <div className="w-full">
                    <label htmlFor="courseTags">Course Tags</label>
                    <br />
                    <input
                        className="w-full border-2 border-gray-300 mt-2 outline-0"

                        id="courseTags"
                        type="text"
                        {...formik.getFieldProps('courseTags')}
                    />
                    {formik.touched.courseTags && formik.errors.courseTags ? (
                        <div className="text-red-500 mt-3">{formik.errors.courseTags}</div>
                    ) : null}
                </div>

                <div className="w-full  flex ">
                    <div className="w-full">
                        <label htmlFor="courseLevel">Course Level</label>
                        <br />
                        <input
                            className="w-[96%] border-2 border-gray-300 mt-2 outline-0"

                            id="courseLevel"
                            type="text"
                            {...formik.getFieldProps('courseLevel')}
                        />
                        {formik.touched.courseLevel && formik.errors.courseLevel ? (
                            <div className="text-red-500 mt-3">{formik.errors.courseLevel}</div>
                        ) : null}
                    </div>

                    <div className="w-full">
                        <label htmlFor="demoUrl">Demo URL</label>
                        <br />
                        <input
                            className="w-full border-2 border-gray-300 mt-2 outline-0"

                            id="demoUrl"
                            type="text"
                            {...formik.getFieldProps('demoUrl')}
                        />
                        {formik.touched.demoUrl && formik.errors.demoUrl ? (
                            <div className="text-red-500 mt-3">{formik.errors.demoUrl}</div>
                        ) : null}
                    </div>


                </div>
                <input
                    type="file"
                    ref={fileRef}
                    className="border h-12 text-center hidden"
                    name="pic"

                    onChange={(event) => {
                        if (!event.currentTarget) return
                        formik.setFieldValue('pic', event.currentTarget.files[0]);
                        const generatedUrl = URL.createObjectURL(event.currentTarget.files[0]);
                        setFileUrl(generatedUrl);
                    }}
                />

                <button
                    type="button"
                    className="border-2 min-h-14 flex justify-center items-center cursor-pointer  "
                    onClick={() => {
                        fileRef.current.click()
                    }}
                >
                    {fileUrl ? (
                        <img
                            className="h-full w-full"
                            src={fileUrl}
                            alt="Preview"
                        />
                    ) : (
                        "Chose the FIle"
                    )}
                </button>
                {formik.touched.pic && formik.errors.pic && <div className="text-red-500 mt-3">{formik.errors.pic}</div>}

            </div>


            <Button text="Next" className="mt-10 mb-11 cursor-pointer p-4 bg-purple-700" type="submit" />
        </form >



    );

}