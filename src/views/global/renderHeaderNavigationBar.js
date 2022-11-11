function init() {
  renderNavBar();
}

async function removeDB(){
    await deleteFromDb("cart");
    await deleteFromDb("order");
    console.log('indexeddb삭제')
    sessionStorage.removeItem("token");
    console.log('db 날리기');
    
}

let database;

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

async function renderNavBar() {
  const token = sessionStorage.getItem("token");
  const navBarEl = selectElementId("navbar");

  if (!token) return;
  if (token) {
    const { role } = await isAdmin();
    // 로그인 상태
    navBarEl.innerHTML = "";
    const myPageLiEl = createLiElement({
      text: "마이페이지",
      href: "/mypage",
      id: "nav-mypage",
    });
    const logoutLiEl = createLiElement({
      text: "로그아웃",
      href: "/",
      id: "nav-logout",
    });
    const adminLiEl = createLiElement({
      text: "관리자",
      href: "/admin-product",
      id: "nav-admin",
    });

    navBarEl.appendChild(myPageLiEl);
    navBarEl.appendChild(logoutLiEl);

    navBarEl.insertAdjacentHTML(
      "beforeend",
      `
              <li>
                <a href="/cart" aria-current="page" style="color:black;">
                  <span class="icon">
                    <i class="fas fa-cart-shopping"></i>
                  </span>
                  <span>카트</span>
                </a>
              </li>`
    );
    if (role === "admin") {
      navBarEl.appendChild(adminLiEl);
    }
    selectElementId("nav-logout").addEventListener("click", removeDB);
  }
}
function selectElementId(id) {
  return document.getElementById(id);
}

function createLiElement({ text, href, id }) {
  const liEl = document.createElement("li");
  const aEl = document.createElement("a");
  aEl.setAttribute("style", "color:black;");
  aEl.setAttribute("href", href);
  aEl.setAttribute("id", id);
  aEl.innerText = text;
  liEl.appendChild(aEl);
  return liEl;
}

function isAdmin() {
  const userInformation = fetch("/api/user", {
    headers: {
      authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => data);
  return userInformation;
}
init();
