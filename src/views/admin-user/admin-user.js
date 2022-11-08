const usersContainer = document.querySelector("#usersContainer");
const modal = document.querySelector("#modal");
const deleteCancelButton = document.querySelector("#deleteCancelButton");
const usersCount = document.querySelector("#usersCount");
const adminCount = document.querySelector("#adminCount");
const deleteCompleteBtn = document.querySelector("#deleteCompleteButton");

getUsersContainer();
const addCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

let userIdToDelete;
async function getUsersContainer() {
  const res = await fetch("/api/userlist", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });
  const results = await res.json();
  const summary = {
    usersCount: 0,
    adminCount: 0,
  };
  for (const result of results) {
    const { role } = result;
    if (role === "basic-user") {
      summary.usersCount += 1;
    } else if (role === "admin") {
      summary.adminCount += 1;
      summary.usersCount += 1;
    }
  }
  console.log(summary.adminCount, summary.usersCount);
  results.map((e) => {
    usersContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="columns orders-item" id="order-${e._id}">
      <div class="column is-2">${e.createdAt.split("T")[0]}</div>
      <div class="column is-2 product-name">${e.email}</div>
      <div class="column is-2">${e.fullName}</div>
      <div class="column is-2">
        <div class="select" >
          <select id="roleSelectBox-${e._id}">
           <option 
            class="has-background-danger-light has-text-danger"
            ${e.role === "basic-user" ? "selected" : ""}
            value="basic-user">
            일반
            </option>
            <option 
            class="has-background-primary-light has-text-primary"
            ${e.role === "admin" ? "selected" : ""}
            value="admin">
            관리자
            </option>
          </select>
        </div>
      </div>
      <div class="column is-2">
      <button class="button" id="deleteButton-${e._id}" >회원 정보 삭제</button>
      </div>
    
    </div>`
    );
    const roleSelectBox = document.querySelector(`#roleSelectBox-${e._id}`);
    const deleteButton = document.querySelector(`#deleteButton-${e._id}`);
    deleteButton.addEventListener("click", () => {
      userIdToDelete = e._id;
      openModal();
    });
    roleSelectBox.addEventListener("change", async () => {
      const newRole = roleSelectBox.value;
      const data = { role: newRole };
      const bodydata = JSON.stringify(data);
      try {
        await fetch(`/api/admin/users/${e._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: bodydata,
        });
        console.log("사용자 권한이 변경되었습니다!");
        window.location.href = "http://localhost:5000/admin-user/";
      } catch (err) {
        console.log(err);
      }
    });
  });
  console.log(results);
  usersCount.innerText = addCommas(summary.usersCount);
  adminCount.innerText = addCommas(summary.adminCount);
}
async function deleteUserData(e) {
  e.preventDefault();

  try {
    await fetch(`/api/admin/users/${userIdToDelete}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    // await Api.delete("/api/orders", orderIdToDelete);

    // 삭제 성공
    alert("회원 정보가 삭제되었습니다.");

    // 삭제한 아이템 화면에서 지우기
    const deletedItem = document.querySelector(`#order-${userIdToDelete}`);
    deletedItem.remove();

    // 전역변수 초기화
    userIdToDelete = "";

    closeModal();
  } catch (err) {
    alert(`주문정보 삭제 과정에서 오류가 발생하였습니다: ${err}`);
  }
}

function cancelDelete() {
  userIdToDelete = "";
  closeModal();
}
function closeModal() {
  modal.classList.remove("is-active");
}
function openModal() {
  modal.classList.add("is-active");
}
deleteCancelButton.addEventListener("click", cancelDelete);
deleteCompleteBtn.addEventListener("click", deleteUserData);
