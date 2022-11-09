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

    // 장바구니 특정상품의 수량 변경
    async updateQuantity(userId, cartId, newQuantity) {

        const cart = await Cart.findOne({"userId" :userId, "cartId": cartId})
        const updateQuantity = cart.quantity + newQuantity
        console.log("updateQuantity", updateQuantity)

        const updatedCart = await Cart.update({
            cartId, update: {
                quantity: updateQuantity
            }
        });
        return updatedCart;


        // user = await this.userModel.update({
        //     userId,
        //     update: {
        //         role: role
        //     },
        // });
    }
}
const cartModel = new CartModel();

export { cartModel };