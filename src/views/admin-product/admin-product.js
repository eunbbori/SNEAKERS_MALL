const productName = document.querySelector("#productName");
const productDsc = document.querySelector("#productDsc");
const productPrice = document.querySelector("#productPrice");
const productSize = document.querySelector("#productSize");
const productImg = document.querySelector("#productImg");
const productCode = document.querySelector("#productCode");
const productBrand = document.querySelector("#productBrand");
const productStock = document.querySelector("#productStock");
const productCategory = document.querySelector("#productCategory");
const prodcutDeleteInput = document.querySelector("#productDelete");
const submitAddProduct = document.querySelector("#productAddForm");
const submitDleteForm = document.querySelector("#porductDeleteForm");
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
  const content = productDsc.value;
  const price = productPrice.value;
  const size = productSize.value;
  const imageUrl = productImg.value;
  const code = productCode.value;
  const brand = productBrand.value;
  const stock = productStock.value;
  const category = productCategory.value;
  const data = {
    name,
    content,
    price,
    size,
    imageUrl,
    code,
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
    !code ||
    !brand ||
    !category ||
    !stock
  ) {
    return alert("데이터 값을 제대로 입력하셔야 합니다.");
  }
  const bodyData = JSON.stringify(data);
  console.log(data);
  try {
    await fetch("/api/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
      body: bodyData,
    });
    submitAddProduct.reset();
  } catch (err) {
    console.log(err.stack);
  }
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

// function handleSubmitAddProduct(e) {
//   e.preventDefault();
//   const name = productName.value;

//   const data = { name };

//   console.log(data);
// }

// function handleSubmitDeleteProduct(e) {
//   e.preventDefault();
//   const productValue = prodcutDeleteInput.value;
//   try {
//     await fetch(`/api/product/${productValue}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization:
//           "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
//       },
//     });
//     submitDleteForm.reset();
//   } catch (err) {
//     console.log(err.stack);
//   }
// }

submitAddProduct.addEventListener("submit", handleSubmitAddProduct);
// submitDleteForm.addEventListener("submit", handleSubmitDeleteProduct);
