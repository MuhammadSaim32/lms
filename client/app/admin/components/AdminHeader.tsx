"use client";

import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import NotificatoinModel from "../../admin/components/NotificationModel";
import notificationApi from "../../../api/NotificationApi";
import routes from "@/routes";

export default function AdminHeader() {
  const [socket, setSocket] = useState(null);
  const [open, setOpen] = useState(false);
  const [noData, SetnoData] = useState<any[]>([]);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SERVER_URI);
    setSocket(socketInstance);

    socketInstance.on("notification", (data) => {
      console.log("Real-time event received:", data);
      let sound = new Audio("/sounds/noti.wav");
      sound.play();

      SetnoData((prev) => [...prev, data]);
    });

    const fetchNotifications = async () => {
      try {
        const res = await notificationApi.getNotifications(
          routes.getAllNotification
        );
        const unread = res.notifications.filter(
          (item: any) => item.status === "unread"
        );
        SetnoData(unread);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <header className="h-14 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-6 flex items-center justify-end text-slate-100 shrink-0">
      <NotificatoinModel
        open={open}
        setOpen={setOpen}
        data={noData}
        onMarkRead={(id) =>
          SetnoData((prev) => prev.filter((n) => n._id !== id))
        }
      />
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer relative"
        title="Notifications"
      >
        <Badge
          badgeContent={noData.length || 0}
          color="error"
          max={99}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#6366f1",
              color: "#ffffff",
              fontSize: "10px",
              height: "18px",
              minWidth: "18px",
            },
          }}
        >
          <NotificationsIcon fontSize="small" />
        </Badge>
      </button>
    </header>
  );
}
