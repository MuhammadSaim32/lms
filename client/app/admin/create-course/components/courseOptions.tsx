"use Client"

import { useState } from "react"
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function CourseOptions({ setcourseData, setStep, initialValues }: any) {
    const [benifits, setBenifits] = useState(
        (initialValues?.benifits && initialValues.benifits.length > 0) ? initialValues.benifits : [{
            placeholder: "Enter Benefits",
            value: ""
        }]
    );
    const [prevreq, setPrereq] = useState(
        (initialValues?.prevreq && initialValues.prevreq.length > 0) ? initialValues.prevreq : [{
            placeholder: "Enter Prerequisites",
            value: ""
        }]
    );
    const [error, setError] = useState("");


    const addNewNode = () => {


        setBenifits((prev) => {
            return [...prev, {
                placeholder: "Enter Benefits",
                value: ""
            }]
        })
    }

    const addNewPreqre = () => {


        setPrereq((prev) => {
            return [...prev, {
                placeholder: "Enter Prerequisites",
                value: ""
            }]
        })
    }


    return (
        <div className="border h-screen justify-center  flex flex-col items-center gap-3">
            <div className="flex flex-col w-[70%] text-white mt-4">
                <h1 className="text-xl font-bold mb-3">
                    What are the benefits for students in this course?
                </h1>
                <div>
                    {benifits.map((val, index) => {
                        return (
                            <div className="mb-2" key={index}>
                                <input type="text"
                                    className="w-full p-2 outline-0 border-2 border-gray-300 bg-transparent text-white"
                                    placeholder={val.placeholder}
                                    value={val.value}
                                    onChange={(e) => {
                                        const newBenifits = [...benifits];
                                        newBenifits[index].value = e.target.value;
                                        setBenifits(newBenifits);
                                    }}
                                />
                            </div>
                        )
                    })}
                    <button
                        className="cursor-pointer mt-1"
                        onClick={() => {
                            addNewNode()
                        }}
                    >
                        <AddCircleIcon />
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-[70%] text-white mt-4">
                <h1 className="text-xl font-bold mb-3">
                    What are the prerequisites for students in this course?
                </h1>
                <div>
                    {prevreq.map((val, index) => {
                        return (
                            <div className="mb-2" key={index}>
                                <input type="text"
                                    className="w-full p-2 outline-0 border-2 border-gray-300 bg-transparent text-white"
                                    placeholder={val.placeholder}
                                    value={val.value}
                                    onChange={(e) => {
                                        const newPrevreq = [...prevreq];
                                        newPrevreq[index].value = e.target.value;
                                        setPrereq(newPrevreq);
                                    }}
                                />
                            </div>
                        )
                    })}
                    <button
                        className="cursor-pointer mt-1"
                        onClick={() => {
                            addNewPreqre()
                        }}
                    >
                        <AddCircleIcon />
                    </button>
                </div>
            </div>

            <div className="flex w-[50%] justify-between mt-8 text-white">
                <button className="cursor-pointer bg-purple-700 p-2 px-6 rounded" onClick={() => setStep(1)}>Previous</button>
                <button
                    className="cursor-pointer bg-purple-700 p-2 px-6 rounded"
                    onClick={() => {
                        const isBenifitsValid = benifits.every(b => b.value.trim().length >= 3);
                        const isPrevreqValid = prevreq.every(p => p.value.trim().length >= 3);
                        if (!isBenifitsValid || !isPrevreqValid) {
                            setError("all field are required and min length 3");
                            return;
                        }
                        setError("");
                        setcourseData((prev: any) => ({ ...prev, courseOptions: { benifits, prevreq } }));
                        setStep(3);
                    }}
                >Next</button>
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    )


}