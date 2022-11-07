const productName = document.querySelector("#productName");
const productDsc = document.querySelector("#productDsc");
const productPrice = document.querySelector("#productPrice");
const productSize = document.querySelector("#productSize");
const productImg = document.querySelector("#productImg");
const productCode = document.querySelector("#productCode");
const productBrand = document.querySelector("#productBrand");
const productStock = document.querySelector("#productStock");
const productCategory = document.querySelector("#productCategory");
const submitAddProduct = document.querySelector("#productAddForm");
const submitDeleteProduct = document.querySelector("#porductDeleteForm");
const deleteRef = document.querySelector(".product-container");
const prodcutRefInput = document.querySelector("#productRefInput");
const deleteCancelButton = document.querySelector("#deleteCancelButton");
const deleteCompleteButton = document.querySelector("#deleteCompleteButton");
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
let orderIdToDelete;

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

async function handleSubmitRef(e) {
  e.preventDefault();
  const code = prodcutRefInput.value;
  try {
    const res = await fetch(`/api/product/${code}`, {
      // JWT 토큰을 헤더에 담아 백엔드 서버에 보냄.
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
    });

    if (code === "") {
      throw new Error("다시 입력하세요");
    }
    const results = await res.json();
    console.log(results);

    ordersContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="columns orders-item" id="order-${results.code}">
        <div class="column is-2"><figure class="image is-96x96"><img src=${results.imageUrl}></figure></div>
        <div class="column is-2">${results.name}</div>
        <div class="column is-4 product-name">${results.brand}</div>
        <div class="column is-2 update">
        <button class="button" id="updateButton-${results.code}" > 수정</button>
        </div>
        <div class="column is-2">
        <button class="button" id="deleteButton-${results.code}" > 취소</button>
        </div>
        </div>
      </div>`
    );
    const deleteButton = document.querySelector(
      `#deleteButton-${results.code}`
    );
    deleteButton.addEventListener("click", () => {
      orderIdToDelete = results.code;
      openModal();
    });
  } catch (err) {
    alert(err);
  }
}
async function deleteOrderData(e) {
  e.preventDefault();

  try {
    await fetch(`/api/product/${orderIdToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
    });
    // await Api.delete("/api/orders", orderIdToDelete);

    // 삭제 성공
    alert("주문 정보가 삭제되었습니다.");

    // 삭제한 아이템 화면에서 지우기
    const deletedItem = document.querySelector(`#order-${orderIdToDelete}`);
    deletedItem.remove();

    // 전역변수 초기화
    orderIdToDelete = "";

    closeModal();
  } catch (err) {
    alert(`주문정보 삭제 과정에서 오류가 발생하였습니다: ${err}`);
  }
}

function cancelDelete() {
  orderIdToDelete = "";
  closeModal();
}

// Modal 창 열기
function openModal() {
  modal.classList.add("is-active");
}
function closeModal() {
  modal.classList.remove("is-active");
}
submitAddProduct.addEventListener("submit", handleSubmitAddProduct);
submitDeleteProduct.addEventListener("submit", handleSubmitRef);
deleteCancelButton.addEventListener("click", cancelDelete);
deleteCompleteButton.addEventListener("click", deleteOrderData);
