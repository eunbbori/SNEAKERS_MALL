import { Router } from "express";
import is from "@sindresorhus/is";
import { loginRequired } from "../middlewares";
import { brandService } from "../services";

const brandRouter = Router();

// 브랜드 추가 api
brandRouter.post("/", loginRequired, async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const {
      name,
    } = req.body;
    const newBrand = await brandService.addBrand({
      name,
    });

    res.status(200).json(newBrand);
  } catch (error) {
    next(error);
  }
});



export { brandRouter };
