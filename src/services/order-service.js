import { orderModel } from "../db";

class OrderService {

    constructor(orderModel) {
        this.orderModel = orderModel;
    }

    // 주문추가: 장바구니목록 상품
    async addOrder(userId, name, address, tel, account, orderList){
        // ** 필터조건 여기서 걸기
        const orderState = '상품 준비중'
        const newOrderInfo = { userId, name, address, tel, account, orderList, orderState};
        // db에 저장
        const createdNewOrder = await this.orderModel.create(newOrderInfo);
        console.log(createdNewOrder)
        return createdNewOrder;
    }

    // 주문 조회: 사용자는 개인페이지에서 주문내역 조회가능
    async getOrderById(userId) {
        const myOrders = await this.orderModel.findByUserId(userId);
        if (!myOrders) {
            throw new Error(
                "주문 내역이 없습니다."
            );
        }
        return myOrders
    }


    // 관리자 주문 조회
    async getOrderAll() {
        const orders = await this.orderModel.findAll();
        if (!orders) {
            throw new Error(
                "주문 내역이 없습니다."
            );
        }
        return orders;
    }

    // 관리자 주문 수정: 배송상태 수정
    // 사용자 주문 수정: 배송시작 전까지는 주문정보 수정가능

    // 주문 취소: 사용자는 개인페이지에서 주문내역 취소가능
    // 주문 삭제: 관리자는 관리페이지에서 주문내역 삭제가능

}

const orderService = new OrderService(orderModel);
export { orderService };
