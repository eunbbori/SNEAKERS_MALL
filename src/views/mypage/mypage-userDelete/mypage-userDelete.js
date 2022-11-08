// 요소(element), input 혹은 상수
const passwordInput = document.querySelector("#passwordInput");
const modal = document.querySelector("#modal");
const modalBackground = document.querySelector("#modalBackground");
const modalCloseButton = document.querySelector("#modalCloseButton");
const deleteCompleteButton = document.querySelector("#deleteCompleteButton");
const deleteCancelButton = document.querySelector("#deleteCancelButton");
const registerForm = document.querySelector("#registerUserForm");
addAllEvents();

// 여러 개의 addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
function addAllEvents() {
  submitButton.addEventListener("click", openModal);
  modalBackground.addEventListener("click", closeModal);
  modalCloseButton.addEventListener("click", closeModal);
  document.addEventListener("keydown", keyDownCloseModal);
  deleteCompleteButton.addEventListener("click", deleteUserData);
  deleteCancelButton.addEventListener("click", closeModal);
}

// db에서 회원정보 삭제
async function deleteUserData(e) {
  e.preventDefault();
  try {
    const password = passwordInput.value;
    const data = { password };
    const bodyData = JSON.stringify(data);

    // if (!userToDelete.ok) {
    //   registerForm.reset();
    //   throw new Error("비밀번호가 일치 하지 않습니다 다시 입력하세요");
    // }
    // const { _id } = userToDelete;

    // 삭제 진행
    const userDelete = await fetch(`/api/users`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: bodyData,
    });
    if (!userDelete.ok) {
      registerForm.reset();
      throw new Error("비밀번호가 일치 하지 않습니다 다시 입력하세요");
    }
    // 삭제 성공
    alert("회원 정보가 안전하게 삭제되었습니다.");

    // 토큰 삭제
    sessionStorage.removeItem("token");

    window.location.href = "/";
  } catch (err) {
    alert(`회원정보 삭제 과정에서 오류가 발생하였습니다: ${err}`);

    closeModal();
  }
}

// Modal 창 열기
async function openModal(e) {
  if (e) {
    e.preventDefault();
  }
  if (passwordInput.value === "") return alert("비밀번호를 입력하세요.");

  modal.classList.add("is-active");
}

// Modal 창 닫기
function closeModal(e) {
  if (e) {
    e.preventDefault();
  }
  modal.classList.remove("is-active");
}

// 키보드로 Modal 창 닫기
function keyDownCloseModal(e) {
  // Esc 키
  if (e.keyCode === 27) {
    closeModal();
  }
}
