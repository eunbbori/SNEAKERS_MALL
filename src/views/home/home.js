// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.
import { fetchProductList } from "./api/index.js";
import { renderPagination } from "./pagination.js";

// import * as Api from "/api.js";
/**
 * @description 초기 실행 함수
 * 1. 상품리스트 조회 api 호출
 * 2. 브랜드 리스트 조회 api 호출
 * 3. 브랜드 목록 렌더링 함수 호출
 * 4. 상품목록 렌더링 함수 호출
 * 5. 페이지네이션 렌더링 함수 호출
 *
 */
import * as useful from "../useful-functions.js";

const categortArray = ["MEN", "WOMEN", "KIDS"];
const selectedFilter = {
  category: "",
  brand: "",
  sort: "",
};

async function init() {
  const { totalPage, currentPage, items } = await fetchProductList({ page: 1 });
  const brand = await getbrandData();

  setBrandList(brand);
  makeProductList(items);
  renderPagination({ currentPage, totalPage, sort: "regDate" });
  selectElementId("nav-regDate").classList.add("is-active");
  categortArray.forEach((categoryId) => createEvent(categoryId));
  // -------------------------------------더미데이터 db생성 코드

  // document.querySelector("#push100Data").addEventListener("click", async () => {
  //   const dummyData = new Array(50).fill({
  //     code: "",
  //     name: "테스트 아이템",
  //     content: "테스트 아이템설명 입니다.",
  //     price: 200000,
  //     size: 260,
  //     imageUrl:
  //       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0_bWv7MYTnQ2_xsQ-TQdUQsVpJlqrOFXa7OvrBN7HDcaDOOaNcGAg8xYRpvCAjD7391k&usqp=CAU",
  //     brand: "NIKE",
  //     stock: 23,
  //     category: "MEN",
  //   });

  //   dummyData.forEach(async (item, idx) => {
  //     item.code = `TEST-PRODUCT-${idx}`;
  //     item.name = `테스트 아이템-${idx}`;
  //     const bodyData = JSON.stringify(item);

  //     await fetch("/api/product", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization:
  //           "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
  //       },
  //       body: bodyData,
  //     });
  //   });
  // });
  //-----------------------------------------------------------------------------------
}

/**
 * @description 홈페이지 brand목록 데 이터 가져오기
 * @returns [{}, {}, ...]
 */
function getbrandData() {
  const res = fetch("/api/brand")
    .then((res) => res.json())
    .then((item) => item);
  return res;
}

export function makeProductList(items) {
  selectElement(".productList").innerHTML = "";
  items.forEach((item) => {
    renderProductCard(item);
  });
}
/**
 * @description
 * 각 data마다 html을 생성하여 data를 삽입
 * @param {*} item
 */
function renderProductCard(item) {
  const { brand: brandName, name, price, code, imageUrl } = item;
  selectElement(".productList").insertAdjacentHTML(
    "beforeend",
    `<li class="product" id="${code}Li">
        <a href="/product/${code}">
        <div class="card">
          <div class="card-image">
            <figure class="image is-1by1">
              <img class="product-image"
                src="${imageUrl}"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-6">${name}</p>
                <p class="subtitle is-6">${brandName}</p>
                <p class="subtitle is-6">${useful.addCommas(price)} 원</p>
              </div>
            </div>
          </div>
        </a>
        </li>`
  );
}

/**
 * @description
 * brand 내비게이션에 마우스 올리면 확장되는 리스트 생성
 * @param {*} brand
 */
function setBrandList(brand) {
  brand.forEach((brand) => {
    const brandName = brand.name;
    const aTag = document.createElement("a");
    aTag.classList.add("navbar-item");
    aTag.addEventListener("click", brandFilter);
    aTag.insertAdjacentHTML(
      "beforeend",
      `<span id="${brandName}">${brandName}</span>`
    );
    selectElement(".navbar-dropdown").appendChild(aTag);
  });
}

/**
 * @description
 * 브랜드 클릭하면 브랜드로 필터링된 아이템 요청
 */
async function brandFilter() {
  const brandName = this.firstChild.id;
  const { items, currentPage, totalPage } = await fetchProductList({
    page: 1,
    brand: brandName,
  });
  makeProductList(items);
  renderPagination({ currentPage, totalPage, brand: brandName });
}

async function sortFilter() {
  const { items, currentPage, totalPage } = await fetchProductList({});
}

/**
 * @description
 * selector에 선택자를 포함한 str을 넣어줘서 html요소를 반환한다.
 * @param {*} selector
 * @returns
 * 선택자에 맞는 DOM Element
 */
function selectElement(selector) {
  return document.querySelector(selector);
}
/**
 *
 * @param {*} id
 * @returns 해당하는 id를 가진 DOM Element
 */
export function selectElementId(id) {
  return document.getElementById(id);
}

// selectElement("#brand").addEventListener("mouseenter", () => {
//   selectElement(".categoryList").classList.remove("hidden");
// });
// selectElement("#brand").addEventListener("mouseleave", () => {
//   selectElement(".categoryList").classList.add("hidden");
// });

// selectElement(".categoryList").addEventListener("mouseenter", () => {
//   selectElement(".categoryList").classList.remove("hidden");
// });
// selectElement(".categoryList").addEventListener("mouseleave", () => {
//   selectElement(".categoryList").classList.add("hidden");
// });

function createEvent(elementId) {
  selectElement(`#${elementId}`).addEventListener("click", async () => {
    const { items, currentPage, totalPage } = await fetchProductList({
      page: 1,
      category: `${elementId}`,
    });
    renderPagination({ currentPage, totalPage, category: `${elementId}` });
    makeProductList(items);
  });
}

selectElementId("nav-regDate").addEventListener("click", async () => {
  const { items, currentPage, totalPage } = await fetchProductList({
    page: 1,
  });
  selectElementId("nav-regDate").classList.add("is-active");
  selectElementId("nav-highPrice").classList.remove("is-active");
  selectElementId("nav-lowPrice").classList.remove("is-active");

  renderPagination({ currentPage, totalPage, sort: "regDate" });
  makeProductList(items);
});
selectElementId("nav-highPrice").addEventListener("click", async () => {
  const { items, currentPage, totalPage } = await fetchProductList({
    page: 1,
    sort: "highPrice",
  });
  selectElementId("nav-highPrice").classList.add("is-active");
  selectElementId("nav-regDate").classList.remove("is-active");
  selectElementId("nav-lowPrice").classList.remove("is-active");
  renderPagination({ currentPage, totalPage, sort: "highPrice" });
  makeProductList(items);
});
selectElementId("nav-lowPrice").addEventListener("click", async () => {
  const { items, currentPage, totalPage } = await fetchProductList({
    page: 1,
    sort: "lowPrice",
  });
  selectElementId("nav-lowPrice").classList.add("is-active");
  selectElementId("nav-highPrice").classList.remove("is-active");
  selectElementId("nav-regDate").classList.remove("is-active");
  renderPagination({ currentPage, totalPage, sort: "lowPrice" });
  makeProductList(items);
});

init();
