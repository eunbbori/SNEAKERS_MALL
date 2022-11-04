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

// 브랜드 수정 api
brandRouter.post("/:name", loginRequired, async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const name = req.params.name; 
    const newName = req.body.newName;

    const { modifiedCount } = await brandService.updateBrand(name,newName)
    
    if( modifiedCount == 1 ){
      res.status(200).json({
        result: true
      });
    }else {
      throw new Error(
        "예상치 못한 오류 발생 관리자에게 문의해주세요"
      );
    }
  } catch (error) {
    next(error);
  }
});

// 브랜드 삭제 api
brandRouter.delete("/:name", loginRequired, async function (req, res, next) {
  try {
    const name = req.params.name; 

    const { deletedCount } = await brandService.deleteBrand(name)

    if(deletedCount === 1){
      res.status(200).json({
        result: true
      });
    }else{
      throw new Error(
        "예상치 못한 오류 발생 관리자에게 문의해주세요"
      );
    }
  } catch (error) {
    next(error);
  }
});

// 브랜드 조회 api
brandRouter.get("/", async function (req, res, next) {
  try {
    const brandList = await brandService.getBrandList();
    res.status(200).json(brandList);
  } catch (error) {
    next(error);
  }
})

export { brandRouter };
