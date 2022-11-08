import { model } from "mongoose";
import { LikeSchema } from '../schemas/like-schema';

const Like = model("likes", LikeSchema);

export class LikeModel {
  async create(likeInfo) {
    const createdNewLike = await Like.create(likeInfo);
    return createdNewLike;
    }  

  async findByProductCode(productCode) {
    const product = await Like.findOne({ productCode });
    return product;
    }  
}

const likeModel = new LikeModel();

export { likeModel };