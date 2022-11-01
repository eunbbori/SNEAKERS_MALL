# sneakersMall
Update admin.html

 -전 버전과 다르게 카테고리 폼들과 상품기능 폼을 div로 구분함 ex) div1->카테고리 폼 div2-> 상품기능 폼 

Update admin.js
 **상품기능폼**

 **-상품추가(이름, 설명, 가격, 사이즈, 이미지주소) post 요청 **

**  - Input 태그**
   -productName
   -productDsc
   -productPrice
   -productSize
   -productImg

  **- button 태그 (누를 시 폼을 제출해주는 함수(async handleSubmit) 실행)**
   -submitAddProduct
`import * as Api from "/api.js";
const productName = document.querySelector("#productName");
const productDsc = document.querySelector("#productDsc");
const productPrice = document.querySelector("#productPrice");
const productSize = document.querySelector("#productSize");
const productImg = document.querySelector("#productImg");
const submitAddProduct = document.querySelector("#submitAddProduct");

submitAddProduct.addEventListener("click", handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();
  const name = productName.value;
  const dsc = productDsc.value;
  const price = productPrice.value;
  const size = productSize.value;
  const img = productImg.value;
  try {
    const data = { name, dsc, price, size, img };
    const result = await Api.post("/api/admin", data);
  } catch (err) {
    console.log(err.stack);
  }
}
`
