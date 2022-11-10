const updateBrand = document.querySelector("#brandInput");
const updateName = document.querySelector("#nameInput");
const updateUrl = document.querySelector("#imageUrlInput");
const updateContent = document.querySelector("#contentInput");
const updateCategory = document.querySelector("#categoryInput");
const updateSize = document.querySelector("#sizeInput");
const updatePrice = document.querySelector("#priceInput");
const updateStock = document.querySelector("#stockInput");

const submitDeleteProduct = document.querySelector("#porductDeleteForm");
const deleteRef = document.querySelector(".product-container");
const prodcutRefInput = document.querySelector("#productRefInput");
const deleteCancelButton = document.querySelector("#deleteCancelButton");
const deleteCompleteButton = document.querySelector("#deleteCompleteButton");
const modalDelete = document.querySelector("#modal1");
const modalUpdate = document.querySelector("#modal2");
const updateCompleteButoon = document.querySelector("#updateCompleteButton");
const updateCancelButton = document.querySelector("#updateCancelButton");
let pageNumber = 1;
let orderIdToDelete;
let orderIdToUpdate;
let brandSwitch;
pagination();

async function handleSubmitRef(e) {
  e.preventDefault();
  const res1 = await fetch("/api/brand", {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
    },
  });
  const results1 = await res1.json();
  console.log(results1);
  console.log(brandSwitch);
  ordersContainer.innerHTML = `   <div class="columns notification is-info is-light is-mobile orders-top">
  <div class="column is-4">상품</div>
  <div class="column is-4">      
  <div class="control">
  <div class="select">
  <select id="categorySelect">
  <option value="브랜드">브랜드</option>
  </select>
  </div>
  </div>
  </div>
  <div class="column is-2">수정</div>
  <div class="column is-2">취소</div>
  </div>
  `;
  const categorySelect = document.querySelector("#categorySelect");
  results1.map((e) => {
    categorySelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${e.name}" style="background-color: #ebfffc; color: #00947e" >
    ${e.name}
  </option>`
    );
  });
  categorySelect.addEventListener("change", () => {
    brandSwitch = categorySelect.value;
    pagination();
  });

  const name = prodcutRefInput.value;
  if (name === "") {
    return pagination();
  }
  try {
    const res = await fetch(`/api/product?name=${name}`, {
      // JWT 토큰을 헤더에 담아 백엔드 서버에 보냄.
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    if (name === "") {
      throw new Error("다시 입력하세요");
    }
    const results = await res.json();
    console.log(results);
    results.items.map((e) => {
      ordersContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="columns orders-item" id="order-${e.code}">
        <div class="column is-2"><figure class="image is-96x96"><img src=${e.imageUrl}></figure></div>
        <div class="column is-2">${e.name}(${e.stock})</div>
        <div class="column is-4 product-name">${e.brand}</div>
        <div class="column is-2 update">
        <button class="button" id="updateButton-${e.code}" > 수정</button>
        </div>
        <div class="column is-2">
        <button class="button" id="deleteButton-${e.code}" > 취소</button>
        </div>
        </div>
      </div>`
      );
      const updateButton = document.querySelector(`#updateButton-${e.code}`);
      updateButton.addEventListener("click", () => {
        orderIdToUpdate = e.code;
        openModal2();
      });
      const deleteButton = document.querySelector(`#deleteButton-${e.code}`);
      deleteButton.addEventListener("click", () => {
        orderIdToDelete = e.code;
        openModal1();
      });
    });
  } catch (err) {
    alert(err);
  }
}
async function deleteOrderData(e) {
  e.preventDefault();
  const data = { code: orderIdToDelete };
  const bodydata = JSON.stringify(data);
  try {
    await fetch(`/api/product`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
      body: bodydata,
    });
    // await Api.delete("/api/orders", orderIdToDelete);

    // 삭제 성공
    alert("상품정보가 삭제되었습니다.");

    // 삭제한 아이템 화면에서 지우기
    const deletedItem = document.querySelector(`#order-${orderIdToDelete}`);
    deletedItem.remove();

    // 전역변수 초기화
    orderIdToDelete = "";
    pagination();
    closeModal1();
  } catch (err) {
    alert(`주문정보 삭제 과정에서 오류가 발생하였습니다: ${err}`);
  }
}

async function updateOrderData(e) {
  e.preventDefault();
  //수정 input 값 확인 후 없으면 undefined return
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
    code: orderIdToUpdate,
  };

  const bodyData = JSON.stringify(data);
  console.log(bodyData);
  try {
    await fetch(`/api/product`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
      // body 추가
      body: bodyData,
    });

    // 삭제 성공
    alert("상품 정보가 수정되었습니다.");

    // 삭제한 아이템 화면에서 지우기

    // 전역변수 초기화
    orderIdToUpdate = "";
    pagination();
    closeModal2();
  } catch (err) {
    alert(`상품정보 수정 과정에서 오류가 발생하였습니다: ${err}`);
  }
}

async function pagination() {
  const res1 = await fetch("/api/brand", {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
    },
  });
  const results1 = await res1.json();
  console.log(results1);
  console.log(brandSwitch);
  ordersContainer.innerHTML = `   <div class="columns notification is-info is-light is-mobile orders-top">
  <div class="column is-4">상품</div>
  <div class="column is-4">      
  <div class="control">
  <div class="select">
  <select id="categorySelect">
  <option value="브랜드">브랜드</option>
  </select>
  </div>
  </div>
  </div>
  <div class="column is-2">수정</div>
  <div class="column is-2">취소</div>
  </div>
  `;
  const categorySelect = document.querySelector("#categorySelect");
  results1.map((e) => {
    categorySelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${e.name}" style="background-color: #ebfffc; color: #00947e" >
    ${e.name}
  </option>`
    );
  });
  categorySelect.addEventListener("change", () => {
    brandSwitch = categorySelect.value;
    pagination();
  });
  const res =
    brandSwitch === undefined
      ? await fetch(`/api/product?page=${pageNumber}`)
      : await fetch(`/api/product?brand=${brandSwitch}`);
  const result = await res.json();
  console.log(result);

  result.items.map((e) => {
    ordersContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="columns orders-item" id="order-${e.code}">
    <div class="column is-2"><figure class="image is-96x96"><img src=${e.imageUrl}></figure></div>
    <div class="column is-2">${e.name}(${e.stock})</div>
    <div class="column is-4 product-name">${e.brand}</div>
    <div class="column is-2 update">
    <button class="button" id="updateButton-${e.code}" > 수정</button>
    </div>
    <div class="column is-2">
    <button class="button" id="deleteButton-${e.code}" > 취소</button>
    </div>
    </div>
  </div>`
    );
    const updateButton = document.querySelector(`#updateButton-${e.code}`);
    updateButton.addEventListener("click", () => {
      orderIdToUpdate = e.code;
      openModal2();
    });
    const deleteButton = document.querySelector(`#deleteButton-${e.code}`);
    deleteButton.addEventListener("click", () => {
      orderIdToDelete = e.code;
      openModal1();
    });
  });

  ordersContainer.insertAdjacentHTML(
    "beforeend",
    `      <nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <ul class="pagination-list">
    </ul>
    </nav>`
  );
  const paginationClass = document.querySelector(".pagination-list");
  for (let i = 0; i < result.totalPage; i++) {
    if (result.currentPage === i + 1) {
      paginationClass.insertAdjacentHTML(
        "beforeend",
        `<li>
      <a class="pagination-link is-current" id="page-${i + 1}" aria-label="${
          i + 1
        }">${i + 1}</a>
      </li>`
      );
    } else {
      paginationClass.insertAdjacentHTML(
        "beforeend",
        `<li>
        <a class="pagination-link" id="page-${i + 1}" aria-label="${i + 1}">${
          i + 1
        }</a>
        </li>`
      );
    }
    const pageBtn = document.querySelector(`#page-${i + 1}`);

    pageBtn.addEventListener("click", () => {
      pageNumber = pageBtn.ariaLabel;
      pagination();
    });
  }
}

function cancelDelete1() {
  orderIdToDelete = "";
  closeModal1();
}

// Modal 창 열기
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

// Modal 창 열기
function openModal2() {
  modalUpdate.classList.add("is-active");
}
function closeModal2() {
  modalUpdate.classList.remove("is-active");
}

submitDeleteProduct.addEventListener("submit", handleSubmitRef);
deleteCancelButton.addEventListener("click", cancelDelete1);
deleteCompleteButton.addEventListener("click", deleteOrderData);
updateCancelButton.addEventListener("click", cancelDelete2);
updateCompleteButoon.addEventListener("click", updateOrderData);
