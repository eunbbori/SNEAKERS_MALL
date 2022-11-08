const updateBtn = document.querySelector("#updateCompleteButton");
const fullNameInput = document.querySelector("#fullNameInput");
const passwordInput = document.querySelector("#passwordInput");
const phoneNumberInput = document.querySelector("#phoneNumberInput");
const passwordChangeInput = document.querySelector("#passwordChangeInput");
const postalCodeInput = document.querySelector("#postalCodeInput");
const address1Input = document.querySelector("#address1Input");
const address2Input = document.querySelector("#address2Input");
const roleInput = document.querySelector("#roleInput");
const updateCancelBtn = document.querySelector("#updateCancelButton");

async function updateUse(e) {
  e.preventDefault();

  try {
    const res = await fetch("/api/user", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    const result = await res.json();
    console.log(result);
    const fullName =
      fullNameInput.value === "" ? undefined : fullNameInput.value;
    const currentPassword =
      passwordInput.value === "" ? undefined : passwordInput.value;
    const password =
      passwordChangeInput.value === "" ? undefined : passwordChangeInput.value;
    const postalCode =
      postalCodeInput.value === "" ? undefined : postalCodeInput.value;
    const address1 =
      address1Input.value === "" ? undefined : address1Input.value;
    const address2 =
      address2Input.value === "" ? undefined : address2Input.value;

    const address = {
      postalCode,
      address1,
      address2,
    };

    const phoneNumber = phoneNumberInput.value;
    const data = {
      fullName,
      currentPassword,
      password,
      address,
      phoneNumber,
    };
    const bodyData = JSON.stringify(data);
    if (currentPassword === undefined) {
      throw new Error("페스워드를 입력하세요.");
    }
    await fetch(`/api/users/${result._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
      body: bodyData,
    });
    if (!res.ok) {
      const errorContent = await res.json();
      const { reason } = errorContent;

      throw new Error(reason);
    }
    alert("수정되었습니다");
    window.location.href = "http://localhost:5000/mypage/";
  } catch (err) {
    console.log(err);
    alert(err);
  }
}

updateBtn.addEventListener("click", updateUse);
updateCancelBtn.addEventListener("click", () => {
  window.location.href = "http://localhost:5000/mypage/";
});
