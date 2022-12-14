const productName = document.querySelector("#productName");
const productDsc = document.querySelector("#productDsc");
const productPrice = document.querySelector("#productPrice");
const productSize = document.querySelector("#productSize");
const productImg = document.querySelector("#productImg");
const productCode = document.querySelector("#productCode");
const productBrand = document.querySelector("#productBrand");
const productStock = document.querySelector("#productStock");
const productCategory = document.querySelector("#productCategory");
const updateBrand = document.querySelector("#brandInput");
const updateName = document.querySelector("#nameInput");
const updateUrl = document.querySelector("#imageUrlInput");
const updateContent = document.querySelector("#contentInput");
const updateCategory = document.querySelector("#categoryInput");
const updateSize = document.querySelector("#sizeInput");
const updatePrice = document.querySelector("#priceInput");
const updateStock = document.querySelector("#stockInput");

const submitAddProduct = document.querySelector("#productAddForm");
const submitDeleteProduct = document.querySelector("#porductDeleteForm");
const deleteRef = document.querySelector(".product-container");
const prodcutRefInput = document.querySelector("#productRefInput");
const deleteCancelButton = document.querySelector("#deleteCancelButton");
const deleteCompleteButton = document.querySelector("#deleteCompleteButton");
const modalDelete = document.querySelector("#modal1");
const modalUpdate = document.querySelector("#modal2");
const updateCompleteButoon = document.querySelector("#updateCompleteButton");
const updateCancelButton = document.querySelector("#updateCancelButton");

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
//     alert(`????????? ?????????????????????. ?????? ??? ?????? ????????? ?????????: ${err.message}`);
//   }
// }
let orderIdToDelete;
let orderIdToUpdate;
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
    return alert("????????? ?????? ????????? ??????????????? ?????????.");
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
      // JWT ????????? ????????? ?????? ????????? ????????? ??????.
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
    });

    if (code === "") {
      throw new Error("?????? ???????????????");
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
        <button class="button" id="updateButton-${results.code}" > ??????</button>
        </div>
        <div class="column is-2">
        <button class="button" id="deleteButton-${results.code}" > ??????</button>
        </div>
        </div>
      </div>`
    );
    const updateButton = document.querySelector(
      `#updateButton-${results.code}`
    );
    updateButton.addEventListener("click", () => {
      orderIdToUpdate = results.code;
      openModal2();
    });
    const deleteButton = document.querySelector(
      `#deleteButton-${results.code}`
    );
    deleteButton.addEventListener("click", () => {
      orderIdToDelete = results.code;
      openModal1();
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

    // ?????? ??????
    alert("?????? ????????? ?????????????????????.");

    // ????????? ????????? ???????????? ?????????
    const deletedItem = document.querySelector(`#order-${orderIdToDelete}`);
    deletedItem.remove();

    // ???????????? ?????????
    orderIdToDelete = "";

    closeModal1();
  } catch (err) {
    alert(`???????????? ?????? ???????????? ????????? ?????????????????????: ${err}`);
  }
}

async function updateOrderData(e) {
  e.preventDefault();
  //?????? input ??? ?????? ??? ????????? undefined return
  const brand = updateBrand.value === "" ? undefined : updateBrand.value;
  const name = updateName.value === "" ? undefined : updateName.value;
  const imageUrl = updateUrl.value === "" ? undefined : updateUrl.value;
  const content = updateContent.value === "" ? undefined : updateContent.value;
  const category =
    updateCategory.value === "" ? undefined : updateCategory.value;
  const size = updateSize.value === "" ? undefined : updateSize.value;
  const price = updatePrice.value === "" ? undefined : updatePrice.value;
  const stock = updateStock.value === "" ? undefined : updateStock.value;
  const data = {
    brand,
    name,
    imageUrl,
    content,
    category,
    size,
    price,
    stock,
  };

  const bodyData = JSON.stringify(data);
  try {
    await fetch(`/api/product/${orderIdToUpdate}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
      // body ??????
      body: bodyData,
    });
    // await Api.delete("/api/orders", orderIdToDelete);

    // ?????? ??????
    alert("?????? ????????? ?????????????????????.");

    // ????????? ????????? ???????????? ?????????
    const deletedItem = document.querySelector(`#order-${orderIdToUpdate}`);
    deletedItem.remove();

    // ???????????? ?????????
    orderIdToUpdate = "";

    closeModal2();
  } catch (err) {
    alert(`???????????? ?????? ???????????? ????????? ?????????????????????: ${err}`);
  }
}

function cancelDelete1() {
  orderIdToDelete = "";
  closeModal1();
}

// Modal ??? ??????
function openModal1() {
  modalDelete.classList.add("is-active");
}
function closeModal1() {
  modalDelete.classList.remove("is-active");
}

function cancelDelete2() {
  orderIdToUpdate = "";
  closeModal2();
}

// Modal ??? ??????
function openModal2() {
  modalUpdate.classList.add("is-active");
}
function closeModal2() {
  modalUpdate.classList.remove("is-active");
}
submitAddProduct.addEventListener("submit", handleSubmitAddProduct);
submitDeleteProduct.addEventListener("submit", handleSubmitRef);
deleteCancelButton.addEventListener("click", cancelDelete1);
deleteCompleteButton.addEventListener("click", deleteOrderData);
updateCancelButton.addEventListener("click", cancelDelete2);
updateCompleteButoon.addEventListener("click", updateOrderData);
