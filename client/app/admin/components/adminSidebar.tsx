"use client"
import { sideBaritems } from "./adminSidebarLinks"
import Avatar from "@mui/material/Avatar";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Link from "next/link";
import { useState } from "react";

// MUI Icon imports
import DashboardIcon from '@mui/icons-material/Dashboard';
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


    function IconLookup(icon?: string) {
        switch (icon) {
            case "DashboardIcon":
                return <DashboardIcon />;
            case "GroupIcon":
                return <GroupIcon />;
            case "ReceiptIcon":
                return <ReceiptIcon />;
            case "VideoCallIcon":
                return <VideoCallIcon />;
            case "OndemandVideoIcon":
                return <OndemandVideoIcon />;
            case "WebIcon":
                return <WebIcon />;
            case "QuizIcon":
                return <QuizIcon />;
            case "CategoryIcon":
                return <CategoryIcon />;
            case "ChatIcon":
                return <ChatIcon />;
            case "BarChartIcon":
                return <BarChartIcon />;
            default:
                return null;
        }
    }


    return active ? <div className="h-screen w-[20%] bg-blue-500 flex-col flex items-center overflow-auto ">
        <div className=" flex   h-[9%] items-center justify-between w-[90%] ">
            <h1>ELEARNING</h1>
            <button
                className="cursor-pointer"
                onClick={() => {
                    setActive(false)
                }}>
                <ArrowBackIosNewIcon />
            </button>
        </div>

        <div className="flex flex-col justify-around h-[20%]">
            <Avatar
                sx={{ width: 56, height: 56 }}

            >
                S
            </Avatar >
            <h1>ALi - Admin</h1>
        </div>

        <div className=" flex flex-col justify-around flex-1  ">
            {sideBaritems.map((val, idx) => (
                <div key={idx} className="flex flex-col gap-3">
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
        <div className="h-screen w-[4%] bg-blue-500 flex-col flex overflow-auto ">
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