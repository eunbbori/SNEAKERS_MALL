import { likeModel, productModel } from "../db";

class LikeService {
  constructor(likeModel, productModel) {
    this.likeModel = likeModel
    this.productModel = productModel;
  }

  //좋아요 등록 
  async addLike(likeInfo) {
    // 입력되어있는 코드가 있는지 확인 
    const product = await this.productModel.findByCode(likeInfo.productCode);
    if (!product) {
      throw new Error(
        "이 코드는 존재하지 않는 코드입니다. 다른 코드를 입력해 주세요."
      );
    }

    // 이미 좋아요를 누른 적이 있다면
    const like = await this.likeModel.findByProductCode(likeInfo.productCode);
    if (like) {
      throw new Error(
        "이미 좋아요를 눌렀습니다."
      );
    }
  
    const newLike = await this.likeModel.create(likeInfo);
    return newLike
  }
  //좋아요 취소 
  async deleteLike(likeInfo) {
    // 입력되어있는 코드가 있는지 확인 
    const product = await this.productModel.findByCode(likeInfo.productCode);
    if (!product) {
      throw new Error(
        "이 코드는 존재하지 않는 코드입니다. 다른 코드를 입력해 주세요."
      );
    }

    // 이미 좋아요를 취소했다면 
    const like = await this.likeModel.findByCodeAndUser(likeInfo.productCode,likeInfo.userId);
    if (!like) {
      throw new Error(
        "이미 좋아요를 취소했습니다."
      );
    }
  
    const newLike = await this.likeModel.deleteCodeAndUser(likeInfo);
    return newLike
  }

}


const likeService = new LikeService(likeModel, productModel);

export { likeService };