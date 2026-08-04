"use client";

import Badge from "@mui/material/Badge";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { io, Socket } from "socket.io-client";
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
      // Increment the badge counter whenever a new message lands
    });

    const fetchNotifications = async () => {
      try {
        const res = await notificationApi.getNotifications(
          routes.getAllNotification,
        );
        const unread = res.notifications.filter(
          (item: any) => item.status === "unread",
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
    <div className="flex justify-end mr-14  h-[10%] ">
      <NotificatoinModel
        open={open}
        setOpen={setOpen}
        data={noData}
        onMarkRead={(id) =>
          SetnoData((prev) => prev.filter((n) => n._id !== id))
        }
      />
      <button
        className=""
        onClick={() => {
          setOpen(!open);
        }}
      >
        <Badge badgeContent={noData.length || 0} color="secondary" max={100}>
          <NotificationsIcon />
        </Badge>
      </button>
    </div>
  );
}
