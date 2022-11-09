/**
 * @description
 * 배열에 있는 데이터 생성하여 DB에 POST요청 보내서 데이터 생성시킨다.
 */
function createBtn() {
  document.body.insertAdjacentHTML(
    "afterend",
    '<button id="pushData">DB 상품 추가</button>'
  );
}

function createProductDataDB() {
  document.querySelector("#pushData").addEventListener("click", async () => {
    const dummyData = [
      {
        code: "",
        name: "테스트 아이템",
        content: "상품 설명",
        price: 149000,
        size: 260,
        imageUrl:
          "https://image.a-rt.com/art/product/2022/08/61867_1660899499825.jpg?shrink=388:388",
        brand: "LACOSTE",
        stock: 23,
        category: "MEN",
      },
    ];

    dummyData.forEach(async (item) => {
      const bodyData = JSON.stringify(item);

      await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: bodyData,
      });
    });
  });
}
createBtn();
createProductDataDB();
