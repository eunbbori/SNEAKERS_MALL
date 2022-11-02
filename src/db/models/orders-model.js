import { model } from "mongoose";
import { OrderSchema } from "../schemas/orders-schema";

const Orders = model("orders", OrderSchema);

export { Orders };