import { brandModel } from "../db";

class BrandService {
  constructor(brandModel){
    this.brandModel = brandModel 
  }

  //브랜드 등록 
  async addBrand(brandInfo) {
    const { name } = brandInfo
    
    // 입력되어있는 이름이 있는지 확인
    const brand = await this.brandModel.findByName(name);

    if (brand) {
      throw new Error(
        "이 이름은 현재 사용중입니다. 다른 이름을 입력해 주세요."
      );
    }

    const newBrand = await this.brandModel.create(brandInfo);
    return newBrand
  }

}

const brandService = new BrandService(brandModel);

export { brandService };
