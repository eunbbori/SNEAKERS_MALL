import { Schema } from "mongoose";

const CartSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        productCode: {
            type: String,
            required: true,
        },
        productImage: {
            type: String,
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        productType: {
            type: String,
            required: true,
        },
        productPrice: {
            type: String,
            required: true,
        },
        brandName: {
            type: String,
            required: true,
        },
        goodsSize: {
            type: Number,
            required: true,
        },
    }
);

export { CartSchema };
