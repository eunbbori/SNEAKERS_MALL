const categoryAddForm = document.querySelector("#categoryAddForm");
const categoryAddInput = document.querySelector("#categoryAdd");
const categoryDeleteForm = document.querySelector("#categoryDeleteForm");
const categorySelectBox = document.querySelector("#brandSelect");

function categoryAddFormHandler(e) {
  e.preventDefault();
  const category = categoryAddInput.value;
  const data = { category };
  const bodyData = JSON.stringify(data);
  console.log(bodyData);
  // try {
  //   await fetch("/api/category", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization:
  //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
  //     },
  //     body: bodyData,
  //   });
  //   categoryAddForm.reset();
  // } catch (err) {
  //   console.log(err.stack);
  // }
  categoryAddForm.reset();
}
function categoryDeleteFormHandler(e) {
  e.preventDefault();
  const brandSelectValue = categorySelectBox.value;
  // try {
  //   await fetch(`/api/category/${brandSelectValue}`, {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization:
  //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYwYjQ4MWJjMGZiY2I1YWFhNDYxMmMiLCJyb2xlIjoiYmFzaWMtdXNlciIsImlhdCI6MTY2NzI4MjIwNH0.pAegQIKEaZmGFznaEablnGuF-1iDFLZs9OgmW4EYFbE",
  //     },
  //   });
  // categoryDeleteForm.reset();
  // } catch (err) {
  //   console.log(err.stack);
  // }
}
categoryAddForm.addEventListener("submit", categoryAddFormHandler);
categoryDeleteForm.addEvesntListener("submit", categoryDeleteFormHandler);
