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
    const like = await this.likeModel.findByCodeAndUser(likeInfo.productCode, likeInfo.userId);
    if (like) {
      throw new Error(
        "이미 좋아요를 눌렀습니다."
      );
    }
    
    await this.likeModel.create(likeInfo); // Like db에 어떤 상품을 누가 좋아했는지 insert

    const newProduct = await this.productModel.update({
      code: product.code,
      update: {
        likeCount: product.likeCount + 1
      }
    })

    return newProduct
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

    // 좋아요 이력이 없으면
    const like = await this.likeModel.findByCodeAndUser(likeInfo.productCode, likeInfo.userId);

    if (!like || like === 'null') {
      throw new Error(
        "상품을 좋아한 적이 없습니다."
      );
    }
  
    await this.likeModel.deleteCodeAndUser(likeInfo); // Like db에 어떤 상품을 누가 좋아했던 것을 delete

    const { likeCount } = await this.productModel.update({
      code: product.code,
      update: {
        likeCount: product.likeCount - 1
      }
    })

    return likeCount
  }

  async checkLike(likeInfo) {
    const product = await this.productModel.findByCode(likeInfo.productCode);
    if (!product) {
      throw new Error(
        "이 코드는 존재하지 않는 코드입니다. 다른 코드를 입력해 주세요."
      );
    }

    const like = await this.likeModel.findByCodeAndUser(likeInfo.productCode, likeInfo.userId);

    return !!like;
  }
}

const likeService = new LikeService(likeModel, productModel);

export { likeService };