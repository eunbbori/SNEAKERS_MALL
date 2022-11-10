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

const categoryArray = ["MEN", "WOMEN", "KIDS"];
const selectedFilter = {
  category: "",
  brand: "",
  sort: "",
};
const filterArray = [
  {
    selectedId: "regDate",
    able1: "highPrice",
    able2: "lowPrice",
    able3: "highLike",
    able4: "lowLike",
  },
  {
    selectedId: "highPrice",
    able1: "regDate",
    able2: "lowPrice",
    able3: "highLike",
    able4: "lowLike",
  },
  {
    selectedId: "lowPrice",
    able1: "highPrice",
    able2: "regDate",
    able3: "highLike",
    able4: "lowLike",
  },
  {
    selectedId: "highLike",
    able1: "highPrice",
    able2: "regDate",
    able3: "lowPrice",
    able4: "lowLike",
  },
  {
    selectedId: "lowLike",
    able1: "highPrice",
    able2: "regDate",
    able3: "highLike",
    able4: "lowPrice",
  },
];

async function init() {
  const { totalPage, currentPage, items } = await fetchProductList({ page: 1 });
  const brand = await getbrandData();

  setBrandList(brand);
  makeProductList(items);
  renderPagination({ currentPage, totalPage, sort: "regDate" });
  selectElementId("regDate").classList.add("is-active");
  categoryArray.forEach((categoryId) => createCategoryEvent(categoryId));
  filterArray.forEach((filterObject) => createFilterEvent(filterObject));
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
                <p class="subtitle is-5 price">${useful.addCommas(price)} 원</p>
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
    selectElement("#navbar-dropdown").appendChild(aTag);
  });
}

/**
 * @description
 * 브랜드 클릭하면 브랜드로 필터링된 아이템 요청
 */
async function brandFilter() {
  const brandName = this.firstChild.id;
  selectedFilter.brand = brandName;
  const { items, currentPage, totalPage } = await fetchProductList({
    page: 1,
    brand: brandName,
    sort: selectedFilter.sort,
    category: selectedFilter.category,
  });
  makeProductList(items);
  renderPagination({
    currentPage,
    totalPage,
    brand: brandName,
    category: selectedFilter.category,
    sort: selectedFilter.sort,
  });
  selectElementId("filter-brand").classList.remove("hidden");
  selectElementId(
    "filter-brand-span"
  ).innerHTML = `${brandName}<button class="delete is-small" id="delete-filter-brand"></button>`;
  deleteFilterBtnEvent();
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

function createCategoryEvent(elementId) {
  selectElement(`#${elementId}`).addEventListener("click", async () => {
    selectedFilter.category = elementId;
    const { items, currentPage, totalPage } = await fetchProductList({
      page: 1,
      category: elementId,
      brand: selectedFilter.brand,
      sort: selectedFilter.sort,
    });
    renderPagination({
      currentPage,
      totalPage,
      category: elementId,
      brand: selectedFilter.brand,
      sort: selectedFilter.sort,
    });
    makeProductList(items);
    selectElementId("filter-category").classList.remove("hidden");
    selectElementId("filter-category-span").innerHTML = `${elementId}<button
    class="delete is-small"
    id="delete-filter-category"
  ></button>`;
    deleteFilterBtnEvent();
  });
}

function createFilterEvent({ selectedId, able1, able2, able3, able4 }) {
  selectElementId(selectedId).addEventListener("click", async () => {
    const { items, currentPage, totalPage } = await fetchProductList({
      page: 1,
      sort: selectedId,
      category: selectedFilter.category,
      brand: selectedFilter.brand,
    });
    selectElementId(selectedId).classList.add("is-active");
    selectElementId(able1).classList.remove("is-active");
    selectElementId(able2).classList.remove("is-active");
    selectElementId(able3).classList.remove("is-active");
    selectElementId(able4).classList.remove("is-active");

    renderPagination({
      currentPage,
      totalPage,
      sort: selectedId,
      brand: selectedFilter.brand,
      category: selectedFilter.category,
    });
    makeProductList(items);
    selectedFilter.sort = selectedId;
  });
}
function deleteFilterBtnEvent() {
  selectElementId("delete-filter-brand").addEventListener("click", async () => {
    selectElementId("filter-brand").classList.add("hidden");
    selectedFilter.brand = "";
    const { items, currentPage, totalPage } = await fetchProductList({
      page: 1,
      category: selectedFilter.category,
      brand: selectedFilter.brand,
      sort: selectedFilter.sort,
    });
    makeProductList(items);
    renderPagination({
      currentPage,
      totalPage,
      category: selectedFilter.category,
      sort: selectedFilter.sort,
      brand: selectedFilter.brand,
    });
  });
  selectElementId("delete-filter-category").addEventListener(
    "click",
    async () => {
      selectElementId("filter-category").classList.add("hidden");
      selectedFilter.category = "";
      const { items, currentPage, totalPage } = await fetchProductList({
        page: 1,
        category: selectedFilter.category,
        brand: selectedFilter.brand,
        sort: selectedFilter.sort,
      });
      makeProductList(items);
      renderPagination({
        currentPage,
        totalPage,
        category: selectedFilter.category,
        sort: selectedFilter.sort,
        brand: selectedFilter.brand,
      });
    }
  );
}
selectElementId("brand").addEventListener("click", () =>
  selectElementId("navbar-dropdown").classList.toggle("show-block")
);
init();
