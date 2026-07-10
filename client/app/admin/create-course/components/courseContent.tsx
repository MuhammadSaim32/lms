import { useState } from "react"
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as yup from "yup"

export default function courseContent({ setStep, handleSubmit }: any) {

    const courseContentSchema = yup.object({
        Sections: yup.array().of(
            yup.object({
                SectionName: yup.string().required("Section name is required"),
                SectionItems: yup.array()
                    .of(
                        yup.object({
                            Videotitle: yup.string().required("Video title is required"),
                            Videourl: yup.string().url(),
                            Videodescription: yup.string().required("Description is required"),
                            linkTitle: yup.string(),
                            LinkUrl: yup.string().url()
                        })
                    )
                    .min(1, "At least one item is required in the section"),
            })
        ).min(1, "At least one section is required")
    });






    return (
        <div className="h-screen w-[80%] border">
            <Formik
                initialValues={{
                    Sections: [
                        {
                            SectionName: "Demo",
                            SectionItems: [
                                {
                                    Videotitle: "",
                                    Videourl: "",
                                    Videodescription: "",
                                    linkTitle: "",
                                    LinkUrl: ""


                                }
                            ]
                        },

                    ]
                }}
                validationSchema={courseContentSchema}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}
            >
                {({ values, errors, touched }) => (
                    < Form >
                        <FieldArray name="Sections">
                            {({ push, remove }) => (
                                <div>
                                    {values.Sections.map((section, index) => (
                                        <div key={index} className="border flex flex-col mb-4 item-center">
                                            <label>Section Name</label>

                                            <Field name={`Sections.${index}.SectionName`} placeholder="Section Name"
                                                className="outline-0 border w-[75%]" />
                                            <ErrorMessage name={`Sections.${index}.SectionName`} />
                                            <FieldArray name={`Sections.${index}.SectionItems`}>
                                                {({ push: pushItem, remove: removeItem }) => (
                                                    <div>
                                                        {section.SectionItems.map((item, iIndex) => (
                                                            <div key={iIndex} className="flex  flex-col items-center w-full h-full gap-3">
                                                                <label>Video Title</label>
                                                                <Field
                                                                    name={`Sections.${index}.SectionItems.${iIndex}.Videotitle`}
                                                                    placeholder="Video Title"
                                                                    className="outline-0 border w-[75%]"
                                                                />
                                                                <ErrorMessage name={`Sections.${index}.SectionItems.${iIndex}.Videotitle`} />
                                                                <label>Video URL</label>
                                                                <Field
                                                                    name={`Sections.${index}.SectionItems.${iIndex}.Videourl`}
                                                                    placeholder="Video URL"
                                                                    className="outline-0 border w-[75%]"
                                                                />
                                                                <ErrorMessage name={`Sections.${index}.SectionItems.${iIndex}.Videourl`} />
                                                                <label>Video Description</label>
                                                                <Field
                                                                    name={`Sections.${index}.SectionItems.${iIndex}.Videodescription`}
                                                                    placeholder="Video Description"
                                                                    className="outline-0 border w-[75%] h-[33%]"
                                                                />
                                                                <ErrorMessage name={`Sections.${index}.SectionItems.${iIndex}.Videodescription`} />
                                                                <label>Link Title</label>
                                                                <Field
                                                                    name={`Sections.${index}.SectionItems.${iIndex}.linkTitle`}
                                                                    placeholder="Link Title"
                                                                    className="outline-0 border w-[75%]"
                                                                />
                                                                <ErrorMessage name={`Sections.${index}.SectionItems.${iIndex}.linkTitle`} />
                                                                <label>Link URL</label>
                                                                <Field
                                                                    name={`Sections.${index}.SectionItems.${iIndex}.LinkUrl`}
                                                                    placeholder="Link URL"
                                                                    className="outline-0 border w-[75%]"
                                                                />
                                                                <ErrorMessage name={`Sections.${index}.SectionItems.${iIndex}.LinkUrl`} />
                                                                <button type="button"
                                                                    className="mt-4"
                                                                    onClick={() => removeItem(iIndex)}>
                                                                    Remove Item
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                pushItem({
                                                                    Videotitle: "",
                                                                    Videourl: "",
                                                                    Videodescription: "",
                                                                    linkTitle: "",
                                                                    LinkUrl: ""
                                                                })
                                                            }
                                                        >
                                                            Add Item
                                                        </button>
                                                    </div>
                                                )}
                                            </FieldArray>


                                            <button type="button" onClick={() => remove(index)}>
                                                Remove
                                            </button>
                                        </div>
                                    ))}

                                    <button type="button" onClick={() => push({
                                        SectionName: "Demo",
                                        SectionItems: [
                                            {
                                                Videotitle: "",
                                                Videourl: "",
                                                Videodescription: "",
                                                linkTitle: "",
                                                LinkUrl: ""


                                            }
                                        ]
                                    },)}>
                                        Add Member
                                    </button>
                                </div>
                            )}
                        </FieldArray>
                        <div className="flex justify-between mt-4 mb-4">
                            <button type="button" onClick={() => setStep(2)}>Previous</button>
                            <button type="submit">Next</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div >
    )
}