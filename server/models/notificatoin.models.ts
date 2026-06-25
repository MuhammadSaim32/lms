import mongoose, { Document, model } from "mongoose";


interface INotification extends Document {
    title: string,
    message: string,
    status: string,
    userId: string,
}


const NotificationSchema = new mongoose.Schema<INotification>({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})


const Notification = model<INotification>("Notification", NotificationSchema)

export default Notification

