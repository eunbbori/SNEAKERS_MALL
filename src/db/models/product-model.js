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

  async total({ category, brand }) {
    const filterObject = {};
    if(category) filterObject.category = category;
    if(brand) filterObject.brand = brand;
    
    return await Product.countDocuments(filterObject);
  }

  async paginationProducts({ page, perPage, category, brand }){
    const filterObject = {};
    if(category) filterObject.category = category;
    if(brand) filterObject.brand = brand;

    const products = await Product.find(filterObject)
      .sort({regDate : -1})
      .skip(perPage * (page -1))
      .limit(perPage);

    return products;
  }

  async update(code, newProduct) {
    const updatedProduct = await Product.updateOne({ code }, newProduct);

    return updatedProduct;
  }

  async delete(code) {
    const deletedBrand = await Product.deleteOne({ code });
    return deletedBrand;
  }
}

const productModel = new ProductModel();

export { productModel };