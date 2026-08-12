"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import courseApi from "@/api/CourseApi";
import { routes } from "@/routes";
import Protected from "@/components/Protected";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import Avatar from "@mui/material/Avatar";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarIcon from "@mui/icons-material/Star";
import ChatBubbleTwoToneIcon from "@mui/icons-material/ChatBubbleTwoTone";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function CourseAccess() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [down, setDown] = useState<number | null>(0);
  const [current, setCurrent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [star, setStar] = useState(0);
  const [question, setQuestion] = useState("");
  const [showReply, setShowReply] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [review, setReview] = useState("");
  const [showReviewReply, setShowReviewReply] = useState<number | null>(null);
  const [reviewReply, setReviewReply] = useState("");
  const [section, setSection] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourseData = async (isInitial = false) => {
    const id = params?.id as string;
    if (!id) return;

    try {
      if (isInitial) setLoading(true);
      const response = await courseApi.getCourses(routes.getCourse(id));
      const course = response?.data?.course || response;
      setData(course);
      setSection(course.courseData || []);

      setCurrent((prevCurrent: any) => {
        if (!prevCurrent?._id) {
          return course.courseData?.[0]?.videoSectionData?.[0] || null;
        }
        const updatedCurrent = course.courseData?.reduce((found: any, sectionItem: any) => {
          if (found) return found;
          return sectionItem.videoSectionData?.find(
            (item: any) => item._id === prevCurrent._id,
          );
        }, null);
        return updatedCurrent || prevCurrent;
      });
    } catch (error) {
      console.error("Failed to fetch course data:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData(true);
  }, [params]);

  const handleAddQuestion = async () => {
    if (!question.trim()) return;
    try {
      await courseApi.updateCourse(routes.addQuestion, {
        question,
        courseId: params.id,
        contentId: current?._id,
      });
      setQuestion("");
      await fetchCourseData(false);
    } catch (error) {
      console.error("Failed to add question:", error);
    }
  };

  const handleReply = async (questionId: string) => {
    if (!answer.trim()) return;
    try {
      await courseApi.updateCourse(routes.addAnswer, {
        answer,
        questionId,
        courseId: params.id,
        contentId: current?._id,
      });
      setAnswer("");
      setShowReply(null);
      await fetchCourseData(false);
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  const handleAddReview = async () => {
    if (!review.trim() || star === 0) return;
    try {
      await courseApi.updateCourse(routes.addReview(params.id as string), {
        review,
        rating: star,
      });
      setReview("");
      setStar(0);
      await fetchCourseData(false);
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
        reviewId,
      });
      setReviewReply("");
      setShowReviewReply(null);
      await fetchCourseData(false);
    } catch (error) {
      console.error("Failed to add review reply:", error);
    }
  };

  // Flatten all lectures to handle Prev / Next navigation
  const allLectures = section.flatMap((sec) => sec.videoSectionData || []);
  const currentIndex = allLectures.findIndex((l) => l._id === current?._id);

  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      setCurrent(allLectures[currentIndex - 1]);
    }
  };

  const handleNextVideo = () => {
    if (currentIndex >= 0 && currentIndex < allLectures.length - 1) {
      setCurrent(allLectures[currentIndex + 1]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-sm">Loading Live Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Protected>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Navigation Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <ArrowBackIcon className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-white tracking-tight line-clamp-1">
              {data?.name || "Live Course Room"}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Session
            </span>
          </div>
        </header>

        {/* Main Workspace Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: Player & Interactive Workspace */}
          <div className="lg:col-span-8 flex flex-col h-full border-r border-slate-800/80 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Video Player Box */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 aspect-video relative group">
              {current?.videoUrl ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${current?.videoUrl}?autoplay=1&rel=0`}
                  title={current?.title || "Lesson Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <OndemandVideoIcon className="w-16 h-16 mb-2 opacity-40" />
                  <p>No video content selected</p>
                </div>
              )}
            </div>

            {/* Video Navigation & Title Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/70">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {current?.title || "Select a lecture"}
                </h2>
                {current?.videoLength && (
                  <p className="text-xs text-indigo-400 font-medium mt-1">
                    Duration: {current?.videoLength} minutes
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handlePrevVideo}
                  disabled={currentIndex <= 0}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all border border-slate-700"
                >
                  <NavigateBeforeIcon className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={handleNextVideo}
                  disabled={currentIndex < 0 || currentIndex >= allLectures.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20"
                >
                  Next
                  <NavigateNextIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-1.5 flex gap-2">
              {[
                { id: 1, label: "Overview" },
                { id: 3, label: "Q&A Discussions" },
                { id: 4, label: "Reviews & Feedback" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 px-4 text-sm font-semibold rounded-lg transition-all text-center cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content Box */}
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 min-h-[260px]">
              {/* Tab 1: Overview */}
              {activeTab === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">Lesson Description</h3>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {current?.description || "No specific description provided for this lesson module."}
                  </p>
                </div>
              )}

              {/* Tab 3: Q&A */}
              {activeTab === 3 && (
                <div className="space-y-6">
                  {/* Question Submission Input */}
                  <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
                    <h3 className="text-sm font-semibold text-slate-200">Have a Question?</h3>
                    <textarea
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none resize-none transition-all"
                      placeholder="Ask something about this lesson..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddQuestion}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
                      >
                        <SendIcon className="w-4 h-4" />
                        Post Question
                      </button>
                    </div>
                  </div>

                  {/* Question Stream */}
                  <div className="space-y-4 pt-2">
                    {current?.questions && current.questions.length > 0 ? (
                      current.questions.map((val: any, i: number) => (
                        <div
                          key={i}
                          className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar
                              src={val?.user?.avatar?.url}
                              sx={{ bgcolor: "#6366f1", width: 36, height: 36 }}
                            >
                              {val?.user?.name?.[0] || "U"}
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-white">
                                  {val?.user?.name || "Student"}
                                </span>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed">
                                {val?.question}
                              </p>

                              {/* Toggle Reply Input */}
                              <div className="flex items-center gap-4 pt-2 text-xs">
                                <button
                                  onClick={() => setShowReply(showReply === i ? null : i)}
                                  className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                                >
                                  Reply
                                </button>
                                <span className="text-slate-500 flex items-center gap-1">
                                  <ChatBubbleTwoToneIcon className="w-3.5 h-3.5" />
                                  {val?.QuestionReply?.length || 0} replies
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Reply Input */}
                          {showReply === i && (
                            <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                              <input
                                type="text"
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-indigo-500"
                                placeholder="Write your reply..."
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                              />
                              <button
                                onClick={() => handleReply(val._id)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                              >
                                Reply
                              </button>
                            </div>
                          )}

                          {/* Nested Replies */}
                          {val?.QuestionReply?.length > 0 && (
                            <div className="pl-6 space-y-3 pt-2 border-l-2 border-slate-800 ml-4">
                              {val.QuestionReply.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-2.5">
                                  <Avatar
                                    src={item?.user?.avatar?.url}
                                    sx={{ width: 28, height: 28, bgcolor: "#3b82f6" }}
                                  >
                                    {item?.user?.name?.[0] || "A"}
                                  </Avatar>
                                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 flex-1">
                                    <span className="font-semibold text-xs text-indigo-300 block">
                                      {item?.user?.name || "Instructor"}
                                    </span>
                                    <p className="text-xs text-slate-300 mt-0.5">
                                      {item?.answer}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-4">
                        No questions asked yet for this video module.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 4: Reviews */}
              {activeTab === 4 && (
                <div className="space-y-6">
                  {/* Rating Box */}
                  <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl space-y-4">
                    <h3 className="text-sm font-semibold text-slate-200">Rate this course</h3>
                    <div className="flex items-center gap-2">
                      {Array(5)
                        .fill(0)
                        .map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setStar(idx + 1)}
                            className="cursor-pointer hover:scale-110 transition-transform"
                          >
                            {idx + 1 <= star ? (
                              <StarIcon className="text-amber-400 w-6 h-6" />
                            ) : (
                              <StarBorderRoundedIcon className="text-slate-600 w-6 h-6" />
                            )}
                          </button>
                        ))}
                    </div>

                    <textarea
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 outline-none resize-none transition-all"
                      placeholder="Leave your review or experience..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddReview}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/20"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </div>

                  {/* Reviews Stream */}
                  <div className="space-y-4">
                    {data?.reviews && data.reviews.length > 0 ? (
                      data.reviews.map((item: any, i: number) => (
                        <div key={i} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <Avatar src={item?.user?.avatar?.url} sx={{ width: 36, height: 36, bgcolor: "#ec4899" }}>
                              {item?.user?.name?.[0] || "R"}
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-sm text-white">
                                  {item?.user?.name || "Anonymous Student"}
                                </span>
                                <div className="flex text-amber-400">
                                  {Array(5)
                                    .fill(0)
                                    .map((_, idx) => (
                                      <span key={idx}>
                                        {item.rating >= idx + 1 ? (
                                          <StarIcon className="w-4 h-4 text-amber-400" />
                                        ) : (
                                          <StarBorderRoundedIcon className="w-4 h-4 text-slate-600" />
                                        )}
                                      </span>
                                    ))}
                                </div>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed">{item?.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-4">No reviews submitted yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Syllabus Accordion Sidebar */}
          <div className="lg:col-span-4 bg-slate-900/50 flex flex-col h-full border-t lg:border-t-0 overflow-y-auto p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">Course Content</h2>
              <span className="text-xs text-slate-400 font-medium">
                {allLectures.length} Lectures
              </span>
            </div>

            {/* Curriculum Accordion List */}
            <div className="space-y-3">
              {section && Array.isArray(section) && section.map((val: any, idx: number) => {
                const isOpen = down === idx;
                return (
                  <div
                    key={idx}
                    className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden transition-all"
                  >
                    {/* Section Header Button */}
                    <button
                      onClick={() => setDown(isOpen ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <div className="pr-2">
                        <h3 className="text-sm font-bold text-slate-100">
                          {val.videoSection || `Module ${idx + 1}`}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {val.videoSectionData?.length || 0} Lessons
                        </p>
                      </div>
                      <div className="text-slate-400">
                        {isOpen ? (
                          <KeyboardArrowUpIcon className="w-5 h-5 text-indigo-400" />
                        ) : (
                          <KeyboardArrowDownIcon className="w-5 h-5" />
                        )}
                      </div>
                    </button>

                    {/* Section Video Items */}
                    {isOpen && (
                      <div className="border-t border-slate-800/80 divide-y divide-slate-800/50 bg-slate-950/50">
                        {val.videoSectionData?.map((item: any, i: number) => {
                          const isSelected = current?._id === item._id;
                          return (
                            <div
                              key={i}
                              onClick={() => setCurrent(item)}
                              className={`p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-indigo-600/15 border-l-4 border-indigo-500 text-white font-medium"
                                  : "hover:bg-slate-900/60 text-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-2">
                                {isSelected ? (
                                  <CheckCircleIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                                ) : (
                                  <OndemandVideoIcon className="w-4 h-4 text-slate-500 shrink-0" />
                                )}
                                <span className="text-xs truncate">{item.title}</span>
                              </div>
                              {item.videoLength && (
                                <span className="text-[11px] text-slate-500 shrink-0">
                                  {item.videoLength}m
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Protected>
  );
}

