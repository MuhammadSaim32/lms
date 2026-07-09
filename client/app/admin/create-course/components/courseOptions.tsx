"use Client"

import { useState } from "react"


export default function CourseOptions({ setcourseData, setStep }: any) {
    const [benifits, setBenifits] = useState([{
        placeholder: "Enter Benigits",
        value: ""
    }]);
    const [prevreq, setPrereq] = useState([{
        placeholder: "Enter PreReq",
        value: ""
    }]);
    const [error, setError] = useState("");


    const addNewNode = (index) => {


        setBenifits((prev) => {
            return [...prev, {
                placeholder: "Enter Benigits",
                value: ""
            }]
        })
    }

    const addNewPreqre = (index) => {


        setPrereq((prev) => {
            return [...prev, {
                placeholder: "Enter PreReq",
                value: ""
            }]
        })
    }


    return (
        <div className="border h-screen justify-center flex flex-col items-center gap-3">
            <div className="flex flex-col w-[50%]">
                <h1 className="text-xl">
                    what are the benifits for students in this course?
                </h1>
                <div>
                    {benifits.map((val, index) => {
                        return (
                            <div className="p-2" key={index}>
                                <input type="text"
                                    className="w-full outline-0 border"
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
                        onClick={() => {
                            addNewNode()
                        }}
                    >add new Node
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-[50%]">
                <h1 className="text-xl">
                    what are the PreReq  for students in this course?
                </h1>
                <div>
                    {prevreq.map((val, index) => {
                        return (
                            <div className="p-2" key={index}>
                                <input type="text"
                                    className="w-full outline-0 border"
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
                        onClick={() => {
                            addNewPreqre()
                        }}
                    >add new Node
                    </button>
                </div>
            </div>

            <div className="flex w-[50%] justify-between">
                <button onClick={() => setStep(1)}>Previous</button>
                <button
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