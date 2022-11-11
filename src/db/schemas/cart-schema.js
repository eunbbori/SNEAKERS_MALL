import { Schema } from "mongoose";

const CartSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        regDate: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
    }
);

export { CartSchema };
