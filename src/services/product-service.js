import { productModel } from "../db";

class ProductService {
  constructor(productModel){
    this.productModel = productModel 
  }

  //상품 등록 
  async addProduct(productInfo) {
    const { code } = productInfo
    
    // 입력되어있는 코드가 있는지 확인
    const product = await this.productModel.findByCode(code);

    if (product) {
      throw new Error(
        "이 코드는 현재 사용중입니다. 다른 코드를 입력해 주세요."
      );
    }

    const newProduct = await this.productModel.create(productInfo);
    return newProduct
  }

  //상품 조회
  async getProductList(page, perPage, category) {
    const total = await this.productModel.total(category);
    const paginationProducts = await this.productModel.paginationProducts(page, perPage, category);

    return {
      total: total,
      products: paginationProducts
    };
  }

   //상품 상세 조회
   async getProductDetail(code) {
    const product = await this.productModel.findByCode(code);
    return product;
  }
}

const productService = new ProductService(productModel);

export { productService };
