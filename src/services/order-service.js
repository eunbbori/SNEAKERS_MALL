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
    async getOrderByUserId(userId) {
        const myOrders = await this.orderModel.findByUserId(userId);
        if (!myOrders) {
            throw new Error(
                "주문 내역이 없습니다."
            );
        }
        return myOrders
    }
    async getOrderByOrderId(orderId) {
        const myOrder = await this.orderModel.findByOrderId(orderId);
        if (!myOrder) {
            throw new Error(
                "주문 내역이 없습니다."
            );
        }
        return myOrder
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

    // 관리자 주문상태 수정
    async updateOrderState(orderId, newState) {
        const result = await orderModel.updateState(orderId, newState);
        return result;
    }

    // 사용자 주문 취소: 사용자는 개인페이지에서 주문내역 취소가능
    async deleteOrder(orderId) {

        // 사용자의 경우, orderId 기준으로 현재 배송상태 조회
        const exist = await orderModel.existOrder(orderId)
        if(exist === 0) {
            throw new Error(
                "orderId에 해당하는 주문정보가 없습니다."
            );
        }
        const { orderState } = await orderModel.findByOrderId(orderId);

        if(!orderState) {
            throw new Error(
                "orderId에 해당하는 주문정보가 없습니다."
            );
        }
        if (orderState !== '상품 준비중') {
            throw new Error(
                "상품 준비가 완료되어, 주문을 취소할 수 없습니다."
            );
        }
        const result = await orderModel.deleteOrder(orderId);
        return result
    }

    // 관리자 주문 삭제: 관리자는 관리페이지에서 주문내역 삭제가능
    async deleteOrderAdmin(orderId) {
        const result = await orderModel.deleteOrder(orderId);
        if (result !== true) {
            throw new Error(
                "삭제에 실패했습니다. 주문ID를 확인해주세요."
            );
        }
        return result
    }
}

const orderService = new OrderService(orderModel);
export { orderService };
