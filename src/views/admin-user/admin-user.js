const usersContainer = document.querySelector("#usersContainer");
const modal = document.querySelector("#modal");
const deleteCancelButton = document.querySelector("#deleteCancelButton");
const usersCount = document.querySelector("#usersCount");
const adminCount = document.querySelector("#adminCount");

getUsersContainer();
const addCommas = (n) => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

let userIdToDelete;
async function getUsersContainer() {
  const res = await fetch("/api/userlist", {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
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
    } else if (role === "admin-user") {
      summary.adminCount += 1;
      summary.usersCount += 1;
    }
  }
  results.map((e) => {
    usersContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="columns orders-item">
      <div class="column is-2">${e.createdAt}</div>
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
            ${e.role === "admin-user" ? "selected" : ""}
            value="admin-user">
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
  });
  console.log(results);
  usersCount.innerText = addCommas(summary.usersCount);
  adminCount.innerText = addCommas(summary.adminCount);
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
