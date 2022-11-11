const productName = document.querySelector("#productName");
const productDsc = document.querySelector("#productDsc");
const productPrice = document.querySelector("#productPrice");
const productImg = document.querySelector("#productImg");
const productStock = document.querySelector("#productStock");
const submitAddProduct = document.querySelector("#productAddForm");
const brandSelectBox = document.querySelector("#brandSelect");
const sizeSelectBox = document.querySelector("#sizeSelect");
const categorySelectBox = document.querySelector("#categorySelect");
let startSize = 120;
brandSelectHandler();
sizeCreate();
function sizeCreate() {
  for (let i = 0; i < 37; i++) {
    sizeSelectBox.insertAdjacentHTML(
      "beforeend",
      ` <option value="${startSize}" style="background-color: #ebfffc; color: #00947e">
    ${startSize}
  </option>`
    );
    startSize += 5;
  }
}
async function handleSubmitAddProduct(e) {
  e.preventDefault();
  const name = productName.value;
  const content = productDsc.value;
  const price = productPrice.value;
  const size = sizeSelectBox.value;
  const imageUrl = productImg.value;
  const brand = brandSelectBox.value;
  const stock = productStock.value;
  const category = categorySelectBox.value;
  const data = {
    name,
    content,
    price,
    size,
    imageUrl,
    brand,
    stock,
    category,
  };
  if (
    !name ||
    !content ||
    !price ||
    !size ||
    !imageUrl ||
    !brand ||
    !category ||
    !stock
  ) {
    return alert("데이터 값을 제대로 입력하셔야 합니다.");
  }
  const bodyData = JSON.stringify(data);
  console.log(data);
  try {
    const res = await fetch("/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
      body: bodyData,
    });
    if (res.ok)
      alert(`상품이 ${category}에 추가 되었습니다 ${brand}:${name}(${stock})`);
    submitAddProduct.reset();
  } catch (err) {
    console.log(err.stack);
  }
}

async function brandSelectHandler() {
  try {
    brandSelectBox.innerHTML = "";
    const res = await fetch("/api/brand", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
    });
    const results = await res.json();
    results.map((e) => {
      brandSelectBox.insertAdjacentHTML(
        "beforeend",
        ` <option value="${e.name}" style="background-color: #ebfffc; color: #00947e">
          ${e.name}
        </option>`
      );
    });
    console.dir(results);
    console.log(`브랜드 가져오기 성공! `);
    console.log(brandSelectBox.value);
  } catch (err) {
    console.log(err.stack);
  }
}

submitAddProduct.addEventListener("submit", handleSubmitAddProduct);
