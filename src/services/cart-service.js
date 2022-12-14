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
}
const cartService = new CartService(cartModel);
export { cartService };