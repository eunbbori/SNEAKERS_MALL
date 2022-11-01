import { model } from "mongoose";
import { OrderDetailSchema } from "../schemas/orderDetails-schema";

const orderDetails = model("goods", OrderDetailSchema);

export { orderDetails };