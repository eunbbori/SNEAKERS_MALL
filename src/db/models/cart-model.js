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

    // 장바구니 삭제 - cartId
    async deleteCart(cartId) {
        console.log(cartId)
        const result = await Cart.deleteOne({_id: cartId});
        return result;
    }

    // 장바구니 전체삭제 - userId
    async deleteAll(userId){
        const result = await Cart.deleteMany({ userId: userId });
        return result;
    }
}
const cartModel = new CartModel();

export { cartModel };