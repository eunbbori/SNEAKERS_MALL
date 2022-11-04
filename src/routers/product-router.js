import { Router } from "express";
import is from "@sindresorhus/is";
import { loginRequired } from "../middlewares";
import { productService } from "../services";

const productRouter = Router();

// 상품 저장 api
productRouter.post("/", loginRequired, async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const {
      code,
      brand,
      name,
      imageUrl,
      content,
      category,
      size,
      price,
      stock,
    } = req.body;

    const newProduct = await productService.addProduct({
      brand,
      name,
      imageUrl,
      content,
      category,
      size,
      price,
      stock,
    });

    res.status(200).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// 상품 리스트 조회 api
productRouter.get("/", async function (req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const perPage = 20;
    const { category, brand, name } = req.query;

    const { total, products } = await productService.getProductList({
      page,
      perPage,
      category,
      brand,
      name
    });
    const totalPage = Math.ceil(total / perPage);

    res.status(200).json({
      totalPage: totalPage,
      currentPage: page,
      totalCount: total,
      items: products,
    });
  } catch (error) {
    next(error);
  }
});

// 상품 상세 조회 api
productRouter.get("/:code", async function (req, res, next) {
  try {
    const { code } = req.params;

    const productInfo = await productService.getProductDetail(code);

    res.status(200).json(productInfo);
  } catch (error) {
    next(error);
  }
});

// 상품 수정 api
productRouter.put("/:code", loginRequired, async function (req, res, next) {
  try {
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    const { code }  = req.params; 
    const {  
      brand,
      name,
      imageUrl,
      content,
      category,
      size,
      price,
      stock } = req.body;

    const product = await productService.updateProduct(
      code,
      {
      brand,
      name,
      imageUrl,
      content,
      category,
      size,
      price,
      stock
     }
    );

    if(product) {
      res.status(200).json(product);
    }else {
      throw new Error(
        "해당 코드에 대한 Product가 존재하지 않습니다."
      );
    }
  } catch (error) {
    next(error);
  }
});

// 상품 삭제 api
productRouter.delete("/:code", loginRequired, async function (req, res, next) {
  try {
    const code = req.params.code; 

    const { deletedCount } = await productService.deleteProduct(code)

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

export { productRouter };
