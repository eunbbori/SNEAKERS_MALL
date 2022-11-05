// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

// import * as Api from "/api.js";
/**
 * @description 초기 실행 함수
 */
async function init() {
  const { totalCount, items} = await getServerData();
  const brand = await getbrandData();
  setBrandList(brand)
  makeProductList(items)
  // pagination({currentPage, lastPage, totalCount})
}

function getServerData() { //홈페이지 api요청
  const res = fetch('/api/product?page=1')
    .then(res => res.json())
    .then(item => item)
    return res; 
}
function getbrandData() { //홈페이지 brand목록 데이터 가져오기
  const res = fetch('/api/brand')
    .then(res => res.json())
    .then(item => item)
    return res;
}
function getServerDataCategory(category) { //category get요청
  const res = fetch(`/api/product?page=1&category=${category}`)
    .then(res => res.json())
    .then(item => item)
    return res; 
}
function getServerDataBrand(brand) { //category get요청
  const res = fetch(`/api/product?page=1&brand=${brand}`)
    .then(res => res.json())
    .then(item => item)
    return res; 
}

async function getDataFromApi() {
  // 예시 URI입니다. 현재 주어진 프로젝트 코드에는 없는 URI입니다.
  const data = await Api.get("/api/user/data");

  console.log({ data });
}

function pagination({currentPage, lastPage, totalCount}) {

  if (totalCount <= 20) return; 

	let pageGroup = Math.ceil(currentPage / 10);
	
	let last = pageGroup * 10;
	if (last > lastPage) last = lastPage;
	let first = last - (10 - 1) <= 0 ? 1 : last - (10 - 1);

	const fragmentPage = document.createDocumentFragment();
  if (pageGroup > 1) {
	  const allpreli = document.createElement('li');
	  allpreli.insertAdjacentHTML("beforeend", `<a href='#js-bottom' id='allprev'>&lt;&lt;</a>`);
	
	  const preli = document.createElement('li');
	  preli.insertAdjacentHTML("beforeend", `<a href='#js-ottom' id='prev'>&lt;</a>`);
	
	  fragmentPage.appendChild(allpreli);
	  fragmentPage.appendChild(preli);
	}

  for (let i = first; i <= last; i++) {
	  const li = document.createElement("li");
	  li.insertAdjacentHTML("beforeend", `<a href='#js-bottom' id='page-${i}' data-num='${i}'>${i}</a>`);
    li.addEventListener('click', () => {alert(i)})
	  fragmentPage.appendChild(li);
  }

  if (last < lastPage) {
	  const allendli = document.createElement('li');
	  allendli.insertAdjacentHTML("beforeend", `<a href='#js-bottom'  id='allnext'>&gt;&gt;</a>`);
	
	  const endli = document.createElement('li');
	  endli.insertAdjacentHTML("beforeend", `<a  href='#js-bottom'  id='next'>&gt;</a>`);
	
	  fragmentPage.appendChild(endli);
	  fragmentPage.appendChild(allendli);
  }

    document.getElementById('js-pagination').appendChild(fragmentPage);
		// 페이지 목록 생성0
}

function makeProductList(items) {  // 각 data마다 html을 생성하여 data를 삽입
  // selectElement('.productList').innerHTML = '';
  items.forEach(item => {
      const brandName = item.brand;
      const name = item.name;
      const price = item.price;
      const code = item.code;
      const img = item.imageUrl;
      selectElement('.productList').insertAdjacentHTML(
        'beforeend',
        `<li class="product">
        <a href="/product/${code}">
        <img src="${img}">
        <div>
        <p class="brandName" id="${code}brand">브랜드</p>
        <p class="name" id="${code}name">상품명</p>
        <p class="price" id="${code}price">가격</p>
        </div>
        </a>
        </li>`
      )
        selectElementId(`${code}brand`).innerHTML = brandName
        selectElementId(`${code}name`).innerHTML = name
        selectElementId(`${code}price`).innerHTML = price
    }
  )
}

function setBrandList(brand) {
  brand.forEach(brand => {
    const brandName = brand.name;
    const li = document.createElement('li')
    li.addEventListener('click', brandFilter)
    li.insertAdjacentHTML(
      'beforeend', `<span id="${brandName}">${brandName}</span>`
    )
    selectElement('.categoryList').appendChild(li)
  })
}

async function brandFilter() {
  const brandName = this.firstChild.id;
  const {items} = await getServerDataBrand()
  makeProductList(items)
}

function selectElement(selector) {    //selector에 선택자를 포함한 str을 넣어줘서 html요소를 반환한다.
  return document.querySelector(selector)
}
function selectElementId(id) {
  return document.getElementById(id)
}

selectElement('#brand').addEventListener('mouseenter', () => {
  selectElement('.categoryList').classList.remove('hidden')
})

selectElement('.categoryList').addEventListener('mouseleave', () => {
  selectElement('.categoryList').classList.add('hidden')
})

selectElement('#MEN').addEventListener('click', async() => {
  const {items} = await getServerDataCategory('MEN')
  makeProductList(items)
})

selectElement('#WOMEN').addEventListener('click', async() => {
  const {items} = await getServerDataCategory('WOMEN')
  makeProductList(items)
})

selectElement('#KIDS').addEventListener('click', async() => {
  const {items} = await getServerDataCategory('KIDS')
  makeProductList(items)
})

init();