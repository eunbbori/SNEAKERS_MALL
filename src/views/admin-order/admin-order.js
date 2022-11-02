const ordersContainer = document.querySelector(".orders-container");
const btnRef = document.querySelector("#orderRefBtn");

const userOrderList = async function (e) {
  e.preventDefault();
  try {
    const res = await fetch("./product.json");
    const result = await res.json();
    console.log(result);
    result.map((e) => {
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
              value=${e.orderState}>
              ${e.orderState}
              </option>
              <option 
              class="has-background-primary-light has-text-primary"
              value=${e.orderState}>
              ${e.orderState}
              </option>
              <option 
              class="has-background-grey-light"
              value=${e.orderState}>
              ${e.orderState}
              </option>
            </select>
          </div>
          <div class="column is-2">
            <button class="button" id="deleteButton-${
              e.userId
            }" >주문 취소</button>
          </div>
        </div>
        <div class="column is-2">
        <button class="button" id="deleteButton-${e.userId}" >주문 취소</button>
        </div>
      
      </div>`
      );
    });
  } catch (err) {
    console.log(err);
  }
};

btnRef.addEventListener("click", userOrderList);
