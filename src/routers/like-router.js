import { Router } from "express";
import is from "@sindresorhus/is";
import { loginRequired } from "../middlewares";
import { likeService } from "../services";

const likeRouter = Router();

// 좋아요 저장 api
likeRouter.post("/", loginRequired, async function (req, res, next) {
    try {
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }
      // req (request)의 body 에서 데이터 가져오기
      const { productCode } = req.body;
      const userId = req.currentUserId;

      const newLike = await likeService.addLike({ productCode, userId });
  
      res.status(200).json(newLike);
    } catch (error) {
      next(error);
    }
  });

// 좋아요 취소 api
likeRouter.delete("/", loginRequired, async function (req, res, next) {
  try {
    const { productCode } = req.body;
    const userId = req.currentUserId;

    const likeCount = await likeService.deleteLike({ productCode, userId });
    if (likeCount || likeCount == 0) {
      res.status(200).json({
        result: true,
      });
    } else {
      throw new Error("예상치 못한 오류 발생 관리자에게 문의해주세요");
    }
  } catch (error) {
    next(error);
  }
});  


export { likeRouter };