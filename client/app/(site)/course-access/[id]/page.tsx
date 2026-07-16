"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import courseApi from "@/api/CourseApi";
import { routes } from "@/routes";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Avatar from "@mui/material/Avatar";
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarIcon from '@mui/icons-material/Star';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
export default function CourseAccess() {
    const params = useParams();
    const [data, setData] = useState<any>(null);
    const [down, setDown] = useState(null)
    const [current, setCurrent] = useState(null)
    const [active, setActive] = useState(1)
    const [star, setStar] = useState(0)
    const [question, setQuestion] = useState("")
    const [showReply, setShowReply] = useState(null)
    const [answer, setAnswer] = useState("")
    const [review, setReview] = useState("")
    const [showReviewReply, setShowReviewReply] = useState(null)
    const [reviewReply, setReviewReply] = useState("")
    const [section, setSection] = useState(null)
    console.log("her reviews", data?.reviews)
    useEffect(() => {
        const fetchCourseData = async () => {
            const id = params?.id as string;
            if (id) {
                try {
                    const response = await courseApi.getCourses(routes.getCourse(id));
                    console.log("here is course data", response)
                    setData(response?.data?.course || response);

                    setSection(response?.data?.course?.courseData)
                    setCurrent(response.data.course.courseData[0].videoSectionData[0])
                } catch (error) {
                    console.error("Failed to fetch course data:", error);
                }
            }
        };

        fetchCourseData();
    }, [params]);

    const handleAddQuestion = async () => {
        if (!question.trim()) return;
        try {
            const res = await courseApi.updateCourse(routes.addQuestion, {
                question,
                courseId: params.id,
                contentId: current?._id
            });
            setData(res?.data?.course?.courseData || res.data);
            setQuestion("");
        } catch (error) {
            console.error("Failed to add question:", error);
        }
    };

    const handleReply = async (questionId: string) => {
        if (!answer.trim()) return;
        try {
            const res = await courseApi.updateCourse(routes.addAnswer, {
                answer,
                questionId,
                courseId: params.id,
                contentId: current?._id
            });
            setData(res?.data?.course?.courseData || res.data);
            setAnswer("");
            setShowReply(null);
        } catch (error) {
            console.error("Failed to add reply:", error);
        }
    };

    const handleAddReview = async () => {
        if (!review.trim() || star === 0) return;
        try {
            await courseApi.updateCourse(routes.addReview(params.id as string), {
                review,
                rating: star
            });
            setReview("");
            setStar(0);
        } catch (error) {
            console.error("Failed to add review:", error);
        }
    };

    const handleReviewReply = async (reviewId: string) => {
        if (!reviewReply.trim()) return;
        try {
            await courseApi.updateCourse(routes.addReplyToReview, {
                review: reviewReply,
                courseId: params.id,
                reviewId
            });
            setReviewReply("");
            setShowReviewReply(null);
        } catch (error) {
            console.error("Failed to add review reply:", error);
        }
    };

    console.log("Course Access Data:", current);

    return (
        <div className="bg-slate-900  border-t border-white flex justify-around overflow-auto  min-h-screen  ">

            <div className="w-[50%] mt-5 flex flex-col ">

                <iframe
                    width="100%"
                    height="480"
                    src='https://www.youtube.com/embed/VeVahOuZIr8'
                    title="Course video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                <div className="flex justify-between mt-5">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md  cursor-pointer">
                        Previous
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md cursor-pointer">
                        Next
                    </button>
                </div>
                <h1
                    className="text-white text-2xl mt-5 mb-5"
                >{current?.title}</h1>

                <div className="text-white flex justify-around bg-gray-800 h-[5%] items-center py-4">
                    <button
                        className={`cursor-pointer ${active === 1 ? "text-red-400" : ""}`}
                        onClick={() => setActive(1)}
                    >OverView</button>
                    <button
                        className={`cursor-pointer ${active === 2 ? "text-red-400" : ""}`}
                        onClick={() => setActive(2)}
                    >Resources</button>
                    <button
                        className={`cursor-pointer ${active === 3 ? "text-red-400" : ""}`}
                        onClick={() => setActive(3)}
                    >Q&A</button>
                    <button
                        className={`cursor-pointer ${active === 4 ? "text-red-400" : ""}`}
                        onClick={() => setActive(4)}
                    >Reviews</button>
                </div>



                {active == 1 && (<div className="mt-5 text-white">

                    {current?.description}
                </div>)}
                {active == 3 && (
                    <div className="flex flex-col">
                        <div className="flex flex-col gap-5 pb-9 border-b border-white">

                            <div className="mt-5 text-white flex gap-2  ">
                                <Avatar>s</Avatar>
                                <textarea
                                    className=" flex-1 h-16 resize-none border border-white outline-0 p-2"
                                    placeholder="Enter the Question"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                ></textarea>

                            </div>
                            <button
                                onClick={handleAddQuestion}
                                className="w-[15%] text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md cursor-pointer">
                                Submit
                            </button>

                        </div>

                        {current?.questions && current.questions.map((val, i) => (
                            <div
                                key={i}
                                className="flex  gap-3 mt-5 text-white mb-4 ">
                                <Avatar
                                    src={`${val.user.avatar.url}`}
                                />
                                <div>
                                    <div
                                        className="text-white text-xl gap-2"
                                    > {val.user.name}
                                    </div>
                                    <div>{val.question}</div>
                                    <div className="flex gap-2">
                                        <div className="cursor-pointer"
                                            onClick={() => {
                                                if (showReply == null) {
                                                    setShowReply(i)
                                                    return
                                                }

                                                if (showReply == i) {
                                                    setShowReply(null)
                                                    return
                                                }
                                                setShowReply(i)
                                            }}
                                        >Add replay here</div>
                                        <div><ChatBubbleTwoToneIcon />
                                            {val?.QuestionReply?.length}
                                        </div>

                                    </div>

                                    {showReply == i && (

                                        <div className="flex justify-between w-full gap-2">
                                            <input type="text"
                                                className="mt-3 flex-1 outline-0 border border-white p-2 bg-transparent text-white"
                                                placeholder="Enter Your Reply"
                                                value={answer}
                                                onChange={(e) => setAnswer(e.target.value)}
                                            />
                                            <button
                                                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
                                                onClick={() => handleReply(val._id)}
                                            >Submit</button>
                                        </div>

                                    )}
                                    {val?.QuestionReply?.length > 0 && val.QuestionReply.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex gap-3  mt-5">
                                            <Avatar
                                                src={`${item.user.avatar.url}`}
                                            />
                                            <div className="flex flex-col gap-2">
                                                <div
                                                    className="text-white text-xl gap-2"
                                                > {item.user.name}
                                                </div>
                                                <div>{item.answer}</div>
                                            </div>
                                        </div>
                                    ))
                                    }

                                </div>

                            </div>
                        ))}

                    </div>


                )}

                {active == 4 && (

                    <div className="flex w-full flex-col gap-2">
                        <div className="mt-5 text-white flex flex-col gap-4  ">
                            <div className="flex gap-3">
                                <Avatar>s</Avatar>
                                <div>
                                    <div>Give A rating</div>


                                    <div
                                    >{Array(5).fill(0).map((_, idx) => (

                                        <button
                                            key={idx}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setStar(idx + 1)
                                            }}
                                        >

                                            {idx + 1 <= star ? <StarIcon
                                                sx={{ color: "#ffd700" }}

                                            /> :
                                                <StarBorderRoundedIcon
                                                    sx={{ color: "#ffd700" }}
                                                />
                                            }

                                        </button>
                                    ))}</div>


                                </div>
                            </div>
                            <textarea
                                className="p-2 resize-none border border-white outline-0 h-20  text-white"
                                placeholder="Write Your Comment"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            ></textarea>

                            <button
                                className="w-[15%] text-center bg-blue-600  hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md cursor-pointer"
                                onClick={handleAddReview}
                            >
                                Submit
                            </button>
                        </div>
                        <div className="mt-4 mb-6">
                            {data?.reviews.length > 0 && data?.reviews.map((item, i) => (
                                <div className="mt-5"
                                    key={i}>
                                    <div className="flex  gap-2.5">
                                        <Avatar>s</Avatar>

                                        <div className="text-white">
                                            <div> {item?.user?.name}</div>
                                            <div className="flex">
                                                {Array(5).fill(0).map((_, idx) => (


                                                    <div key={idx}>
                                                        {
                                                            item.rating >= idx + 1 ? <StarIcon
                                                                sx={{ color: "#ffd700" }}

                                                            /> :
                                                                <StarBorderRoundedIcon
                                                                    sx={{ color: "#ffd700" }}
                                                                />
                                                        }
                                                    </div>


                                                ))}

                                            </div>
                                            <div>{item?.comment}</div>
                                            <div className="flex gap-2">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        if (showReviewReply == null) {
                                                            setShowReviewReply(i)
                                                            return
                                                        }
                                                        if (showReviewReply == i) {
                                                            setShowReviewReply(null)
                                                            return
                                                        }
                                                        setShowReviewReply(i)
                                                    }}
                                                >Add reply here</div>
                                                <div><ChatBubbleTwoToneIcon /> </div>
                                            </div>
                                            {showReviewReply == i && (
                                                <div className="flex justify-between w-full gap-2">
                                                    <input
                                                        type="text"
                                                        className="mt-3 flex-1 outline-0 border border-white p-2  text-white"
                                                        placeholder="Enter Your Reply"
                                                        value={reviewReply}
                                                        onChange={(e) => setReviewReply(e.target.value)}
                                                    />
                                                    <button
                                                        className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
                                                        onClick={() => handleReviewReply(item._id)}
                                                    >Submit</button>
                                                </div>
                                            )}
                                            {item?.commentReplies?.length > 0 && item.commentReplies.map((reply, idx) => (
                                                <div key={idx} className="flex gap-3 mt-3">
                                                    <Avatar src={`${reply.user?.avatar?.url}`} />
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-white text-lg">{reply.user?.name}</div>
                                                        <div>{reply.comment}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                </div>

                            ))}
                        </div>
                    </div>

                )}

            </div>

            <div className="flex flex-col w-[40%] text-white mt-5">
                {section && Array.isArray(section) && section?.map((val, idx) => (
                    < div key={idx} className="border-b border-white">
                        < div className="flex justify-between text-white mt-3 " >
                            <div className="text-2xl">
                                {val.videoSection}
                            </div>
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
                                }}>
                                {down != idx ? <ArrowDownwardIcon />
                                    : <ArrowUpwardIcon />}
                            </button>
                        </div>

                        <div className="mt-2">
                            {val.videoSectionData.length}-Lecurtures 1.20 hourse
                        </div>

                        {down == idx && val.videoSectionData.map((item, i) =>
                            <div

                                onClick={() => {
                                    setCurrent(item)
                                }}
                                key={i}
                                className={`mt-5 flex cursor-pointer flex-col gap-2 ml-5 mb-3  p-4 ${current._id == item._id ? "bg-gray-500" : ""}`} >
                                <div>
                                    <span className="mr-2 ">
                                        <OndemandVideoIcon />
                                    </span>   {item.title}
                                </div>
                                <div>
                                    {item.videoLength} minutes
                                </div>

                            </div>
                        )}
                    </div>

                ))
                }
            </div >
        </div >
    );
}


