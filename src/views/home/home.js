// 아래는 현재 home.html 페이지에서 쓰이는 코드는 아닙니다.
// 다만, 앞으로 ~.js 파일을 작성할 때 아래의 코드 구조를 참조할 수 있도록,
// 코드 예시를 남겨 두었습니다.

// import * as Api from "/api.js";
/**
 * @description 초기 실행 함수
 */
async function init() {
  const {currentPage, lastPage, totalCount, items, brand} = await getServerData();
  

  setBrandList(brand)
  makeProductList(items)
  pagination({currentPage, lastPage, totalCount})
}



function getServerData() { //test용 json파일요청
  const res = fetch('./test.json')
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
  selectElement('.productList').innerHTML = '';
  items.forEach(item => {
      const brandName = item.brand;
      const name = item.name;
      const price = item.price;
      const code = item.code;
      selectElement('.productList').insertAdjacentHTML(
        'beforeend',
        `<li class="product" id="${code}">
        <a href="/product/:${code}">
        <img src="../elice-rabbit.png">
        <div>
        <p class="brandName">브랜드</p>
        <p class="name">상품명</p>
        <p class="price">가격</p>
        </div>
        </a>
        </li>`
      )
        selectElement(`#${code} > a > div > .brandName`).innerHTML = brandName
        selectElement(`#${code} > a > div > .name`).innerHTML = name
        selectElement(`#${code} > a > div > .price`).innerHTML = price
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


function selectElement(selector) {    //selector에 선택자를 포함한 str을 넣어줘서 html요소를 반환한다.
  return document.querySelector(selector)
}

async function brandFilter() {
  const brandName = this.firstChild.id;
  const {items} = await getServerData()
  const filtering = items.filter(item => item.brand ===  brandName.toLowerCase())
  makeProductList(filtering)
}


selectElement('#brand').addEventListener('mouseenter', () => {
  selectElement('.categoryList').classList.remove('hidden')
})
selectElement('.categoryList').addEventListener('mouseleave', () => {
  selectElement('.categoryList').classList.add('hidden')
})

selectElement('#MEN').addEventListener('click', async() => {
  const {items} = await getServerData()
  const filtering = items.filter(item => item.category === "MEN")
  console.log(filtering)
  makeProductList(filtering)
})

selectElement('#WOMEN').addEventListener('click', async() => {
  const {items} = await getServerData()
  const filtering = items.filter(item => item.category === "WOMEN")
  console.log(filtering)
  makeProductList(filtering)
})
selectElement('#KIDS').addEventListener('click', async() => {
  const {items} = await getServerData()
  const filtering = items.filter(item => item.category === "KIDS")
  console.log(filtering)
  makeProductList(filtering)
})


init();