import { Router } from "express";

// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { orderService } from "../services";
const orderRouter = Router();

// 사용자 주문조회 GET: /api/order/userId
orderRouter.get('/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const order = await orderService.getOrderById(userId);
        res.status(200).json(order);
    }catch(err){
        next(err)
    }
})


// 사용자 주문추가 POST: /api/order
orderRouter.post('/', async (req, res, next) => {
    try {
        const { userId, name, address, tel, account, orderList} = req.body
        const newOrder = await orderService.addOrder(userId, name, address, tel, account, orderList);
        return res.status(201).json(newOrder);
    }catch(err){
        next(err)
    }
});


// 관리자 주문조회 GET: /api/order
orderRouter.get('/', async (req, res) => {
    const orders = await orderService.getOrderAll();
    res.status(200).json(orders);
})


// 주문수정 API

// 사용자 주문취소 API

// 관리자 주문삭제 API


export { orderRouter };