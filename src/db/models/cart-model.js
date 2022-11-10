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
        const cart = await Cart.find({"userId" :userId}).sort({regDate: "desc"});
        return cart;
    }

    // 장바구니 수정
    async updateCartQuantity(cartId, newQuantity) {
        const result = await Cart.findOneAndUpdate({ _id: cartId }, {quantity: newQuantity}, { returnOriginal: false });
        return result;
    }


    // 장바구니 삭제 - cartId
    async deleteCart(cartId) {
        const result = await Cart.deleteOne({_id: cartId});
        return result;
    }

    // 장바구니 전체삭제 - userId
    async deleteAll(userId){
        const result = await Cart.deleteMany({ userId: userId });
        return result;
    }

    // 장바구니 특정상품의 수량을 누적하여 변경
    async updateQuantity(cartId, newQuantity) {
        const cart = await Cart.findOne({"_id": cartId})
        const updateQuantity = cart.quantity + newQuantity
        const updatedCart = await Cart.updateOne({"_id": cartId}, {quantity: updateQuantity});
        return updatedCart;
    }
}
const cartModel = new CartModel();

export { cartModel };