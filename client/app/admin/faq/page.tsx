"use client"
import { useState, useEffect } from "react"
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import layoutApi from "../../../api/LayoutApi";
import routes from "../../../routes";

export default function Faq() {

    const [data, setData] = useState({
        faq: [{
            question: "",
            answer: "",
        }]
    })

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


    return <div className="w-[1000px] h-[1000px] flex justify-center items-center">
        <div className="bg-gray-500 h-[800px] w-[800px]  border-2 border-amber-300 flex justify-center items-center">
            <Formik
                initialValues={data}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    console.log(values)
                    try {
                        await layoutApi.createLayout(routes.createLayout, {
                            type: "FAQ",
                            faq: values.faq
                        });
                        alert("FAQ updated successfully");
                    } catch (error) {
                        console.error("Failed to update FAQ:", error);
                    }
                }}
            >
                {({ values, errors, touched }) => (
                    < Form >
                        <FieldArray name="faq">
                            {({ push, remove }) => (
                                <div>
                                    {values.faq.map((item, index) => (
                                        <div key={index} className=" flex flex-col mb-4 item-center w-[600px] justify-center items-center">

                                            <Field name={`faq.${index}.question`} placeholder="Enter the Question..."
                                                className="outline-0  w-[75%]" />



                                            <Field name={`faq.${index}.answer`} placeholder="Enter the Answer..."
                                                className={`outline-0  w-[75%] ${item.isActive ? "hidden" : ""}`} />


                                            <button type="button" onClick={() => remove(index)}>
                                                Remove
                                            </button>
                                        </div>
                                    ))}

                                    <button type="button" onClick={() => push({
                                        question: "",
                                        answer: ""

                                    },)}>
                                        Add Member
                                    </button>


                                    <br />

                                </div>
                            )}
                        </FieldArray>
                        <button type="submit">submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    </div >
}