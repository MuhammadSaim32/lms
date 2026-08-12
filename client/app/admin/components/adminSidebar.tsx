"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import { sideBaritems } from "./adminSidebarLinks";
import { useAuth } from "../../../context/AuthContext";

// Icons
import LeaderboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import ReceiptIcon from "@mui/icons-material/Receipt";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import WebIcon from "@mui/icons-material/Web";
import QuizIcon from "@mui/icons-material/Quiz";
import CategoryIcon from "@mui/icons-material/Category";
import ChatIcon from "@mui/icons-material/Chat";
import BarChartIcon from "@mui/icons-material/BarChart";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";

export default function AdminSideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: userData } = useAuth();

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

  return (
    <aside
      className={`h-screen bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 select-none z-20 ${
        collapsed ? "w-16 sm:w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header / Brand */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <SchoolIcon fontSize="small" />
            </div>
            <span className="font-extrabold text-base tracking-wider text-white">
              ELEARNING
            </span>
          </Link>
        )}

        {collapsed && (
          <div className="mx-auto p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <SchoolIcon fontSize="small" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </button>
      </div>

      {/* User Info Profile Card */}
      {!collapsed ? (
        <div className="mx-3 my-4 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center gap-3">
          <Avatar
            sx={{ width: 40, height: 40 }}
            src={userData?.userData?.avatar?.url}
            className="ring-2 ring-indigo-500/40"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-white truncate">
              {userData?.userData?.name || "Admin"}
            </span>
            <span className="text-[10px] text-indigo-400 font-medium tracking-wide">
              Administrator
            </span>
          </div>
        </div>
      ) : (
        <div className="my-4 flex justify-center">
          <Avatar
            sx={{ width: 36, height: 36 }}
            src={userData?.userData?.avatar?.url}
            className="ring-2 ring-indigo-500/40"
          />
        </div>
      )}

      {/* Sidebar Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {sideBaritems.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && !collapsed && (
              <h3 className="px-3 text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                {section.title}
              </h3>
            )}

            {section.children.map((item, childIdx) => {
              const isActive = pathname === item.url;
              return (
                <Link
                  key={childIdx}
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border-l-2 border-indigo-500 font-semibold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  } ${collapsed ? "justify-center px-0" : ""}`}
                  title={collapsed ? item.name : undefined}
                >
                  <span className={isActive ? "text-indigo-400" : "text-slate-400"}>
                    {IconLookup(item.icon)}
                  </span>
                  {!collapsed && <span className="capitalize">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer System Pill */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/80 text-center">
          <span className="text-[10px] text-slate-500 font-mono">
            Admin v1.0.0 &bull; Dark Mode
          </span>
        </div>
      )}
    </aside>
  );
}