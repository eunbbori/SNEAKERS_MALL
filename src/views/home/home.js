// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

// import * as Api from "/api.js";
// import { randomId } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const landingDiv = document.querySelector("#landingDiv");
const greetingDiv = document.querySelector("#greetingDiv");


addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() {
  insertTextToLanding();
  insertTextToGreeting();
}

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  landingDiv.addEventListener("click", alertLandingText);
  greetingDiv.addEventListener("click", alertGreetingText);
}

function insertTextToLanding() {
  landingDiv.insertAdjacentHTML(
    "beforeend",
    `
      <h2>n팀 쇼핑몰의 랜딩 페이지입니다. 자바스크립트 파일에서 삽입되었습니다.</h2>
    `
  );
}

function insertTextToGreeting() {
  greetingDiv.insertAdjacentHTML(
    "beforeend",
    `
      <h1>반갑습니다! 자바스크립트 파일에서 삽입되었습니다.</h1>
    `
  );
}

function alertLandingText() {
  alert("n팀 쇼핑몰입니다. 안녕하세요.");
}

function alertGreetingText() {
  alert("n팀 쇼핑몰에 오신 것을 환영합니다");
}

async function getDataFromApi() {
  // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
  const data = await Api.get("/api/user/data");
  const random = randomId();

  console.log({ data });
  console.log({ random });
}

async function showProduct() { //test용 json파일요청
  return await fetch('./test.json')
    .then(res => res.json())
}

function makeProductList() {  // 각 data마다 html을 생성하여 data를 삽입
  showProduct().then((data) => {
    data.forEach((item) => {
      const brandName = item.brandName;
      const productName = item.productName;
      const price = item.price;
      const productId = item.productId;
      selectElement('.productList').insertAdjacentHTML(
        'beforeend',
        `<li class="product" id="${productId}">
        <a href="/product/:${productId}">
        <img src="../elice-rabbit.png">
        <div>
        <p class="brandName">브랜드</p>
        <p class="productName">상품명</p>
        <p class="price">가격</p>
        </div>
        </a>
        </li>`
      )
        selectElement(`#${productId} > a > div > .brandName`).innerHTML = brandName
        selectElement(`#${productId} > a > div > .productName`).innerHTML = productName
        selectElement(`#${productId} > a > div > .price`).innerHTML = price
    })
  })
}

function selectElement(selector) {    //selector에 선택자를 포함한 str을 넣어줘서 html요소를 반환한다.
  return document.querySelector(selector)
}

makeProductList()
