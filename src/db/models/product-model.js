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

  async total(category) {
    const total = await Product.countDocuments({ category: category });
    return total;
  }

  async paginationProducts(page, perPage, category){
    const products = await Product.find({ category }) 
      .sort({regDate : -1})
      .skip(perPage * (page -1))
      .limit(perPage);

    return products;
  }

  async update(code, newProduct) {
    const updatedProduct = await Product.updateOne({ code }, newProduct);

    return updatedProduct;
  }

}

const productModel = new ProductModel();

export { productModel };