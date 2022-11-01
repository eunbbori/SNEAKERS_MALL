import { Schema } from "mongoose";

const GoodsSchema = new Schema(
    {
        goodsCode: {
            type: String,
            required: true,
        },
        brandName: {
            type: String,
            required: true,
        },
        goodsName: {
            type: String,
            required: true,
        },
        goodsIamge: {
            type: String,
            required: true,
        },
        goodsContent: {
            type: String,
            required: true,
        },
        goodsType: {
            type: String,
            required: true,
        },
        goodsSize: {
            type: Number,
            required: true,
        },
        goodsPrice: {
            type: Number,
            required: true,
        },
        goodsStock: {
            type: Number,
            required: true,
        },
        goodsRegDate: {
            type: String,
            required: true,
        },
    }
);

export { GoodsSchema };
