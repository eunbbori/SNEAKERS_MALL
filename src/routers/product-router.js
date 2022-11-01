import { Router } from "express";
import is from "@sindresorhus/is";
import { loginRequired } from "../middlewares";

const productRouter = Router();

// 상품 저장 api
productRouter.post('/', loginRequired, async function (req, res, next) {
    try {
      // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
      if (is.emptyObject(req.body)) {
        throw new Error(
         "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
);

export { productRouter };
