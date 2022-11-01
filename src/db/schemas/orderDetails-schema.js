import { Schema } from "mongoose";

const OrderDetailsSchema = new Schema(
    {
        orderDetailNum: {
            type: Number,
            required: true,
        },
        orderId: {
            type: Number,
            required: true,
        },
        goodsNum: {
            type: Number,
            required: true,
        },
        cartStock: {
            type: Number,
            required: true,
        },
    }
);

export { OrderDetailsSchema };
