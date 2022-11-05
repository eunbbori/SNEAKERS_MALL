
// //////////////////////useful-db.js////////////////////////////

// 로그인 여부(토큰 존재 여부) 확인
export const checkLogin = () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
        // 현재 페이지의 url 주소 추출하기
        const pathname = window.location.pathname;
        const search = window.location.search;

        // 로그인 후 다시 지금 페이지로 자동으로 돌아가도록 하기 위한 준비작업임.
        window.location.replace(`/login?previouspage=${pathname + search}`);
    }
};

// 숫자에 쉼표를 추가함. (10000 -> 10,000)
export const addCommas = (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 13,000원, 2개 등의 문자열에서 쉼표, 글자 등 제외 후 숫자만 뺴냄
// 예시: 13,000원 -> 13000, 20,000개 -> 20000
export const convertToNumber = (string) => {
    return parseInt(string.replace(/(,|개|원)/g, ""));
  };


/////////////////indexed-db.js///////////////////////////////
let database;


// indexedDB에 연결하고, 연결 성공 시 데이터베이스 객체를
// Promise로 감싸 반환함.
const openDatabase = () => {
    const db = new Promise((resolve, reject) => {
      const onRequest = indexedDB.open("shopping", 1);
      onRequest.onupgradeneeded = () => {
        console.log("indexeddb의 업그레이드가 이루어집니다.");
        const database = onRequest.result;
  
        database.createObjectStore("cart", {
          autoIncrement: true,
        });
  
        database.createObjectStore("order", {
          autoIncrement: true,
        });
      };
  
      onRequest.onsuccess = async () => {
        console.log("indexeddb가 정상적으로 시작되었습니다.");
  
        resolve(onRequest.result);
      };
  
      onRequest.onerror = () => {
        const err = onRequest.error;
        console.log(
          `indexeddb를 시작하는 과정에서 오류가 발생하였습니다: ${err}`
        );
  
        reject(err);
      };
    });
  
    return db;
  };
  
// indexedDB에 저장된 값을 가져옴
const getFromDb = async (storeName, key = "") => {
    // database 변수가 아직 초기화가 되어있지 않다면,
    // openDatabase 함수를 실행하여 데이터베이스 객체를 할당함.
    if (!database) {
        database = await openDatabase();
    }

    const transaction = database.transaction([storeName]);
    const store = transaction.objectStore(storeName);

    const data = new Promise((resolve, reject) => {
        // key가 주어졌다면 key에 해당하는 특정 아이템만,
        // key가 없다면 모든 아이템을 가져옴
        const getRequest = key ? store.get(key) : store.getAll();

        getRequest.onsuccess = () => {
            resolve(getRequest.result);
        };

        getRequest.onerror = () => {
            const err = getRequest.error;
            console.log(
                `${storeName}에서 가져오는 과정에서 오류가 발생하였습니다: ${err}`
            );

            reject(err);
        };
    });

    return data;
};


// indexedDB의 데이터를 수정함
const putToDb = async (storeName, key, dataModifyFunc) => {
    // database 변수가 아직 초기화가 되어있지 않다면,
    // openDatabase 함수를 실행하여 데이터베이스 객체를 할당함.
    if (!database) {
        database = await openDatabase();
    }

    const transaction = database.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    const result = new Promise((resolve, reject) => {
        // 우선 현재 데이터를 가져옴 (데이터 없을 시, 빈 객체 할당)
        const getRequest = store.get(key);

        // 가져온 다음 수정 진행
        getRequest.onsuccess = () => {
            const data = getRequest.result || {};
            // 데이터 수정
            dataModifyFunc(data);

            // 수정한 데이터 삽입
            const putRequest = store.put(data, key);

            putRequest.onsuccess = () => {
                console.log(`${storeName}가 정상적으로 수정되었습니다.`);
                resolve();
            };

            putRequest.onerror = () => {
                const err = putRequest.error;
                console.log(`${storeName}를 수정하는데 에러가 발생하였습니다: ${err} `);

                reject(err);
            };
        };
    });

    return result;
};

// indexedDB의 데이터를 삭제함
const deleteFromDb = async (storeName, key = "") => {
    // database 변수가 아직 초기화가 되어있지 않다면,
    // openDatabase 함수를 실행하여 데이터베이스 객체를 할당함.
    if (!database) {
        database = await openDatabase();
    }

    const transaction = database.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    const result = new Promise((resolve, reject) => {
        // key가 주어졌다면 key에 해당하는 특정 아이템만,
        // key가 없다면 모든 아이템을 삭제함
        const deleteRequest = key ? store.delete(key) : store.clear();

        deleteRequest.onsuccess = () => {
            console.log(`${storeName}에서 정상적으로 삭제되었습니다.`);
            resolve();
        };

        deleteRequest.onerror = () => {
            const err = deleteRequest.error;
            console.log(`${storeName}에서 삭제하는데 에러가 발생하였습니다: ${err} `);

            reject(err);
        };
    });

    return result;
};

// ///////////////////////api.js//////////////////////////////////////////////

// api 로 GET 요청 (/endpoint/params 형태로 요청함)
// async function get(endpoint, params = "") {
//     const apiUrl = `${endpoint}/${params}`;
//     console.log(`%cGET 요청: ${apiUrl} `, "color: #a25cd1;");
  
//     const res = await fetch(apiUrl, {
//       // JWT 토큰을 헤더에 담아 백엔드 서버에 보냄.
//       headers: {
//         Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//       },
//     });
  
//     // 응답 코드가 4XX 계열일 때 (400, 403 등)
//     if (!res.ok) {
//       const errorContent = await res.json();
//       const { reason } = errorContent;
  
//       throw new Error(reason);
//     }
  
//     const result = await res.json();
  
//     return result;
//   }

  // api 로 POST 요청 (/endpoint 로, JSON 데이터 형태로 요청함)
async function post(endpoint, data) {
    const apiUrl = endpoint;
    // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
    // 예시: {name: "Kim"} => {"name": "Kim"}
    const bodyData = JSON.stringify(data);
    console.log(`%cPOST 요청: ${apiUrl}`, "color: #296aba;");
    console.log(`%cPOST 요청 데이터: ${bodyData}`, "color: #296aba;");
  
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: bodyData,
    });
  
    // 응답 코드가 4XX 계열일 때 (400, 403 등)
    if (!res.ok) {
      const errorContent = await res.json();
      const { reason } = errorContent;
  
      throw new Error(reason);
    }
  
    const result = await res.json();
  
    return result;
  }
  
///////////////////////////////////////////////////////////////////////////////////////////////////


// 요소(element), input 혹은 상수
const userName = document.getElementById('userName');
const userPhoneNumber = document.getElementById('userPhoneNumber');
const userEmail = document.getElementById('userEmail');

//const subtitleCart = document.querySelector("#subtitleCart");
const receiverNameInput = document.querySelector("#receiverName");
const receiverPhoneNumberInput = document.querySelector("#receiverPhoneNumber");
//const postalCodeInput = document.querySelector("#postalCode");
//const searchAddressButton = document.querySelector("#searchAddressButton");
const addressInput = document.querySelector("#address");
//const address2Input = document.querySelector("#address2");
const requestSelectBox = document.querySelector("#requestSelectBox");
const customRequestContainer = document.querySelector(
    "#customRequestContainer"
);
const customRequestInput = document.querySelector("#customRequest");
const productsTitleElem = document.querySelector("#productsTitle");
const productsTotalElem = document.querySelector("#productsTotal");
const deliveryFeeElem = document.querySelector("#deliveryFee");
const orderTotalElem = document.querySelector("#orderTotal");
const checkoutButton = document.querySelector("#checkoutButton");

const requestOption = {
    1: "직접 수령하겠습니다.",
    2: "배송 전 연락바랍니다.",
    3: "부재 시 경비실에 맡겨주세요.",
    4: "부재 시 문 앞에 놓아주세요.",
    5: "부재 시 택배함에 넣어주세요.",
    6: "직접 입력",
};

checkLogin();
addAllElements();
addAllEvents();
recieveData();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllElements() {
    //createNavbar();
    insertOrderSummary();
    //insertUserData();
}

//주문 고객정보에 data를 넣음.
async function recieveData() {
    await fetch('./loginUser.json')
        .then(res => res.json())
        .then(data => {
            userName.value = data.fullName;
            userPhoneNumber.value = data.phoneNumber;
            userEmail.value = data.email;
            
        })
}

//addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
    //subtitleCart.addEventListener("click", navigate("/cart"));
    //searchAddressButton.addEventListener("click", searchAddress);
    requestSelectBox.addEventListener("change", handleRequestChange);
    checkoutButton.addEventListener("click", doCheckout);
}

// 페이지 로드 시 실행되며, 결제정보 카드에 값을 삽입함.
async function insertOrderSummary() {
    const { ids, selectedIds, productsTotal } = await getFromDb(
        "order",
        "summary"
    );

    // 구매할 아이템이 없다면 다른 페이지로 이동시킴
    const hasItemInCart = ids.length !== 0;
    const hasItemToCheckout = selectedIds.length !== 0;

    if (!hasItemInCart) {
        //const categorys = await get("/api/categorylist");
        //const categoryTitle = randomPick(categorys).title;

        alert(`구매할 제품이 없습니다. 제품을 선택해 주세요.`);

        return window.location.replace("/");
    }

    if (!hasItemToCheckout) {
        alert("구매할 제품이 없습니다. 장바구니에서 선택해 주세요.");

        return window.location.replace("/cart");
    }

    // 화면에 보일 상품명
    let productsTitle = "";

    for (const id of selectedIds) {
        const { name, quantity } = await getFromDb("cart", id);
        // 첫 제품이 아니라면, 다음 줄에 출력되도록 \n을 추가함
        if (productsTitle) {
            productsTitle += "\n";
        }

        productsTitle += `${name} / ${quantity}개`;
    }

    productsTitleElem.innerText = productsTitle;
    productsTotalElem.innerText = `${addCommas(productsTotal)}원`;

    if (hasItemToCheckout) {
        deliveryFeeElem.innerText = `3,000원`;
        orderTotalElem.innerText = `${addCommas(productsTotal + 3000)}원`;
    } else {
        deliveryFeeElem.innerText = `0원`;
        orderTotalElem.innerText = `0원`;
    }

    receiverNameInput.focus();
}

// //배송정보
// // async function insertUserData() {
// //     const userData = await get("./loginUser.json");
// //     const { fullName, phoneNumber, address } = userData;

// //     // 만약 db에 데이터 값이 있었다면, 배송지정보에 삽입
// //     if (fullName) {
// //         receiverNameInput.value = fullName;
// //     }

// //     if (phoneNumber) {
// //         receiverPhoneNumberInput.value = phoneNumber;
// //     }

// //     if (address) {
// //         // postalCode.value = address.postalCode;
// //         // address1Input.value = address.address1;
// //         // address2Input.value = address.address2;
// //         addressInput.value=address;
// //     }
// // }

// "직접 입력" 선택 시 input칸 보이게 함
// default값(배송 시 요청사항을 선택해 주세여) 이외를 선택 시 글자가 진해지도록 함
function handleRequestChange(e) {
    const type = e.target.value;

    if (type === "6") {
        customRequestInput.style.display = "flex";
        customRequestInput.focus();
    } else {
        customRequestInput.style.display = "none";
    }

    if (type === "0") {
        requestSelectBox.style.color = "rgba(0, 0, 0, 0.3)";
    } else {
        requestSelectBox.style.color = "rgba(0, 0, 0, 1)";
    }
}

// 결제 진행
async function doCheckout() {
    const receiverName= receiverNameInput.value; //수령인이름
    const tel = receiverPhoneNumberInput.value; //수령인휴대번호
    //const postalCode = postalCodeInput.value;
    //const address1 = address1Input.value;
    //const address2 = address2Input.value;   
    const address=addressInput.value; //수령인주소
    const requestType = requestSelectBox.value; //1-6
    const customRequest = customRequestInput.value; //직접입력
    const summaryTitle = productsTitleElem.innerText; //구매할 상품 이름
    const account = convertToNumber(orderTotalElem.innerText); //총 결제예정금액
    const { selectedIds } = await getFromDb("order", "summary");
    const orderList=[];

    if (!receiverName || !tel|| !address) {
        return alert("배송지 정보를 모두 입력해 주세요.");
    }
    
    // 요청사항의 종류에 따라 request 문구가 달라짐
    let request;
    if (requestType === "0") {
        request = "요청사항 없음.";
    } else if (requestType === "6") {
        if (!customRequest) {
            return alert("요청사항을 작성해 주세요.");
        }
        request = customRequest;
    } else {
        request = requestOption[requestType];
    }

    // const address = {
    //     addressValue,
    //     receiverName,
    //     receiverPhoneNumber,
    // };
    
    try {
        for (const productId of selectedIds) {
            const { quantity,price } = await getFromDb("cart", productId);
            const totalPrice = quantity * price;
            orderList.push({
                "productCode":productId,
                "quantity":quantity
            })
            // await post("/api/orderitem", {
            //     orderId,
            //     productId,
            //     quantity,
            //     totalPrice,
            // });

            // indexedDB에서 해당 제품 관련 데이터를 제거함
            await deleteFromDb("cart", productId);
            await putToDb("order", "summary", (data) => {
                data.ids = data.ids.filter((id) => id !== productId);
                data.selectedIds = data.selectedIds.filter((id) => id !== productId);
                data.productsCount -= 1;
                data.productsTotal -= totalPrice;
            });
        }
        // 전체 주문을 등록함
        const orderData = await post("/api/order", {
            "userId":userEmail.value,
            "name": receiverName,
            address,
            tel,
            account,
            orderList
        });

        const orderId = orderData._id;

        // 제품별로 주문아이템을 등록함
        

        // 입력된 배송지정보를 유저db에 등록함
        // const data = {
        //     phoneNumber: receiverPhoneNumber,
        //     address: {
        //         postalCode,
        //         address1,
        //         address2,
        //     },
        // };
        // await post("/api/user/deliveryinfo", data);

        alert("결제 및 주문이 정상적으로 완료되었습니다.\n감사합니다.");
        window.location.href = "/order/complete";
    } catch (err) {
        console.log(err);
        alert(`결제 중 문제가 발생하였습니다: ${err.message}`);
    }
}


// // // Daum 주소 API (사용 설명 https://postcode.map.daum.net/guide)
// // function searchAddress() {
// //     new daum.Postcode({
// //         oncomplete: function (data) {
// //             let addr = "";
// //             let extraAddr = "";

// //             if (data.userSelectedType === "R") {
// //                 addr = data.roadAddress;
// //             } else {
// //                 addr = data.jibunAddress;
// //             }

// //             if (data.userSelectedType === "R") {
// //                 if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
// //                     extraAddr += data.bname;
// //                 }
// //                 if (data.buildingName !== "" && data.apartment === "Y") {
// //                     extraAddr +=
// //                         extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
// //                 }
// //                 if (extraAddr !== "") {
// //                     extraAddr = " (" + extraAddr + ")";
// //                 }
// //             } else {
// //             }

// //             postalCodeInput.value = data.zonecode;
// //             address1Input.value = `${addr} ${extraAddr}`;
// //             address2Input.placeholder = "상세 주소를 입력해 주세요.";
// //             address2Input.focus();
// //         },
// //     }).open();
// // }
