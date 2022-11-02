# sneakersMall
**Update admin.html**

-전 버전과 다르게 카테고리 폼들과 상품기능 폼을 div로 구분함 ex) div1->카테고리 폼 div2-> 상품기능 폼 

**Update admin.js 상품기능폼**

-상품추가(이름, 설명, 가격, 사이즈, 이미지주소) post 요청

- Input 태그
   -productName
   -productDsc
   -productPrice
   -productSize
   -productImg

- button 태그 (누를 시 폼을 제출해주는 함수(async handleSubmit) 실행)
   -submitAddProduct

- json으로 받아온 데이터를 각각 html요소로 만들어 표현할 수 있도록 함수 작성

**2022/11/02 Update admin-product,admin-order admin페이지 분할 라우팅 수정**

- 주문조회 기능 product.json 파일 생성 (*dummy파일)
- 조회 버튼 누를 시 사용자 주문내역 부분에 생성됨
- admin-product 상품 추가 post 요청시 컬랙션에 doc 생성 확인
