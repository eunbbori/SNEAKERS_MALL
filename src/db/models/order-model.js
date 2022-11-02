import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model("order", OrderSchema);

export class OrderModel {
    async create(orderInfo) {
        const createdNewOrder = await Order.create(orderInfo);
        return createdNewOrder;
    }
    async findAll() {
        const order = await Order.find({});
        return order;
    }
    async findById(orderId) {
        const order = await Order.findOne({ _id: orderId });
        return order;
    }
    async update({ orderId, update }) {
        const filter = { _id: orderId };
        const option = { returnOriginal: false };

        const updatedOrder = await Order.findOneAndUpdate(filter, update, option);
        return updatedOrder;
    }
}
const orderModel = new OrderModel();
export { orderModel };