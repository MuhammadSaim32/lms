"use client"
import { sideBaritems } from "./adminSidebarLinks"
import Avatar from "@mui/material/Avatar";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
// MUI Icon imports
import LeaderboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import WebIcon from '@mui/icons-material/Web';
import QuizIcon from '@mui/icons-material/Quiz';
import CategoryIcon from '@mui/icons-material/Category';
import ChatIcon from '@mui/icons-material/Chat';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function AdminSideBar() {
    const [active, setActive] = useState(true)
    const { data: userData } = useAuth()

    function IconLookup(icon?: string) {
        switch (icon) {
            case "LeaderboardIcon":
                return <LeaderboardIcon fontSize="small" />;
            case "GroupIcon":
                return <GroupIcon fontSize="small" />;
            case "ReceiptIcon":
                return <ReceiptIcon fontSize="small" />;
            case "VideoCallIcon":
                return <VideoCallIcon fontSize="small" />;
            case "OndemandVideoIcon":
                return <OndemandVideoIcon fontSize="small" />;
            case "WebIcon":
                return <WebIcon fontSize="small" />;
            case "QuizIcon":
                return <QuizIcon fontSize="small" />;
            case "CategoryIcon":
                return <CategoryIcon fontSize="small" />;
            case "ChatIcon":
                return <ChatIcon fontSize="small" />;
            case "BarChartIcon":
                return <BarChartIcon fontSize="small" />;
            default:
                return null;
        }
    }


    return active ? <div className="h-full  w-[20%] bg-slate-900 flex-col flex items-center overflow-auto text-white scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        <div className=" flex min-h-16 h-[9%] items-center justify-between w-[90%] ">
            <h1>ELEARNING</h1>
            <button
                className="cursor-pointer"
                onClick={() => {
                    setActive(false)
                }}>
                <ArrowBackIosNewIcon />
            </button>
        </div>

        <div className="flex flex-col justify-around h-[20%] min-h-32 items-center">
            <Avatar sx={{ width: 56, height: 56 }}
                src={`${userData?.userData?.avatar?.url}`}
            />
            <h1>{userData?.userData?.name} - Admin </h1>
        </div>

        <div className=" flex flex-col justify-around flex-1  ">
            {sideBaritems.map((val, idx) => (
                <div key={idx} className="flex flex-col gap-3 mb-4">
                    {val.title && <h3 className="font-bold">{val.title}</h3>}

                    {val.children.map((val, idx) => (
                        <div key={idx}>

                            {IconLookup(val.icon)}

                            <Link
                                className="ml-3"
                                key={idx}
                                href={`${val.url}`}>{val.name}</Link>
                        </div>
                    ))}


                </div>
            ))}
        </div>





    </div> : (
        <div className="h-screen  w-[4%] bg-blue-500 flex-col flex overflow-auto ">
            <div className="h-[9%]  flex justify-center">
                <button
                    className="cursor-pointer "
                    onClick={() => { setActive(true) }}>
                    <ArrowBackIosNewIcon />
                </button>
            </div>
            <div className=" flex flex-col justify-around  ">
                {sideBaritems.map((val, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                        <br />
                        {val.children.map((val, idx) => (
                            <div key={idx}>

                                <Link
                                    className="ml-3"
                                    key={idx}
                                    href={`${val.url}`}> {IconLookup(val.icon)}</Link>


                            </div>
                        ))}


                    </div>
                ))}
            </div>


        </div >
    )

}