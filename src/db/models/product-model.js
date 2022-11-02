import { model } from "mongoose";
import { ProductSchema } from '../schemas/product-schema';

const Products = model("goods", ProductSchema);

export {Products};