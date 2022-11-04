async function init() {
    const {orderlist} = await getOrderData()
    setOrderList(orderlist)
}


function getOrderData() {
    const res = fetch('./test.json')
        .then(res => res.json())
        .then(data => data)
    return res
}

function setOrderList(orderlist) {
    orderlist.forEach(order => {
        const orderListContainer = document.querySelector('.orderList')
        const productName = order.productName;
        const quantity = order.quantity;
        const date = order.date;
        const orderState = order.orderState;
        const orderCode = order.orderCode;

        const li = document.createElement('li')
        li.classList.add('stateList')
        li.setAttribute('id', `${orderCode}`)
        const cancelBtn = document.createElement('button')
        cancelBtn.classList.add('cancelBtn')
        cancelBtn.innerText = '주문 취소'
        cancelBtn.addEventListener('click', orderCancel)
        li.insertAdjacentHTML('beforeend', 
            `
                <p id="date">${date}</p>
                <p id="orderInfor">${productName}, ${quantity}개</p>
                <p id="orderState">${orderState}</p>
            `
        )
        li.appendChild(cancelBtn)
        orderListContainer.appendChild(li);
    })
}

async function orderCancel() {
    const orderId = this.parentNode.id
    await fetch(`/api/order/${orderId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    })
    this.parentNode.remove()
        
    
}

init()

