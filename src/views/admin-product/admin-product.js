// import * as Api from "/api.js";
const productName = document.querySelector("#productName");
const productDsc = document.querySelector("#productDsc");
const productPrice = document.querySelector("#productPrice");
const productSize = document.querySelector("#productSize");
const productImg = document.querySelector("#productImg");
const submitAddProduct = document.querySelector("#porductAddForm");

// async function handleSubmitAddProduct(e) {
//   e.preventDefault();
//   const name = productName.value;
//   const dsc = productDsc.value;
//   const price = productPrice.value;
//   const size = productSize.value;
//   const img = productImg.value;
//   try {
//     const data = { name, dsc, price, size, img };
//     const result = await Api.post("/admin", data);
//   } catch (err) {
//     console.log(err.stack);
//   }
//   console.log(result);
// }

// async function handleSubmitAddProduct(e) {
//   e.preventDefault();
//   const name = productName.value;
//   const dsc = productDsc.value;
//   const price = productPrice.value;
//   const size = productSize.value;
//   const img = productImg.value;

//   try {
//     const data = { name, dsc, price, size, img };

//     Api.post("./product.json", data);
//   } catch (err) {
//     console.error(err.stack);
//     alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
//   }
// }

async function handleSubmitAddProduct(e) {
  e.preventDefault();
  const name = productName.value;
  const dsc = productDsc.value;
  const price = productPrice.value;
  const size = productSize.value;
  const img = productImg.value;

  const data = { name, dsc, price, size, img };
  const bodyData = JSON.stringify(data);

  const res = await fetch("./product.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bodyData,
  });

  const result = await res.json();

  return result;
}

// function handleSubmitAddProduct(e) {
//   e.preventDefault();
//   const name = productName.value;
//   const dsc = productDsc.value;
//   const price = productPrice.value;
//   const size = productSize.value;
//   const imgurl = productImg.value;

//   const data = { name, dsc, price, size, imgurl };

//   console.log(data);
// }

submitAddProduct.addEventListener("submit", handleSubmitAddProduct);
