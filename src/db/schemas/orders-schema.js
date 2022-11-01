import { Schema } from "mongoose";

const OrderSchema = new Schema(
    {
        orderId: {
            type: Number,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        orderRec: {
            type: String,
            required: true,
        },
        orderAddr: {
            type: String,
            required: true,
        },
        orderTel: {
            type: String,
            required: true,
        },
        orderAccount: {
            type: Number,
            required: true,
        },
        orderRegDate: {
            type: Date,
            required: true,
        },
        orderState: {
            type: String,
            required: true,
        },
    }
);

export { OrderSchema };
