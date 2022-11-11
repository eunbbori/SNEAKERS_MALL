const orderListContainer = document.querySelector(".orderList");

async function init() {
  const dataArr = await getOrderData();
  setOrderList(dataArr);
}

function getOrderData() {
  const res = fetch("/api/order/user", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("서버오류");
      }
      return res.json();
    })
    .then((data) => data)
    .catch((err) => console.log(err));
  return res;
}

function setOrderList(orderlist) {
  orderlist.forEach((order) => {
    const date = order.createdAt.slice(0, 10);
    const orderState = order.orderState;
    const orderId = order._id;
    const orderListString = order.orderList
      .map((item) => {
        return `<p>${item.productName}, ${item.quantity}개</p>`;
      })
      .join("");

    const tr = document.createElement("tr");
    tr.setAttribute("id", orderId);
    tr.insertAdjacentHTML(
      "beforeend",
      `
                <td id="${orderId}date">${date}</td>
                <td id="orderListString">${orderListString}</td>
                <td id="${orderId}orderState">${orderState}</td>  
                `
    );

    orderListContainer.appendChild(tr);

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancelBtn");
    cancelBtn.classList.add("button");
    cancelBtn.classList.add("is-light");
    cancelBtn.innerText = "주문 취소";
    cancelBtn.addEventListener("click", orderCancel);
    if (orderState !== "상품 준비중") {
      cancelBtn.setAttribute("disabled", "true");
    }
    const td = document.createElement("td");
    td.setAttribute("id", `${orderId}td`);
    td.appendChild(cancelBtn);
    tr.appendChild(td);
  });
}

async function orderCancel() {
  const orderId = this.parentNode.parentNode.id;
  await fetch(`/api/order/user?id=${orderId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  const dataArr = await getOrderData();
  orderListContainer.innerHTML = "";
  setOrderList(dataArr);
}

init();
