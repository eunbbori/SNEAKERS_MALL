import { Schema } from "mongoose";

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  }
);

export { BrandSchema };
