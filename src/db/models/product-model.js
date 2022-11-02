import { model } from "mongoose";
import { ProductSchema } from '../schemas/product-schema';

const Product = model("products", ProductSchema);

export class ProductModel {
  async findByCode(code) {
    const product = await Product.findOne({ code });
    return product;
  }

  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }
}

const productModel = new ProductModel();

export { productModel };