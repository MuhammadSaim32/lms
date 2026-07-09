import { useState } from "react"

export default function courseContent() {
    const [section, setSection] = useState([
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

    ])


    const AddSubSection = () => {
        setSection(prev => {
            return [...prev, {
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
            },]
        })
    }

    return (
        <div className="h-screen w-[80%] border">
            {section.map((val) => {
                return <div className="bg-gray-500 flex flex-col items-center ">
                    <h1 className=" relative ">{val.SectionName}</h1>
                    {val.SectionItems.map((val) => {
                        return <div className="flex flex-col w-[80%] gap-3" >

                            <input type="text" className="border" />
                            <input type="text" className="border" />
                            <textarea placeholder="Enter descritp" className="border" />
                            <input type="text" className="border" />
                            <input type="text" className="border" />
                        </div>
                    })}

                </div>



            })}
            <button
                onClick={() => {
                    AddSubSection()
                }}
            >AddSubSection</button>
        </div>
    )
}