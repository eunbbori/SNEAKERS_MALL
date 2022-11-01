import { model } from "mongoose";
import {GoodsSchema} from '../schemas/goods-schema';
const Goods = model("goods", GoodsSchema);

export {Goods};