import { Schema } from "mongoose";

const OrderDetailSchema = new Schema(
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

export { OrderDetailSchema };