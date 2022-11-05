// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

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
async function init() {
  const { totalPage, currentPage, items } = await fetchProductList("1");
  const brand = await getbrandData();
  setBrandList(brand);
  makeProductList(items);
  //-------------------------------------더미데이터 db생성 코드

  //   document.querySelector("#push100Data").addEventListener("click", async () => {
  //     const dummyData = new Array(50).fill({
  //       code: "",
  //       name: "테스트 아이템",
  //       content: "테스트 아이템설명 입니다.",
  //       price: 200000,
  //       size: 260,
  //       imageUrl:
  //         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0_bWv7MYTnQ2_xsQ-TQdUQsVpJlqrOFXa7OvrBN7HDcaDOOaNcGAg8xYRpvCAjD7391k&usqp=CAU",
  //       brand: "NIKE",
  //       stock: 23,
  //       category: "MEN",
  //     });

  //     dummyData.forEach(async (item, idx) => {
  //       item.code = `TEST-PRODUCT-${idx}`;
  //       item.name = `테스트 아이템-${idx}`;
  //       const bodyData = JSON.stringify(item);

  //       await fetch("/api/product", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization:
  //             "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
  //         },
  //         body: bodyData,
  //       });
  //     });
  //   });
  //-----------------------------------------------------------------------------------

  renderPagination({ currentPage, totalPage });
}

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
function fetchProductList(page) {
  //홈페이지 api요청
  const res = fetch(`/api/product?page=${page}`)
    .then((res) => res.json())
    .then((item) => item);
  return res;
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

/**
 * @description category get요청
 * @param {*} category
 * @returns
 */
function getServerDataCategory(category) {
  const res = fetch(`/api/product?page=1&category=${category}`)
    .then((res) => res.json())
    .then((item) => item);
  return res;
}

/**
 *
 * @param {*} brand
 * @returns
 */
function getServerDataBrand(brand) {
  //category get요청
  const res = fetch(`/api/product?page=1&brand=${brand}`)
    .then((res) => res.json())
    .then((item) => item);
  return res;
}

function renderPagination({ currentPage, totalPage }) {
  selectElementId("js-pagination").innerHTML = "";
  let disabledPage = currentPage;
  const displayCountPage = 5;
  let pageGroup = Math.ceil(currentPage / displayCountPage);

  let lastNumberPerPage = pageGroup * displayCountPage;
  if (lastNumberPerPage > totalPage) lastNumberPerPage = totalPage;
  let first =
    lastNumberPerPage - (displayCountPage - 1) <= 0
      ? 1
      : lastNumberPerPage - (displayCountPage - 1);

  const fragmentPage = document.createDocumentFragment();
  if (pageGroup > 1) {
    // const allpreli = document.createElement("li");
    // allpreli.insertAdjacentHTML(
    //   "beforeend",
    //   `<button class="pagination-link" id='allprev'>&lt;&lt;</button>`
    // );

    const prevLi = document.createElement("li");
    prevLi.addEventListener("click", async () => {
      const { currentPage, totalPage, items } = await fetchProductList(
        first - 1
      );
      makeProductList(items);
      renderPagination({ currentPage, totalPage });
    });
    prevLi.insertAdjacentHTML(
      "beforeend",
      `<button class="pagination-link" id='prev'>&lt;</button>`
    );

    // fragmentPage.appendChild(allpreli);
    fragmentPage.appendChild(prevLi);
  }

  for (let page = first; page <= lastNumberPerPage; page++) {
    const li = document.createElement("li");
    li.insertAdjacentHTML(
      "beforeend",
      `<button id='page-${page}' data-num='${page}' class="pagination-link" ${
        currentPage === page ? "disabled" : ""
      }>${page}</button>`
    );
    li.addEventListener("click", async () => {
      selectElementId(`page-${disabledPage}`).removeAttribute("disabled");
      selectElementId(`page-${page}`).setAttribute("disabled", "true");
      disabledPage = page;
      const { currentPage, totalPage, items } = await fetchProductList(page);
      makeProductList(items);
    });
    fragmentPage.appendChild(li);
  }

  //
  if (lastNumberPerPage < totalPage) {
    const nextLi = document.createElement("li");
    nextLi.addEventListener("click", async () => {
      const { currentPage, totalPage, items } = await fetchProductList(
        lastNumberPerPage + 1
      );
      makeProductList(items);
      renderPagination({ currentPage, totalPage });
    });
    nextLi.insertAdjacentHTML(
      "beforeend",
      `<button class="pagination-link" id='next'>&gt;</button>`
    );

    fragmentPage.appendChild(nextLi);
  }

  document.getElementById("js-pagination").appendChild(fragmentPage);
  // 페이지 목록 생성
}

function makeProductList(items) {
  // 각 data마다 html을 생성하여 data를 삽입
  selectElement(".productList").innerHTML = "";
  items.forEach((item) => {
    renderProductCard(item);
  });
}
function renderProductCard(item) {
  const { brand: brandName, name, price, code, imageUrl } = item;
  selectElement(".productList").insertAdjacentHTML(
    "beforeend",
    `<li class="product" id="${code}Li">
        <a href="/product/${code}">
        <img src="${imageUrl}">
        <div>
        <p class="brandName" id="${code}brand">브랜드</p>
        <p class="name" id="${code}name">상품명</p>
        <p class="price" id="${code}price">가격</p>
        </div>
        </a>
        </li>`
  );
  selectElementId(`${code}brand`).innerHTML = brandName;
  selectElementId(`${code}name`).innerHTML = name;
  selectElementId(`${code}price`).innerHTML = price;
}

function setBrandList(brand) {
  brand.forEach((brand) => {
    const brandName = brand.name;
    const li = document.createElement("li");
    li.addEventListener("click", brandFilter);
    li.insertAdjacentHTML(
      "beforeend",
      `<span id="${brandName}">${brandName}</span>`
    );
    selectElement(".categoryList").appendChild(li);
  });
}

async function brandFilter() {
  const brandName = this.firstChild.id;
  const { items } = await getServerDataBrand();
  makeProductList(items);
}

function selectElement(selector) {
  //selector에 선택자를 포함한 str을 넣어줘서 html요소를 반환한다.
  return document.querySelector(selector);
}
function selectElementId(id) {
  return document.getElementById(id);
}

selectElement("#brand").addEventListener("mouseenter", () => {
  selectElement(".categoryList").classList.remove("hidden");
});

selectElement(".categoryList").addEventListener("mouseleave", () => {
  selectElement(".categoryList").classList.add("hidden");
});

selectElement("#MEN").addEventListener("click", async () => {
  const { items } = await getServerDataCategory("MEN");
  makeProductList(items);
});

selectElement("#WOMEN").addEventListener("click", async () => {
  const { items } = await getServerDataCategory("WOMEN");
  makeProductList(items);
});

selectElement("#KIDS").addEventListener("click", async () => {
  const { items } = await getServerDataCategory("KIDS");
  makeProductList(items);
});

init();
