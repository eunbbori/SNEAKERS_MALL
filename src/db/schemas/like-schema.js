import { Schema } from "mongoose";

const LikeSchema = new Schema(
  {
    productCode: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  }
);

export { LikeSchema };
