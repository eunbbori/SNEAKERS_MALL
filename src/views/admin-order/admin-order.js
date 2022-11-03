const ordersContainer = document.querySelector(".orders-container");
const btnRef = document.querySelector("#orderRefBtn");
const orderCount = document.querySelector("#ordersCount");
const prepareCount = document.querySelector("#prepareCount");
const deliveryCount = document.querySelector("#deliveryCount");
const completeCount = document.querySelector("#completeCount");
const modal = document.querySelector("#modal");
const deleteCancelBtn = document.querySelector("#deleteCancelButton");
const addCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
let orderIdToDelete;
const userOrderList = async function (e) {
  e.preventDefault();
  try {
    const res = await fetch("./product.json");
    const results = await res.json();
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
    results.map((e) => {
      ordersContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="columns orders-item">
        <div class="column is-2">${e.userId}</div>
        <div class="column is-4 product-name">${e.productName}</div>
        <div class="column is-2">${e.account * e.productPrice}</div>
        <div class="column is-2">
          <div class="select" >
            <select id="statusSelectBox-${e.userId}">
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
        <button class="button" id="deleteButton-${e.userId}" >주문 취소</button>
        </div>
      
      </div>`
      );
      const deleteButton = document.querySelector(`#deleteButton-${e.userId}`);
      deleteButton.addEventListener("click", () => {
        orderIdToDelete = e.userId;
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

btnRef.addEventListener("click", userOrderList);
deleteCancelBtn.addEventListener("click", cancelDelete);
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
