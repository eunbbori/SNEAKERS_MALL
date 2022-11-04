import { productModel } from "../db";
import { commonFunction } from '../common/functions';
import { customAlphabet } from 'nanoid';

const alphabets = commonFunction.alphabets();

class ProductService {
  constructor(productModel){
    this.productModel = productModel 
  }

  //상품 등록 
  async addProduct(productInfo) {
    let code = '';

    while(true) {
      code = customAlphabet(`${alphabets}1234567890`, 9);
      
      const product = await productService.getProductDetail(code());

      // 존재하지 않을 경우.
      if(!product) break;
      else code = customAlphabet(`${alphabets}1234567890`, 9);
    }
    
    // 입력되어있는 코드가 있는지 확인 
    // code는 customAlphabet인데, 이것은 익명함수이기 때문에 code()로 작성해주어야한다.
    const product = await this.productModel.findByCode(code());

    if (product) {
      throw new Error(
        "이 코드는 현재 사용중입니다. 다른 코드를 입력해 주세요."
      );
    }

    productInfo.code = code();

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

   //상품 수정 
   async updateProduct(code, updatedProduct) {
    const product = await this.productModel.findByCode(code); 
    if (!product) {
      throw new Error(
        "코드에 대한 Product를 찾을 수 없습니다."
      );
    }
    const newProduct = await this.productModel.update(code, updatedProduct);
    return newProduct
  }

  //상품 삭제 
  async deleteProduct(code) {
    const deletedProduct = await this.productModel.delete(code);
    return deletedProduct
  }
}

const productService = new ProductService(productModel);

export { productService };
