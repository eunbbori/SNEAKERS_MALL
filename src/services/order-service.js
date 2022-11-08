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
        return myOrders
    }

    // 주문 조회: orderId로 주문내역 조회가능
    async getOrderByOrderId(orderId) {
        const myOrder = await this.orderModel.findByOrderId(orderId);
        if (!myOrder) {
            const message = {
                "acknowledged": false,
                "message": "주문내역이 없습니다."
            }
            return message
        }
        return myOrder
    }

    // 배송상태 조회: orderId로 배송상태 조회가능
    async getOrderStates() {
        const states = await this.orderModel.findGroupByState();
        return states
    }

    // 관리자 주문 조회
    async getOrderAll() {
        const orders = await this.orderModel.findAll();
        return orders;
    }

    // 관리자 주문상태 수정
    async updateOrderState(orderId, newState) {
        const result = await orderModel.updateState(orderId, newState);
        return result;
    }

    // 사용자 주문 취소: 사용자는 개인페이지에서 주문내역 취소가능
    async deleteOrder(orderId) {
        try {
            const { orderState } = await orderModel.findByOrderId(orderId);
            if (orderState !== '상품 준비중') {
                const message = {
                    "acknowledged": false,
                    "message": "상품 준비가 완료되어, 주문을 취소할 수 없습니다."
                }
                return message
            }
            const result = await orderModel.deleteOrder(orderId);
            return result
        } catch(err) {
            return err
        }
    }

    // 관리자 주문 삭제: 관리자는 관리페이지에서 주문내역 삭제가능
    async deleteOrderAdmin(orderId) {
        const result = await orderModel.deleteOrder(orderId);
        if (result.deletedCount !== 1) {
            const message = {
                "acknowledged": false,
                "message": "삭제에 실패했습니다. 주문 ID를 확인해주세요."
            }
            return message
        }
        return result
    }
}

const orderService = new OrderService(orderModel);
export { orderService };
