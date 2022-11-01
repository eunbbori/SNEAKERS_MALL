import { model } from "mongoose";
import { OrdersSchema } from "../schemas/orders-schema";

const Orders = model("orders", OrdersSchema);

export { Orders };