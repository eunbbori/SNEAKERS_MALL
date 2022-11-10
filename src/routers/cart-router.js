import { Router } from "express";
import { cartService } from "../services";
import { isMember } from "../middlewares";
import is from "@sindresorhus/is";
const cartRouter = Router();

// 장바구니 추가
// POST: /api/cart (body에 데이터)
cartRouter.post('/', isMember, async (req, res, next) =>{
    try{
        // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
        if (is.emptyObject(req.body)) {
            throw new Error(
                "headers의 Content-Type을 application/json으로 설정해주세요"
            );
        }
        const userId = req.currentUserId;
        if (userId) {
            const cartData = req.body;
            cartData.userId = req.currentUserId;
            const cart = await cartService.addCart(cartData);
            res.status(200).json(cart);
        }
        else {
            res.status(200).json({message: 'not member'});
        }
    }catch(err){
        next(err);
    }
});

// 장바구니 조회
// GET: /api/cart
cartRouter.get('/', isMember, async (req, res, next) =>{
    try{
        const userId = req.currentUserId;
        // 회원인 경우에만 장바구니를 db에 저장
        if (userId) {
            const cart = await cartService.getCart(userId);
            res.status(200).json(cart);
        }
        else {
            res.status(200).json({message: 'not member'});
        }
    }catch(err){
        next(err);
    }
});

// 장바구니 삭제
// DELETE: /api/cart/delete?id=_id값
// body 안에 _id 포함
cartRouter.delete('/delete', isMember, async (req, res, next) =>{
    try {
        const userId = req.currentUserId;
        const cartId = req.query.id;
        // 회원인 경우에만 장바구니를 db에서 삭제
        if (userId) {
            const result = await cartService.deleteCart(cartId);
            res.status(201).json(result);
        }
        else {
            res.status(200).json({message: 'not member'});
        }
    }catch(err) {
        next(err);
    }
})

// 장바구니 전체삭제
// DELETE: /api/cart/delete-all
cartRouter.delete('/delete-all', isMember, async (req, res, next) =>{
    try {
        const userId = req.currentUserId;
        // 회원인 경우에만 장바구니를 db에서 삭제
        if (userId) {
            const result = await cartService.deleteAllCart(userId);
            res.status(201).json(result);
        }
        else {
            res.status(200).json({message: 'not member'});
        }
    }catch(err) {
        next(err);
    }
})
export { cartRouter };