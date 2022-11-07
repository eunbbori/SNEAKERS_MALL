const ordersContainer = document.querySelector(".orders-container");
const btnRef = document.querySelector("#orderRefBtn");
const orderCount = document.querySelector("#ordersCount");
const prepareCount = document.querySelector("#prepareCount");
const deliveryCount = document.querySelector("#deliveryCount");
const completeCount = document.querySelector("#completeCount");
const modal = document.querySelector("#modal");
const deleteCancelBtn = document.querySelector("#deleteCancelButton");
const deleteCompleteBtn = document.querySelector("#deleteCompleteButton");
const addCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
let orderIdToDelete;
let orderIdToUpdate;
const userOrderList = async function (e) {
  e.preventDefault();
  try {
    const res = await fetch("/api/order/admin", {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
    });
    const results = await res.json();
    console.log(results);
    const summary = {
      ordersCount: 0,
      prepareCount: 0,
      deliveryCount: 0,
      completeCount: 0,
    };
    for (const result of results) {
      const { userId, productName, account, productPrice, orderState } = result;
      if (orderState === "상품 준비중") {
        summary.prepareCount += 1;
      } else if (orderState === "상품 배송중") {
        summary.deliveryCount += 1;
      } else if (orderState === "배송완료") {
        summary.completeCount += 1;
      }
    }
    //주석 제거
    results.map((e) => {
      ordersContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="columns orders-item" id="order-${e._id}">
        <div class="column is-2">${e.userId}</div>
        <div class="column is-2 product-name">${e.productName}</div>
        <div class="column is-2">${e.account}</div>
        <div class="column is-2">
          <div class="select" >
            <select id="statusSelectBox-${e._id}">
             <option
              class="has-background-danger-light has-text-danger"
              ${e.orderState === "상품 준비중" ? "selected" : ""}
              value="상품 준비중">
              상품 준비중
              </option>
              <option
              class="has-background-primary-light has-text-primary"
              ${e.orderState === "상품 배송중" ? "selected" : ""}
              value="상품 배송중">
              상품 배송중
              </option>
              <option
              class="has-background-grey-light"
              ${e.orderState === "배송완료" ? "selected" : ""}
              value="배송완료">
              배송완료
              </option>
            </select>
          </div>
        </div>
        <div class="column is-2">
        <button class="button" id="deleteButton-${e._id}" >주문 취소</button>
        </div>

       </div>`
      );
      const deleteButton = document.querySelector(`#deleteButton-${e._id}`);
      const selectBox = document.querySelector(`#statusSelectBox-${e._id}`);
      selectBox.addEventListener("change", async () => {
        const newRole = selectBox.value;
        const data = { role: newRole };

        await fetch(`/api/order/admin?id=${e._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
          },
          body: data,
        });
      });
      deleteButton.addEventListener("click", () => {
        orderIdToDelete = e._id;
        openModal();
      });
    });

    orderCount.innerText = addCommas(results.length);
    prepareCount.innerText = addCommas(summary.prepareCount);
    deliveryCount.innerText = addCommas(summary.deliveryCount);
    completeCount.innerText = addCommas(summary.completeCount);
  } catch (err) {
    console.log(err);
  }
};
async function deleteOrderData(e) {
  e.preventDefault();

  try {
    await fetch(`/api/order/admin?id=${orderIdToDelete}`, {
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

btnRef.addEventListener("click", userOrderList);
deleteCancelBtn.addEventListener("click", cancelDelete);
deleteCompleteBtn.addEventListener("click", deleteOrderData);
function cancelDelete() {
  orderIdToDelete = "";
  closeModal();
}

function openModal() {
  modal.classList.add("is-active");
}
function closeModal() {
  modal.classList.remove("is-active");
}
