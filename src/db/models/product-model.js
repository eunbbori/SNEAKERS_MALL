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

  async total({ category, brand, name }) {
    const filterObject = {};
    if(category) filterObject.category = category;
    if(brand) filterObject.brand = brand;
    if(name) filterObject.name = new RegExp(name);
    
    return await Product.countDocuments(filterObject);
  }

  async paginationProducts({ page, perPage, category, brand, name }){
    const filterObject = {};
    if(category) filterObject.category = category;
    if(brand) filterObject.brand = brand;
    if(name) filterObject.name = new RegExp(name); 

    const products = await Product.find(filterObject)
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