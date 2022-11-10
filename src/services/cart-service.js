import { cartModel } from "../db";

class CartService{
    constructor(cartModel) {
        this.cartModel = cartModel;
    }

    // 장바구니 추가
    async addCart(cartData){
        const createCart = await this.cartModel.create(cartData);
        return createCart;
    }
    // 장바구니 조회
    async getCart(userId){
        const getCart = await this.cartModel.findGroupByUserId(userId);
        return getCart
    }

    // 장바구니 수량 변경
    async updateQuantity(cartId, newQuantity) {
        const result = await this.cartModel.updateCartQuantity(cartId, newQuantity);
        return result;
    }

    // 장바구니 cartId 삭제
    async deleteCart(cartId){
        const result = await this.cartModel.deleteCart(cartId);
        if (result.deletedCount !== 1) {
            const message = {
                "acknowledged": false,
                "message": "삭제에 실패했습니다. 장바구니 ID(_id)를 확인해주세요."
            }
            return message
        }
        return result
    }
    
    // 장바구니 전체 삭제
    async deleteAllCart(userId){
        const result = await this.cartModel.deleteAll(userId);
        return result
    }
}
const cartService = new CartService(cartModel);
export { cartService };