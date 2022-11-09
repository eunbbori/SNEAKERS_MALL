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

    // 장바구니 동기화하기
    async syncData(userId, indexedDB) {
        // db에서 데이터 가져와 상품코드만 배열로 만든다.
        const dbCart = await this.cartModel.findGroupByUserId(userId);
        const dbCodes = dbCart.map(row => row.code);
        console.log('dbCodes', dbCodes)

        // map 돌려서 db의 code랑 indexedDB의 code가 동일한게 있는지 확인
        for (const row of indexedDB) {
            // console.log('row.code', row.code)
            // console.log('row.quantity', row.quantity)
            // console.log(dbCodes.includes(row.code))

            // 있다면
            if (dbCodes.includes(row.code)){
                // indexedDB의 quantity 값 가져와서
                // db에 해당 상품의 수량에 덧셈
                const result = await this.cartModel.updateQuantity(userId, row.code, row.quantity)
                console.log(result);
            }
            // 없다면
            // pass
        }
    }
}
const cartService = new CartService(cartModel);
export { cartService };