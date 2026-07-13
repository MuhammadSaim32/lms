import { useState } from "react";
import { useFormik } from "formik";
import { Input, Button } from "@mui/material";
import *  as yup from "yup"
export default function courseInfo({ setcourseData, setStep, initialValues }: any) {
    const [fileUrl, setFileUrl] = useState<string | null>(null);


    const courseInfoSchema = yup.object({
        courseName: yup.string().required("Course name is required"),
        courseDescription: yup.string().required("Course description is required"),
        coursePrice: yup.number().required("Course price is required"),
        estimatedPrice: yup.number(),
        courseTags: yup.string().required("Course tags is required"),
        courseLevel: yup.string().required("Course level is required"),
        demoUrl: yup.string().required("Demo url is required"),
        pic: yup.mixed().required("course pic is requried")
        // .test('fileSize', 'File size is too large (max 2MB)', (value) => {
        //     if (!value) return false; // Fail if no file when required
        //     return value.size <= (2 * 1024 * 1024);
        // })
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

        <form onSubmit={formik.handleSubmit} className="h-screen  flex  w-[80%]  border-2 border-amber-200  items-center justify-center  flex-col">

            <div className="flex w-[70%] flex-col">
                <div className="w-full">
                    <label htmlFor="courseName">Course Name</label>
                    <br />
                    <input
                        className="w-full border-2 border-black outline-0"
                        id="courseName"
                        type="text"
                        {...formik.getFieldProps('courseName')}
                    />
                    {formik.touched.courseName && formik.errors.courseName ? (
                        <div>{formik.errors.courseName}</div>
                    ) : null}
                </div>

                <div className="w-full">
                    <label htmlFor="courseDescription">Course Description</label>
                    <br />
                    <textarea
                        className="w-full h-36 border-2 border-black outline-0"

                        id="courseDescription"
                        {...formik.getFieldProps('courseDescription')}
                    />
                    {formik.touched.courseDescription && formik.errors.courseDescription ? (
                        <div>{formik.errors.courseDescription}</div>
                    ) : null}
                </div>
                <div className="flex justify-between w-full">
                    <div className="w-full " >
                        <label htmlFor="coursePrice">Course Price</label>
                        <br />
                        <input
                            className="w-[96%] border-2 border-black outline-0"

                            id="coursePrice"
                            type="number"
                            {...formik.getFieldProps('coursePrice')}
                        />
                        {formik.touched.coursePrice && formik.errors.coursePrice ? (
                            <div>{formik.errors.coursePrice}</div>
                        ) : null}
                    </div>

                    <div className="w-full">
                        <label htmlFor="estimatedPrice">Estimated Price</label>
                        <br />
                        <input
                            className="w-full border-2 border-black outline-0"

                            id="estimatedPrice"
                            type="number"
                            {...formik.getFieldProps('estimatedPrice')}
                        />
                        {formik.touched.estimatedPrice && formik.errors.estimatedPrice ? (
                            <div>{formik.errors.estimatedPrice}</div>
                        ) : null}
                    </div>
                </div>


                <div className="w-full">
                    <label htmlFor="courseTags">Course Tags</label>
                    <br />
                    <input
                        className="w-full border-2 border-black outline-0"

                        id="courseTags"
                        type="text"
                        {...formik.getFieldProps('courseTags')}
                    />
                    {formik.touched.courseTags && formik.errors.courseTags ? (
                        <div>{formik.errors.courseTags}</div>
                    ) : null}
                </div>

                <div className="w-full  flex ">
                    <div className="w-full">
                        <label htmlFor="courseLevel">Course Level</label>
                        <br />
                        <input
                            className="w-[96%] border-2 border-black outline-0"

                            id="courseLevel"
                            type="text"
                            {...formik.getFieldProps('courseLevel')}
                        />
                        {formik.touched.courseLevel && formik.errors.courseLevel ? (
                            <div>{formik.errors.courseLevel}</div>
                        ) : null}
                    </div>

                    <div className="w-full">
                        <label htmlFor="demoUrl">Demo URL</label>
                        <br />
                        <input
                            className="w-full border-2 border-black outline-0"

                            id="demoUrl"
                            type="text"
                            {...formik.getFieldProps('demoUrl')}
                        />
                        {formik.touched.demoUrl && formik.errors.demoUrl ? (
                            <div>{formik.errors.demoUrl}</div>
                        ) : null}
                    </div>


                </div>
                <input
                    type="file"
                    className="border h-12 text-center"
                    name="pic"
                    onChange={(event) => {
                        formik.setFieldValue('pic', event.currentTarget.files[0]);
                        const generatedUrl = URL.createObjectURL(event.currentTarget.files[0]);
                        setFileUrl(generatedUrl);
                    }}
                />
                {formik.errors.pic && <div>{formik.errors.pic}</div>}

            </div>
            {fileUrl && (
                <img
                    className="h-72 w-72 rounded-full"
                    src={fileUrl}
                    alt="Preview"
                />
            )}
            <button type="submit">Submit</button>
        </form >



    );

}