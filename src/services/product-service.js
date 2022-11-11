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

    while(true) {
      const code = customAlphabet(`${alphabets}1234567890`, 9);
      
      const product = await this.productModel.findByCode(code());

      // 존재하지 않을 경우.
      if(!product) {
        productInfo.code = code();
        break;
      }
      else {
        code = customAlphabet(`${alphabets}1234567890`, 9);
      }
    }

    const newProduct = await this.productModel.create(productInfo);
    return newProduct
  }

  //상품 조회
  async getProductList(params) {
    const total = await this.productModel.total(params);
    const paginationProducts = await this.productModel.paginationProducts(params);

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
    const newProduct = await this.productModel.update({
      code,
      update: updatedProduct
    });
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
