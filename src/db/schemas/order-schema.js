import { Schema } from "mongoose";

const OrderSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        tel: {
            type: String,
            required: true,
        },
        account: {
            type: String,
            required: true,
        },
        orderList: {
            type: Object,
            required: true,
        },
        orderState: {
            type: String,
            required: true,
        },
    },
    {
        collection: "order",
        timestamps: true,
    }
);

export { OrderSchema };
