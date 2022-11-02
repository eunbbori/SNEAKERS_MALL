import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Orders = model("orders", OrderSchema);

export { Orders };