import { model } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model("order", OrderSchema);

export class OrderModel {
    async create(orderInfo) {
        const createdNewOrder = await Order.create(orderInfo);
        return createdNewOrder;
    }
    async findAll() {
        const order = await Order.find({})
            .sort({createdAt: "desc"});
        return order;
    }
    async findByUserId(userId) {
        const order = await Order.find({ userId: userId })
            .sort({createdAt: "desc"});
        return order;
    }
    async findByOrderId(orderId) {
        const order = await Order.findOne({ _id: orderId });
        return order;
    }
    async updateState(orderId, newState) {
        const result = await Order.findOneAndUpdate({ _id: orderId }, {orderState: newState}, { returnOriginal: false });
        return result;
    }
    async deleteOrder(orderId) {
        const result = await Order.deleteOne({_id: orderId});
        return result;
    }
}
const orderModel = new OrderModel();
export { orderModel };