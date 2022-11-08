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
  const { totalPage, currentPage, items } = await fetchProductList(1);
  const brand = await getbrandData();
  setBrandList(brand);
  makeProductList(items);
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
function getServerDataCategory(page, category) {
  const res = fetch(`/api/product?page=${page}&category=${category}`)
    .then((res) => res.json())
    .then((item) => item);
  return res;
}
/**
 * @description
 * 페이지 이동 버튼 생성 함수
 * @param {*} param0
 */
function renderPagination({
  currentPage,
  totalPage,
  brand = "",
  category = "",
}) {
  selectElementId("js-pagination").innerHTML = "";
  let disabledPage = currentPage; // 현재 위치한 페이지 버튼을 비활성화 시키기 위한 변수
  const displayCountPage = 5; //몇 페이지씩 보여줄지 정하는 상수
  let pageGroup = Math.ceil(currentPage / displayCountPage); // 나타내고 있는 페이지들 묶음
  let lastNumberPerPage = pageGroup * displayCountPage; // 나타내고 있는 마지막 페이지

  if (lastNumberPerPage > totalPage) lastNumberPerPage = totalPage;

  // 나타내고 있는 첫번째 페이지
  let first =
    lastNumberPerPage - (displayCountPage - 1) <= 0
      ? 1
      : lastNumberPerPage - (displayCountPage - 1);
  const fragmentPage = document.createDocumentFragment();

  //이전 페이지 버튼 생성
  if (pageGroup > 1) {
    const prevLi = document.createElement("li");
    prevLi.addEventListener("click", async () => {
      if (brand) {
        const { currentPage, totalPage, items } = await getServerDataBrand(
          first - 1,
          brand
        );
        makeProductList(items);
        renderPagination({ currentPage, totalPage, brand });
      } else if (category) {
        const { currentPage, totalPage, items } = await getServerDataCategory(
          first - 1,
          category
        );
        makeProductList(items);
        renderPagination({ currentPage, totalPage, category });
      } else {
        const { currentPage, totalPage, items } = await fetchProductList(
          first - 1
        );
        makeProductList(items);
        renderPagination({ currentPage, totalPage });
      }
    });
    prevLi.insertAdjacentHTML(
      "beforeend",
      `<button class="pagination-link" id='prev'>&lt;</button>`
    );

    fragmentPage.appendChild(prevLi);
  }

  // 각 페이지 버튼 생성
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
      if (brand) {
        const { items } = await getServerDataBrand(page, brand);
        makeProductList(items);
      } else if (category) {
        const { items } = await getServerDataCategory(page, category);
        makeProductList(items);
      } else {
        const { items } = await fetchProductList(page);
        makeProductList(items);
      }
    });
    fragmentPage.appendChild(li);
  }

  // 다음 페이지 버튼 생성
  if (lastNumberPerPage < totalPage) {
    const nextLi = document.createElement("li");
    nextLi.addEventListener("click", async () => {
      if (brand) {
        const { currentPage, totalPage, items } = await getServerDataBrand(
          lastNumberPerPage + 1,
          brand
        );
        makeProductList(items);
        renderPagination({ currentPage, totalPage, brand });
      } else if (category) {
        const { currentPage, totalPage, items } = await getServerDataCategory(
          lastNumberPerPage + 1,
          category
        );
        makeProductList(items);
        renderPagination({ currentPage, totalPage, category });
      } else {
        const { currentPage, totalPage, items } = await fetchProductList(
          lastNumberPerPage + 1
        );
        makeProductList(items);
        renderPagination({ currentPage, totalPage });
      }
    });
    nextLi.insertAdjacentHTML(
      "beforeend",
      `<button class="pagination-link" id='next'>&gt;</button>`
    );

    fragmentPage.appendChild(nextLi);
  }

  document.getElementById("js-pagination").appendChild(fragmentPage);
}

function makeProductList(items) {
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
                <p class="subtitle is-6">${price}</p>
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
    const li = document.createElement("li");
    li.addEventListener("click", brandFilter);
    li.insertAdjacentHTML(
      "beforeend",
      `<span id="${brandName}">${brandName}</span>`
    );
    selectElement(".categoryList").appendChild(li);
  });
}

/**
 * @description
 * 브랜드 클릭하면 브랜드로 필터링된 아이템 요청
 */
async function brandFilter() {
  const brandName = this.firstChild.id;
  const { items, currentPage, totalPage } = await getServerDataBrand(
    1,
    brandName
  );
  makeProductList(items);
  renderPagination({ currentPage, totalPage, brand: brandName });
}

/**
 *
 * @param {*} brand
 * @returns
 */
function getServerDataBrand(page, brand) {
  //category get요청
  const res = fetch(`/api/product?page=${page}&brand=${brand}`)
    .then((res) => res.json())
    .then((item) => item);
  return res;
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
function selectElementId(id) {
  return document.getElementById(id);
}

selectElement("#brand").addEventListener("mouseenter", () => {
  selectElement(".categoryList").classList.remove("hidden");
});
selectElement("#brand").addEventListener("mouseleave", () => {
  selectElement(".categoryList").classList.add("hidden");
});

selectElement(".categoryList").addEventListener("mouseenter", () => {
  selectElement(".categoryList").classList.remove("hidden");
});
selectElement(".categoryList").addEventListener("mouseleave", () => {
  selectElement(".categoryList").classList.add("hidden");
});

selectElement("#MEN").addEventListener("click", async () => {
  const { items, currentPage, totalPage } = await getServerDataCategory(
    1,
    "MEN"
  );
  renderPagination({ currentPage, totalPage, category: "MEN" });
  makeProductList(items);
});

selectElement("#WOMEN").addEventListener("click", async () => {
  const { items, currentPage, totalPage } = await getServerDataCategory(
    1,
    "WOMEN"
  );
  renderPagination({ currentPage, totalPage, category: "WOMEN" });
  makeProductList(items);
});

selectElement("#KIDS").addEventListener("click", async () => {
  const { items, currentPage, totalPage } = await getServerDataCategory(
    1,
    "KIDS"
  );
  renderPagination({ currentPage, totalPage, category: "KIDS" });
  makeProductList(items);
});

init();
