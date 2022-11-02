import { Router } from "express";

// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { orderService } from "../services";
const orderRouter = Router();

// 사용자 주문조회 API
orderRouter.get('/', async (req, res) => {
    const order = await orderService.getOrder();
    res.status(200).json(order);
})


// 주문추가 API
orderRouter.post('/',async (req, res, next) => {
    try{
        const { userId, name, address, tel, account, orderList} = req.body
        const newOrder = await orderService.addOrder(userId, name, address, tel, account, orderList);
        return res.status(201).json(newOrder);
    }catch(err){
        next(err)
    }
});

// 관리자 주문조회 API

// 주문수정 API

// 사용자 주문취소 API

// 관리자 주문삭제 API


export { orderRouter };