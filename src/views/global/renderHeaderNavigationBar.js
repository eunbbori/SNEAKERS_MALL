function init() {
  renderNavBar();
}

function renderNavBar() {
  const token = sessionStorage.getItem("token");
  const navBarEl = selectElementId("navbar");

  if (!token) return;

  // 로그인 상태
  if (token) {
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
                <a href="/cart" aria-current="page">
                  <span class="icon">
                    <i class="fas fa-cart-shopping"></i>
                  </span>
                  <span>카트</span>
                </a>
              </li>`
    );
    navBarEl.appendChild(adminLiEl);
    selectElementId("nav-logout").addEventListener("click", () => {
      sessionStorage.removeItem("token");
    });
  }
}
function selectElementId(id) {
  return document.getElementById(id);
}

function createLiElement({ text, href, id }) {
  const liEl = document.createElement("li");
  const aEl = document.createElement("a");
  aEl.setAttribute("href", href);
  aEl.setAttribute("id", id);
  aEl.innerText = text;
  liEl.appendChild(aEl);
  return liEl;
}
init();
