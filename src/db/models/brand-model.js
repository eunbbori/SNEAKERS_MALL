import { model } from "mongoose";
import { BrandSchema } from '../schemas/brand-schema';

const Brand = model("brands", BrandSchema);

export class BrandModel {
  
}

const brandModel = new BrandModel();

export { brandModel };