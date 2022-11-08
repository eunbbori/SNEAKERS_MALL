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
        orderList: [
            {
                productCode: {type: String, required: true},
                productName: {type: String, required: true},
                quantity: {type: Number, required: true}
            },
            {
                _id: false,
            }
        ],
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
