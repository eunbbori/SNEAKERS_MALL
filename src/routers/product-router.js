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
    const category = req.query.category;

    const { total, products } = await productService.getProductList(
      page,
      perPage,
      category
    );
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
productRouter.get('/:code', async function (req, res, next) {
  try {
    const { code } = req.params;

    const productInfo = await productService.getProductDetail(code);
    
    res.status(200).json(productInfo);
  } catch (error) {
    next(error);
  }
});

export { productRouter };
