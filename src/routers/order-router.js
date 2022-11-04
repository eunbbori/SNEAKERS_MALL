/**
 * @function GET: /api/order/admin
 * @author 채유진
 * @description 관리자가 모든 고객의 주문목록을 조회할 수 있습니다.
 * @return {object} - code 200, orderList
 */
import { Router } from "express";
import is from "@sindresorhus/is";
import { orderService } from "../services";
const orderRouter = Router();

/**
 * @function GET: /api/order/admin
 * @author 채유진
 * @description 관리자가 모든 고객의 주문목록을 조회할 수 있습니다.
 * @return {object} - code 200, orderList
 */
orderRouter.get('/admin', async (req, res, next) => {
    try{
        const orders = await orderService.getOrderAll();
        res.status(200).json(orders);
    } catch(err){
        next(err)
    }
})

/**
 * @function GET: /api/order?id=orderId
 * @author 채유진
 * @description 주문 id로 고객의 주문목록을 조회할 수 있습니다.
 * @param orderId - orderId ** [req.query]
 * @return {object} - code 200, orderList
 */
orderRouter.get('/', async (req, res, next) => {
    try {
        const orderId = req.query.id;
        const order = await orderService.getOrderByOrderId(orderId);
        res.status(200).json(order);
    }catch(err){
        next(err)
    }
})

/**
 * @function GET: /api/order/:userId
 * @author 채유진
 * @description 사용자별 주문목록 전체를 조회할 수 있습니다.
 * @param userId - 사용자 id
 * @return {object} - code 201, orderList
 */
orderRouter.get('/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const order = await orderService.getOrderByUserId(userId);
        res.status(200).json(order);
    }catch(err){
        next(err)
    }
})

/**
 * @function POST: /api/order/:userId
 * @author 채유진
 * @description 사용자 주문을 추가할 수 있습니다.
 * @param userId - 사용자 id
 * @param name - 수령인  ** [req.body]
 * @param address - 수령 주소  ** [req.body]
 * @param tel - 수령인 연락처  ** [req.body]
 * @param account - 총액  ** [req.body]
 * @param orderList - 주문 목록  ** [req.body]
 * @return {object} - code 201, newOrder
 */
orderRouter.post('/:userId', async (req, res, next) => {
    try {
        // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
        if (is.emptyObject(req.body)) {
            throw new Error(
                "headers의 Content-Type을 application/json으로 설정해주세요"
            );
        }
        const { userId, name, address, tel, account, orderList} = req.body
        const newOrder = await orderService.addOrder(userId, name, address, tel, account, orderList);
        res.status(201).json(newOrder);
    }catch(err){
        next(err)
    }
});

// [사용자 주문수정 필요없음, 삭제만 필요함]

//
/**
 * @function DELETE: api/order/:userId?id=orderId
 * @author 채유진
 * @description 사용자가 주문을 취소할 수 있습니다.
 * @param userId - 사용자 id
 * @param orderId - 주문 id ** [req.query]
 * @return {object} - code 201
 */
orderRouter.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
    const orderId = req.query.id;
    const result = await orderService.deleteOrder(orderId);
    res.status(201).json(result);
})

/**
 * @function PUT: /api/order/admin?id=orderId
 * @author 채유진
 * @description 관리자가 주문상태를 수정할 수 있습니다.
 * @param orderId - 주문 id  **[req.body]
 * @param orderState - new주문상태  **[req.body]
 * @return {object} - code 201
 */
orderRouter.put('/admin', async (req, res, next) => {
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

/**
 * @function DELETE: api/order/admin/:userId?id=orderId
 * @author 채유진
 * @description 관리자가 주문을 삭제할 수 있습니다.
 * @param userId - 사용자 id
 * @param orderId - 주문 id **[req.query]
 * @return {object} - code 201
 */
orderRouter.delete('/admin:userId', async (req, res) => {
    const { userId } = req.params;
    const orderId = req.query.id;
    const result = await orderService.deleteOrderAdmin(orderId);
    res.status(201).json(result);
})

export { orderRouter };