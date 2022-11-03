import { model } from "mongoose";
import { OrderDetailSchema } from "../schemas/orderDetails-schema";

const OrderDetails = model("ordersDetails", OrderDetailSchema);

export { OrderDetails };