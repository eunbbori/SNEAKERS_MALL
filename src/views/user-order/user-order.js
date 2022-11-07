async function init() {
  const dataArr = await getOrderData();
  console.log(dataArr);
  setOrderList(dataArr);
  //   setOrderList(orderlist);
}

function getOrderData() {
  const res = fetch("/api/order/user", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  return res;
}

function setOrderList(orderlist) {
  orderlist.forEach((order) => {
    const orderListContainer = document.querySelector(".orderList");
    // const productName = order.productName;
    // const quantity = order.orderList[0].quantity;
    const date = order.createdAt;
    const orderState = order.orderState;
    const orderId = order._id;
    const orderListString = order.orderList
      .map((item) => {
        return `<p>${item.productCode}, ${item.quantity}</p>`;
      })
      .join("");

    const li = document.createElement("li");
    li.classList.add("stateList");
    li.setAttribute("id", `${orderId}`);
    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancelBtn");
    cancelBtn.innerText = "주문 취소";
    cancelBtn.addEventListener("click", orderCancel);

    li.insertAdjacentHTML(
      "beforeend",
      `
                <p id="${orderId}date">${date}</p>
                <div>${orderListString}</div>
                <p id="${orderId}orderState">${orderState}</p>
            `
    );

    li.appendChild(cancelBtn);
    orderListContainer.appendChild(li);
  });
}

async function orderCancel() {
  const orderId = this.parentNode.id;
  await fetch(`/api/order/${orderId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  this.parentNode.remove();
}

init();
