import mongoose, { Document, model } from "mongoose";


interface IOrder extends Document {
    courseId: string;
    userId: string;
    paymentInfo: object;
}


const OrderSchema = new mongoose.Schema<IOrder>({
    courseId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    paymentInfo: {
        type: Object,
        // required: true
    }
}, {
    timestamps: true
})


const Order = model<IOrder>("Order", OrderSchema)

export default Order

