"use client"
import { useState, useEffect } from "react"
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import layoutApi from "../../../api/LayoutApi";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import routes from "../../../routes";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import * as yup from "yup"
import Button from "../../../components/Button";

export default function Faq() {

    const faqObject = yup.object({
        question: yup.string().required("Questoin is Rquiredd").min(10, "min Question length is 10").max(100, "max question lenght is 45"),
        answer: yup.string().required("Questoin is Rquiredd").min(10, "min Question length is 10").max(100, "max question lenght is 45"),
        _id: yup.string()
    })
    const FaqScheama = yup.object({
        faq: yup.array().of(faqObject).min(1, "minimum 1 question is required")
    })
    const [data, setData] = useState({
        faq: [{
            question: "",
            answer: "",
        }]
    })
    const [down, setDown] = useState(null)

    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const res = await layoutApi.getLayout(routes.getLayout("FAQ"));
                if (res?.layout?.faq?.length > 0) {
                    setData({ faq: res.layout.faq });
                }
            } catch (error) {
                console.error("Failed to fetch FAQ:", error);
            }
        };
        fetchFaq();
    }, []);


    return <div className="h-full w-full min-h-screen text-center"  >
        <Formik
            initialValues={data}
            enableReinitialize={true}
            validationSchema={FaqScheama}
            onSubmit={async (values) => {
                console.log("asdfsaf", values)

                try {
                    await layoutApi.createLayout(routes.createLayout, {
                        type: "FAQ",
                        faq: values.faq
                    });
                } catch (error) {
                    console.error("Failed to update FAQ:", error);
                }
            }}
        >
            {({ values, errors, touched, isSubmitting, dirty }) => (
                < Form className="min-h-screen flex justify-center items-center flex-col "  >
                    <FieldArray name="faq"   >
                        {({ push, remove }) => (
                            <div className=" text-white flex  w-full  relative justify-center flex-col items-center h-full">
                                {values.faq.map((item, index) => (
                                    <div key={index} className="w-[80%] mb-4">
                                        <div className={`pl-2 pr-2  flex justify-between pb-4 ${down != index ? "border-b border-white" : ""}`}>

                                            <Field name={`faq.${index}.question`} placeholder="Enter the Question..."
                                                className="outline-0 flex-1" />

                                            <button
                                                type="button"
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    if (down == null) {
                                                        setDown(index)
                                                        return
                                                    }

                                                    if (down == index) {
                                                        setDown(null)
                                                        return
                                                    }

                                                    setDown(index)
                                                }}
                                            >{down == index ? <RemoveIcon /> : <AddIcon />}</button>
                                        </div>
                                        {down == index &&
                                            <>

                                                <div className="pl-2 pr-2  flex justify-between pb-4">

                                                    <Field name={`faq.${index}.answer`} placeholder="Enter the Answer..."
                                                        className=" mt-4 outline-0 flex-1  pr-2"
                                                    />

                                                </div>
                                                <div className={`pl-2 pr-2 flex justify-between pb-4 ${down == index ? "border-b border-white " : ""}`}>

                                                    <button type="button"
                                                        className="cursor-pointer "
                                                        onClick={() => remove(index)}>
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </>
                                        }


                                    </div>
                                ))}




                                <br />

                                <button type="button"
                                    className="cursor-pointer absolute bottom-1 left-30"
                                    onClick={() => push({
                                        question: "",
                                        answer: ""

                                    },)}>
                                    <AddCircleIcon />
                                </button>
                                {errors.faq && typeof errors.faq === 'string' && touched.faq && (
                                    <div className="text-red-500 text-sm mt-2 text-left w-[80%] bg-red-500/10 p-4 rounded-md">
                                        {errors.faq}
                                    </div>
                                )}
                                {errors.faq && Array.isArray(errors.faq) && errors.faq.some(e => e) && (
                                    <div className="text-red-500 text-sm mt-2 text-left w-[80%] bg-red-500/10 p-4 rounded-md">
                                        <p className="font-semibold mb-2">Please fix the following errors:</p>
                                        {errors.faq.map((err, i) => (
                                            err && (
                                                <div key={i} className="ml-2 mb-1">
                                                    {err.question && <div>• FAQ {i + 1} Question: {err.question}</div>}
                                                    {err.answer && <div>• FAQ {i + 1} Answer: {err.answer}</div>}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </FieldArray>
                    <button
                        type="submit"
                    >submit</button>
                </Form>


            )}
        </Formik>
    </div>

}