import { Modal, Box } from "@mui/material"
import notificationApi from "../../../api/NotificationApi"
import routes from "../../../routes/index"

interface Props {
    open: boolean
    setOpen: (open: boolean) => void,
    data: any[]
    onMarkRead: (id: string) => void
}

const style = {
    position: 'absolute',
    top: '9%',
    right: '5%',
    width: 400,
    bgcolor: '#0f172a',
    color: '#f1f5f9',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const CustomModel = ({ open, setOpen, data, onMarkRead }: Props) => {

    const handleMarkRead = async (id: string) => {
        try {
            await notificationApi.updateNotificationStatus(
                routes.updateNotificationStatus(id)
            );
            onMarkRead(id);
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    }

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>

                <h1 className="text-center mb-3">Notifications</h1>
                {data.map((val, i) => (
                    <div
                        key={i}
                        className="bg-gray-700 pt-2 px-2 border-b border-white">
                        <div className="flex justify-between mb-3">
                            <div>{val.title}</div>
                            <button onClick={() => handleMarkRead(val._id)}>Mark As Read</button>
                        </div>
                        <div
                            className="mb-4"
                        >{val.message}</div>

                    </div>
                ))}
            </Box>
        </Modal >
    )
}

export default CustomModel