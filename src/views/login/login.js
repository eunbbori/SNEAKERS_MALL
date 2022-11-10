import * as Api from "/api.js";
import { validateEmail } from "/useful-functions.js";

// 요소(element), input 혹은 상수
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const submitButton = document.querySelector("#submitButton");
let database;
addAllElements();
addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
async function addAllElements() { }

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener("click", handleSubmit);
}

const getUrlParams = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const result = {};

  for (const [key, value] of urlParams) {
    result[key] = value;
  }

  return result;
};

// 로그인 진행
async function handleSubmit(e) {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;
  
  // 잘 입력했는지 확인
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;

  if (!isEmailValid || !isPasswordValid) {
    return alert(
      "비밀번호가 4글자 이상인지, 이메일 형태가 맞는지 확인해 주세요."
    );
  }

  // 로그인 api 요청
  try {
    const indexedDB = await getFromDb("cart");
    console.log(indexedDB);
    const data = { email, password,indexedDB };
    const result = await Api.post("/api/login", data);
    const token = result.token;

    // 로그인 성공, 토큰을 세션 스토리지에 저장
    // 물론 다른 스토리지여도 됨
    sessionStorage.setItem("token", token);
    // await fetch('/api/cart', {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    //   },
    //   body: indexedDB,
    // });
    await deleteFromDb("cart");
    await deleteFromDb("order");
    const res = await fetch("/api/cart", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      const errorContent = await res.json();
      const { reason } = errorContent;

      throw new Error(reason);
    }

    const cartData = await res.json();
    console.log(cartData);
    for (const item of cartData) {
      //console.log(item);
      insertDb(item);
    }

    alert(`정상적으로 로그인되었습니다.`);

    // 로그인 성공

    const { previouspage } = getUrlParams();

    if (previouspage) {
      window.location.href = previouspage;

      return;
    }

    // 기본 페이지로 이동
    //window.location.href = "/";
  } catch (err) {
    console.error(err.stack);
    alert(`문제가 발생하였습니다. 확인 후 다시 시도해 주세요: ${err.message}`);
  }
}
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

const getFromDb = async (storeName) => {
  // database 변수가 아직 초기화가 되어있지 않다면,
  // openDatabase 함수를 실행하여 데이터베이스 객체를 할당함.
  if (!database) {
    database = await openDatabase();
  }

  const transaction = database.transaction([storeName]);
  const store = transaction.objectStore(storeName);

  const data = new Promise((resolve, reject) => {
    const getRequest = store.getAll();
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


// indexedDB의 데이터를 삭제함
const deleteFromDb = async (storeName) => {
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
    const deleteRequest = store.clear();

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

//indexeddb에 데이터 추가
async function insertDb(product) {
  // 객체 destructuring
  const { code, price,quantity } = product
  const mongoPrice=parseInt(price*quantity)

  // 장바구니 추가 시, indexedDB에 제품 데이터 및
  await addToDb('cart', { ...product }, code)

  // 장바구니 요약(=전체 총합)을 업데이트함.
  await putToDb('order', 'summary', (data) => {
    // 기존 데이터를 가져옴
    const count = data.productsCount
    const total = parseInt(data.productsTotal)
    const ids = data.ids
    const selectedIds = data.selectedIds
    
    // 기존 데이터가 있다면 1을 추가하고, 없다면 초기값 1을 줌
    data.productsCount = count ? count + 1 : 1

    // 기존 데이터가 있다면 가격만큼 추가하고, 없다면 초기값으로 해당 가격을 줌
    data.productsTotal = total ? total + mongoPrice : mongoPrice

    // 기존 데이터(배열)가 있다면 id만 추가하고, 없다면 배열 새로 만듦
    data.ids = ids ? [...ids, code] : [code]

    // 위와 마찬가지 방식
    data.selectedIds = selectedIds ? [...selectedIds, code] : [code]
  })
}

// indexedDB에 저장함
const addToDb = async (storeName, entry, key = '') => {
  // database 변수가 아직 초기화가 되어있지 않다면,
  // openDatabase 함수를 실행하여 데이터베이스 객체를 할당함.
  if (!database) {
    database = await openDatabase()
  }
  const transaction = database.transaction([storeName], 'readwrite')
  const store = transaction.objectStore(storeName)

  const result = new Promise((resolve, reject) => {
    // key가 주어졌다면 해당 key로 db에 추가하고,
    // key가 없다면, 기본 설정대로 autoincrement(1, 2, 3 ... 순서)로
    // key를 설정하여 추가함.
    const addRequest = key ? store.add(entry, key) : store.add(entry)

    addRequest.onsuccess = () => {
      console.log(`${storeName}에 정상적으로 추가되었습니다.`)
      resolve()
    }

    addRequest.onerror = () => {
      const err = addRequest.error
      console.log(
        `${storeName}에 추가하는데 오류가 발생하였습니다: ${err}`
      )

      reject(err)
    }
  })

  return result
}

// indexedDB의 데이터를 수정함
const putToDb = async (storeName, key, dataModifyFunc) => {
  // database 변수가 아직 초기화가 되어있지 않다면,
  // openDatabase 함수를 실행하여 데이터베이스 객체를 할당함.
  if (!database) {
    database = await openDatabase()
  }

  const transaction = database.transaction([storeName], 'readwrite')
  const store = transaction.objectStore(storeName)

  const result = new Promise((resolve, reject) => {
    // 우선 현재 데이터를 가져옴 (데이터 없을 시, 빈 객체 할당)
    const getRequest = store.get(key)

    // 가져온 다음 수정 진행
    getRequest.onsuccess = () => {
      const data = getRequest.result || {}
      // 데이터 수정
      dataModifyFunc(data)

      // 수정한 데이터 삽입
      const putRequest = store.put(data, key)

      putRequest.onsuccess = () => {
        console.log(`${storeName}가 정상적으로 수정되었습니다.`)
        resolve()
      }

      putRequest.onerror = () => {
        const err = putRequest.error
        console.log(
          `${storeName}를 수정하는데 에러가 발생하였습니다: ${err} `
        )

        reject(err)
      }
    }
  })

  return result
}
