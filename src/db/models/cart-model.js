import { model } from "mongoose";
import { CartSchema } from "../schemas/cart-schema";

const Cart = model("cart", CartSchema);

export class CartModel {

    // 장바구니 추가
    async create(cartInfo) {
        const createdNewOrder = await Cart.create(cartInfo);
        return createdNewOrder;
    }

    // 장바구니 조회
    async findGroupByUserId(userId) {
        const order = await Cart.find({"userId" :userId}).sort({regDate: "desc"});
        return order;
    }
}
const cartModel = new CartModel();

export { cartModel };