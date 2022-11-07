import { Router } from "express";
import is from "@sindresorhus/is";
import { orderService } from "../services";
import { loginRequired } from "../middlewares";
const orderRouter = Router();


// GET: /api/order/user
// 사용자별 주문목록 전체를 조회할 수 있습니다.
orderRouter.get('/user', loginRequired, async (req, res, next) => {
    try {
        const userId = req.currentUserId;
        const order = await orderService.getOrderByUserId(userId);
        res.status(200).json(order);
    }catch(err){
        next(err)
    }
})

// GET: /api/order/user?id=orderId
// 주문 id로 고객의 주문목록을 조회할 수 있습니다.
orderRouter.get('/user', loginRequired, async (req, res, next) => {
    try {
        const orderId = req.query.id;
        const order = await orderService.getOrderByOrderId(orderId);
        res.status(200).json(order);
    }catch(err){
        next(err)
    }
})

// POST: /api/order/user
// 사용자 주문을 추가할 수 있습니다.
orderRouter.post('/user', loginRequired, async (req, res, next) => {
    try {
        // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
        if (is.emptyObject(req.body)) {
            throw new Error(
                "headers의 Content-Type을 application/json으로 설정해주세요"
            );
        }
        const userId = req.currentUserId;
        const { name, address, tel, account, orderList} = req.body;
        const newOrder = await orderService.addOrder(userId, name, address, tel, account, orderList);
        res.status(201).json(newOrder);
    }catch(err){
        next(err)
    }
});

// [사용자 주문수정 필요없음, 삭제만 필요함]

// DELETE: api/order?id=orderId
// 사용자가 주문을 취소할 수 있습니다.
orderRouter.delete('/user', loginRequired, async (req, res) => {
    const orderId = req.query.id;
    const result = await orderService.deleteOrder(orderId);
    res.status(201).json(result);
})



//========================================================

// 나중에, 관리자 기능에 checkRole 미들웨어 추가하면 됨.


// GET: /api/order/admin
// 관리자가 모든 고객의 주문목록을 조회할 수 있습니다.
orderRouter.get('/admin', loginRequired, async (req, res, next) => {
    try{
        const orders = await orderService.getOrderAll();
        res.status(200).json(orders);
    } catch(err){
        next(err)
    }
})

// PUT: /api/order/admin?id=orderId
// 관리자가 주문상태를 수정할 수 있습니다.
orderRouter.put('/admin', loginRequired, async (req, res, next) => {
    try{
        // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
        if (is.emptyObject(req.body)) {
            throw new Error(
                "headers의 Content-Type을 application/json으로 설정해주세요"
            );
        }
        const orderId = req.query.id;
        const { orderState } = req.body;
        const result = await orderService.updateOrderState(orderId, orderState);
        res.status(201).json(result);
    }catch(err){
        next(err);
    }
})

// DELETE: api/order/admin?id=orderId
// 관리자가 주문을 삭제할 수 있습니다.
orderRouter.delete('/admin', loginRequired, async (req, res) => {
    const orderId = req.query.id;
    const result = await orderService.deleteOrderAdmin(orderId);
    res.status(201).json(result);
})

export { orderRouter };