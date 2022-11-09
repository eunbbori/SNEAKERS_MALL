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

  async delete(productCode) {
    const deletedLike = await Like.deleteOne({ productCode });
    return deletedLike;
  }  

  async findByCodeAndUser(productCode,userId) {
    const product = await Like.findOne({ productCode: productCode , userId : userId});
    return product;
    }  

  async deleteCodeAndUser(likeInfo) {
    const deletedLike = await Like.deleteOne(likeInfo);
    return deletedLike;
  }  

}

const likeModel = new LikeModel();

export { likeModel };