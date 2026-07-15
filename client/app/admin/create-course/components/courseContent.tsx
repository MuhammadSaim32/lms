import { act, useState } from "react"
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as yup from "yup"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
export default function courseContent({ setStep, handleSubmit, initialValues }: any) {

    const [down, setDown] = useState(null)
    const [active, setActive] = useState([true])
    const courseContentSchema = yup.object({
        Sections: yup.array().of(
            yup.object({
                SectionName: yup.string().required("Section name is required"),
                SectionItems: yup.array()
                    .of(
                        yup.object({
                            Videotitle: yup.string().required("Video title is required"),
                            Videourl: yup.string().url("Video URL must be a valid URL"),
                            Videodescription: yup.string().required("Description is required"),
                            videoLength: yup.number().typeError("Video length must be a number").required("Video length is required"),
                            linkTitle: yup.string(),
                            LinkUrl: yup.string().url("Link URL must be a valid URL")
                        })
                    )
                    .min(1, "At least one item is required in the section"),
            })
        ).min(1, "At least one section is required")
    });






    return (
        <div className="w-[90%] border  overflow-auto h-screen flex justify-center  ">
            <Formik
                initialValues={initialValues || {
                    Sections: [
                        {
                            SectionName: "Demo",
                            SectionItems: [
                                {
                                    Videotitle: "",
                                    Videourl: "",
                                    Videodescription: "",
                                    videoLength: "",
                                    linkTitle: "",
                                    LinkUrl: ""


                                }
                            ]
                        },

                    ]
                }}
                enableReinitialize={true}
                validationSchema={courseContentSchema}
                onSubmit={(values) => {
                    handleSubmit(values);
                }}
            >
                {({ values, errors, touched }) => (
                    < Form className=" h-full mt-9 ">
                        <FieldArray name="Sections">
                            {({ push, remove }) => (
                                <div>
                                    {values.Sections.map((section, index) => (
                                        <div key={index} className="flex flex-col w-full min-w-2xl  item-center justify-center">
                                            <div className="items-center bg-gray-300 p-2">
                                                <label
                                                    className=""
                                                >Section Name</label>

                                                <Field name={`Sections.${index}.SectionName`} placeholder="Section Name"
                                                    className="outline-0 border w-full" />
                                                <ErrorMessage name={`Sections.${index}.SectionName`} />

                                                <div
                                                    className=" "
                                                >
                                                    <button
                                                        className="cursor-pointer"
                                                        onClick={() => {

                                                            setActive((prev) => {
                                                                let arr = [...prev]
                                                                arr[index] = !arr[index]
                                                                return arr
                                                            })
                                                        }}
                                                        type="button"
                                                    ><ArrowDownwardIcon />
                                                    </button>
                                                    <button type="button"
                                                        className="cursor-pointer"
                                                        onClick={() => remove(index)}>
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </div>
                                            {active[index] == true
                                                && <FieldArray name={`Sections.${index}.SectionItems`}>
                                                    {({ push: pushItem, remove: removeItem }) => (
                                                        <>
                                                            {section.SectionItems.map((item, iIndex) => (
                                                                <div key={iIndex} className="flex flex-col items-center w-full h-full gap-3 bg-gray-300">
                                                                    <div className="w-full p-2">
                                                                        <label>Video Title</label>
                                                                        <Field
                                                                            name={`Sections.${index}.SectionItems.${iIndex}.Videotitle`}
                                                                            placeholder="Video Title"
                                                                            className="outline-0 border w-full"
                                                                        />
                                                                        <ErrorMessage name={`Sections.${index}.SectionItems.${iIndex}.Videotitle`} />
                                                                    </div>
                                                                    <div className="w-full p-2">
                                                                        <label>Video URL</label>
                                                                        <Field
                                                                            name={`Sections.${index}.SectionItems.${iIndex}.Videourl`}
                                                                            placeholder="Video URL"
                                                                            className="outline-0 border w-full"
                                                                        />
                                                                        <ErrorMessage name={`Sections.${index}.SectionItems.${iIndex}.Videourl`} />
                                                                    </div>
                                                                    <div className="w-full p-2">
                                                                        <label>Video Description</label>
                                                                        <Field
                                                                            name={`Sections.${index}.SectionItems.${iIndex}.Videodescription`}
                                                                            placeholder="Video Description"
                                                                            className="outline-0 border w-full h-[33%]"
                                                                        />
                                                                        <ErrorMessage name={`Sections.${index}.SectionItems.${iIndex}.Videodescription`} />
                                                                    </div>
                                                                    <div className="w-full p-2">
                                                                        <label>Video Length (in minutes)</label>
                                                                        <Field
                                                                            type="number"
                                                                            name={`Sections.${index}.SectionItems.${iIndex}.videoLength`}
                                                                            placeholder="Video Length"
                                                                            className="outline-0 border w-full"
                                                                        />
                                                                        <ErrorMessage name={`Sections.${index}.SectionItems.${iIndex}.videoLength`} />
                                                                    </div>
                                                                    <div className="w-full p-2">
                                                                        <label>Link Title</label>
                                                                        <Field
                                                                            name={`Sections.${index}.SectionItems.${iIndex}.linkTitle`}
                                                                            placeholder="Link Title"
                                                                            className="outline-0 border w-full"
                                                                        />
                                                                        <ErrorMessage name={`Sections.${index}.SectionItems.${iIndex}.linkTitle`} />
                                                                    </div>
                                                                    <div className="w-full p-2">
                                                                        <label>Link URL</label>
                                                                        <Field
                                                                            name={`Sections.${index}.SectionItems.${iIndex}.LinkUrl`}
                                                                            placeholder="Link URL"
                                                                            className="outline-0 border w-full"
                                                                        />
                                                                        <ErrorMessage name={`Sections.${index}.SectionItems.${iIndex}.LinkUrl`} />
                                                                    </div>
                                                                    {/* <button type="button"
                                                                    className="mt-4"
                                                                    onClick={() => removeItem(iIndex)}>
                                                                    Remove Item
                                                                </button> */}
                                                                    <div className="">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                pushItem({
                                                                                    Videotitle: "",
                                                                                    Videourl: "",
                                                                                    Videodescription: "",
                                                                                    videoLength: "",
                                                                                    linkTitle: "",
                                                                                    LinkUrl: ""
                                                                                })
                                                                            }
                                                                        >
                                                                            Add Item
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                        </>
                                                    )}
                                                </FieldArray>
                                            }


                                        </div>
                                    ))}

                                    <button type="button"
                                        className="cursor-pointer text-white"
                                        onClick={() => {
                                            push({
                                                SectionName: "Demo",
                                                SectionItems: [
                                                    {
                                                        Videotitle: "",
                                                        Videourl: "",
                                                        Videodescription: "",
                                                        videoLength: "",
                                                        linkTitle: "",
                                                        LinkUrl: ""


                                                    }
                                                ]
                                            },)
                                            setActive(prev => [...prev, true])
                                        }

                                        }>
                                        <AddCircleIcon />
                                    </button>
                                </div>
                            )}
                        </FieldArray>
                        <div className="flex justify-between mt-4 mb-4">
                            <button type="button" className="cursor-pointer bg-purple-700 p-2 px-6 rounded text-white" onClick={() => setStep(2)}>Previous</button>
                            <button type="submit" className="cursor-pointer bg-purple-700 p-2 px-6 rounded text-white">Next</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div >
    )
}