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

  async total(filter) {
    return await Product.countDocuments(filter);
  }

  async paginationProducts({ page, perPage, ...filter }){
    const products = await Product.find(filter)
      .sort({regDate : -1})
      .skip(perPage * (page -1))
      .limit(perPage);

    return products;
  }

  async update({ code, update }) {
    const filter = { code : code };
    const option = { returnOriginal: false };
    const updatedProduct = await Product.findOneAndUpdate(filter, update, option);

    return updatedProduct;
  }

  async delete(code) {
    const deletedBrand = await Product.deleteOne({ code });
    return deletedBrand;
  }
}

const productModel = new ProductModel();

export { productModel };