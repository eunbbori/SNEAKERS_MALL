/**
 * @description 상품 리스트 데이터를 호출하는 함수
 * @param {*} page
 * @returns
 * {
 *  items: [{}], - 상품 정보 리스트
 *  totalPage: number - 총 페이지 개수
 *  currentPage: number - 현재 페이지
 *  totalCount: number  - 총 상품 개수
 * }
 */
export const fetchProductList = ({
  page,
  brand = "",
  category = "",
  sort = "",
}) => {
  const res = fetch(
    `/api/product?page=${page}&brand=${brand}&category=${category}&sort=${sort}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("서버에러");
      }
      return res.json();
    })
    .then((item) => item)
    .catch((err) => {
      console.error(err);
    });
  return res;
};
