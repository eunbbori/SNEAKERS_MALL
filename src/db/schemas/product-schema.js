import { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    regDate: {
      type: Date,
      default: Date.now
    },
    likeCount : {
      type : Number,
      default : 0 
    }
  }
);

export { ProductSchema };
