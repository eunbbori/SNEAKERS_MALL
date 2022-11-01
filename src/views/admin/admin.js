import * as Api from "/api.js";
const productName = document.querySelector("#productName");
const productDsc = document.querySelector("#productDsc");
const productPrice = document.querySelector("#productPrice");
const productSize = document.querySelector("#productSize");
const productImg = document.querySelector("#productImg");
const submitAddProduct = document.querySelector("#submitAddProduct");

submitAddProduct.addEventListener("submit", handleSubmit);

// async function handleSubmit(e) {
//   e.preventDefault();
//   const name = productName.value;
//   const dsc = productDsc.value;
//   const price = productPrice.value;
//   const size = productSize.value;
//   const img = productImg.value;
//   try {
//     const data = { name, dsc, price, size, img };
//     const result = await Api.post("/api/admin", data);
//   } catch (err) {
//     console.log(err.stack);
//   }
// }
function handleSubmit(e) {
  e.preventDefault();
  const name = productName.value;
  const dsc = productDsc.value;
  const price = productPrice.value;
  const size = productSize.value;
  const img = productImg.value;
  const data = { name, dsc, price, size, img };
  console.log(data);
}
