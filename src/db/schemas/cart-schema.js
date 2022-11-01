import { Schema } from "mongoose";

const CartSchema = new Schema(
    {
        cartNum: {
            type: Number,
            required: true,
        },
        userId: {
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
        cartRegDate: {
            type: Number,
            required: true,
        },
    }
);

export { CartSchema };
