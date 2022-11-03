const categoryAddForm = document.querySelector("#categoryAddForm");
const categoryAddInput = document.querySelector("#categoryAdd");
const categoryDeleteForm = document.querySelector("#categoryDeleteForm");
const categorySelectBox = document.querySelector("#brandSelect");
brandSelectHandler();
//카테고리 삭제기능 드롭다운 속성값 추가 핸들러 카테고리 경로로 get요청을 보내 json으로 값을 가져옴 map()으로 뿌려줄 예정
//카테고리 추가 이벤트가 발생 할 시 해당 함수를 다시 실행하여 드롭다운 매뉴를 바꿔줌(연쇄과정)
async function brandSelectHandler() {
  try {
    categorySelectBox.innerHTML = "";
    const res = await fetch("/api/brand", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
    });
    const results = await res.json();
    results.map((e) => {
      categorySelectBox.insertAdjacentHTML(
        "beforeend",
        ` <option value="${e.name}" style="background-color: #ebfffc; color: #00947e">
          ${e.name}
        </option>`
      );
    });
    console.dir(results);
    console.log(`브랜드 가져오기 성공! `);
  } catch (err) {
    console.log(err.stack);
  }
}

async function categoryAddFormHandler(e) {
  e.preventDefault();
  const name = categoryAddInput.value;
  const data = { name };
  const bodyData = JSON.stringify(data);
  console.log(bodyData);
  try {
    await fetch("/api/brand", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
      body: bodyData,
    });
    categoryAddForm.reset();
  } catch (err) {
    console.log(err.stack);
  }
  categoryAddForm.reset();
}

async function categoryDeleteFormHandler(e) {
  e.preventDefault();
  const brandSelectValue = categorySelectBox.value;
  try {
    await fetch(`/api/brand/${brandSelectValue}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
      },
    });
    categoryDeleteForm.reset();
  } catch (err) {
    console.log(err.stack);
  }
}
categoryAddForm.addEventListener("submit", categoryAddFormHandler);
categoryAddForm.addEventListener("submit", brandSelectHandler);
categoryDeleteForm.addEventListener("submit", categoryDeleteFormHandler);
categoryDeleteForm.addEventListener("submit", brandSelectHandler);
