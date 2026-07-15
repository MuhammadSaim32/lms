"use client";
import { useEffect, useState } from "react";
import layoutApi from "../api/LayoutApi";
import routes from "../routes";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface FaqItem {
    _id: string;
    question: string;
    answer: string;
}

export default function Faq() {
    const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
    const [down, setDown] = useState(null)
    console.log("her is faqitems", faqItems)
    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const data = await layoutApi.getLayout(routes.getLayout("FAQ"));
                if (data?.layout?.faq) {
                    setFaqItems(data.layout.faq);
                }
            } catch (error) {
                console.error("Failed to fetch FAQ:", error);
            }
        };
        fetchFaq();
    }, []);

    return <div className="min-h-52 min-w-screen">
        <h1 className="font-bold text-5xl text-center text-white">Frequently Asked Questions</h1>

        <div className="w-full flex justify-center items-center flex-col text-white">
            {faqItems?.map((val, idx) => (

                <div
                    className="w-[80%] border-b border-white pb-4 pt-4"
                    key={idx}
                >
                    <div className="w-full h-full flex justify-between  pl-2 pr-2">
                        <span>{val.question}</span>
                        <button
                            className="cursor-pointer"
                            onClick={() => {
                                if (down == null) {
                                    setDown(idx)
                                    return
                                }

                                if (down == idx) {
                                    setDown(null)
                                    return
                                }

                                setDown(idx)
                            }}
                        >{down == idx ? <RemoveIcon /> : <AddIcon />}</button>

                    </div>
                    {down == idx &&
                        <div className="w-full h-full flex mt-4 justify-between  pl-2 pr-2">
                            <span>{val.answer}</span>


                        </div>
                    }
                </div>
            ))}
        </div>


    </div>
}