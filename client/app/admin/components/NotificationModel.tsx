import { Modal, Box } from "@mui/material";
import notificationApi from "../../../api/NotificationApi";
import routes from "../../../routes/index";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: any[];
  onMarkRead: (id: string) => void;
}

const modalStyle = {
  position: "absolute" as const,
  top: "70px",
  right: "24px",
  width: "380px",
  maxWidth: "92vw",
  outline: "none",
};

const NotificationModel = ({ open, setOpen, data, onMarkRead }: Props) => {
  const handleMarkRead = async (id: string) => {
    try {
      await notificationApi.updateNotificationStatus(
        routes.updateNotificationStatus(id)
      );
      onMarkRead(id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="notification-modal-title"
      aria-describedby="notification-modal-description"
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "rgba(2, 6, 23, 0.4)", backdropFilter: "blur(4px)" },
        },
      }}
    >
      <Box sx={modalStyle}>
        <div className="bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[520px]">
          {/* Modal Header */}
          <div className="p-4 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2 text-white">
              <NotificationsIcon className="text-indigo-400 w-5 h-5" />
              <h2 className="font-extrabold text-sm tracking-tight">
                Notifications
              </h2>
              {data.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold">
                  {data.length} new
                </span>
              )}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body / Items Stream */}
          <div className="p-3 overflow-y-auto space-y-2.5 divide-y-0">
            {data && data.length > 0 ? (
              data.map((val, i) => (
                <div
                  key={val._id || i}
                  className="p-3.5 bg-slate-950/70 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-xs text-slate-100 group-hover:text-indigo-300 transition-colors leading-snug">
                      {val.title}
                    </h3>
                    <button
                      onClick={() => handleMarkRead(val._id)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-2 py-1 rounded-lg transition-all shrink-0 cursor-pointer"
                    >
                      <CheckCircleIcon className="w-3 h-3" />
                      Done
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                    {val.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <NotificationsNoneIcon className="w-10 h-10 opacity-30" />
                <p className="text-xs font-medium">All caught up! No unread notifications.</p>
              </div>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default NotificationModel;