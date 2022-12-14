// import { addToDb, putToDb } from "./indexed_db";
// import {
//     // getUrlParams,
//     // checkUrlParams,
//     // createNavbar,
//     addCommas
// } from "./useful-function.js";

//import { removeCommas } from "./cart";

const param = window.location.pathname.slice(9, -1)

const imageUrl = document.getElementById('gImage')
const price = document.getElementById('goodsPrice')
const bName = document.getElementById('brandName')
const gName = document.getElementById('goodsName')
const code = document.getElementById('goodsCode')
const size = document.getElementById('productSize')
const goodsType = document.getElementById('productType')
const addToCartButton = document.getElementById('cartButton')
const goodsContent = document.getElementById('content')
const purchaseButton = document.getElementById('purchaseButton')
const goToCart = document.getElementById('goToCart')
recieveData()

async function recieveData() {
    await fetch(`/api/product/${param}`)
        .then((res) => res.json())
        .then((data) => {
            //console.log(data);
            imageUrl.src = data.imageUrl
            price.innerText = `${addCommas(data.price)}`
            console.log(data.brand)
            bName.innerText = data.brand
            gName.innerText = data.name
            code.innerText = data.code
            size.innerText = data.size
            goodsType.innerText = data.category
            goodsContent.innerText = data.content

            const product = data

            addToCartButton.addEventListener('click', async () => {
                try {
                    await insertDb(product)
                    console.log(product)
                    alert('장바구니에 추가되었습니다.')
                } catch (err) {
                    // Key already exists 에러면 아래와 같이 alert함
                    if (err.message.includes('Key')) {
                        alert('이미 장바구니에 추가되어 있습니다.')
                    }

                    console.log(err)
                }
            })

            purchaseButton.addEventListener('click', async () => {
                try {
                    await insertDb(product)

                    window.location.href = '/order'
                } catch (err) {
                    console.log(err)

                    //insertDb가 에러가 되는 경우는 이미 제품이 장바구니에 있던 경우임
                    //따라서 다시 추가 안 하고 바로 order 페이지로 이동함
                    window.location.href = '/order'
                }
            })
        })
}

//
async function insertDb(product) {
    // 객체 destructuring
    const { code, price } = product

    // 장바구니 추가 시, indexedDB에 제품 데이터 및
    // 주문수량 (기본값 1)을 저장함.
    await addToDb('cart', { ...product, quantity: 1 }, code)

    // 장바구니 요약(=전체 총합)을 업데이트함.
    await putToDb('order', 'summary', (data) => {
        // 기존 데이터를 가져옴
        const count = data.productsCount
        const total = parseInt(data.productsTotal)
        const ids = data.ids
        const selectedIds = data.selectedIds

        // 기존 데이터가 있다면 1을 추가하고, 없다면 초기값 1을 줌
        data.productsCount = count ? count + 1 : 1

        // 기존 데이터가 있다면 가격만큼 추가하고, 없다면 초기값으로 해당 가격을 줌
        data.productsTotal = total ? total + price : price

        // 기존 데이터(배열)가 있다면 id만 추가하고, 없다면 배열 새로 만듦
        data.ids = ids ? [...ids, code] : [code]

        // 위와 마찬가지 방식
        data.selectedIds = selectedIds ? [...selectedIds, code] : [code]
    })
}

let database

// indexedDB에 연결하고, 연결 성공 시 데이터베이스 객체를
// Promise로 감싸 반환함.
const openDatabase = () => {
    const db = new Promise((resolve, reject) => {
        const onRequest = indexedDB.open('shopping', 1)
        onRequest.onupgradeneeded = () => {
            console.log('indexeddb의 업그레이드가 이루어집니다.')
            const database = onRequest.result

            database.createObjectStore('cart', {
                autoIncrement: true,
            })

            database.createObjectStore('order', {
                autoIncrement: true,
            })
        }

        onRequest.onsuccess = async () => {
            console.log('indexeddb가 정상적으로 시작되었습니다.')

            resolve(onRequest.result)
        }

        onRequest.onerror = () => {
            const err = onRequest.error
            console.log(
                `indexeddb를 시작하는 과정에서 오류가 발생하였습니다: ${err}`
            )

            reject(err)
        }
    })

    return db
}

// indexedDB에 저장된 값을 가져옴
const getFromDb = async (storeName, key = '') => {
    // database 변수가 아직 초기화가 되어있지 않다면,
    // openDatabase 함수를 실행하여 데이터베이스 객체를 할당함.
    if (!database) {
        database = await openDatabase()
    }

    const transaction = database.transaction([storeName])
    const store = transaction.objectStore(storeName)

    const data = new Promise((resolve, reject) => {
        // key가 주어졌다면 key에 해당하는 특정 아이템만,
        // key가 없다면 모든 아이템을 가져옴
        const getRequest = key ? store.get(key) : store.getAll()

        getRequest.onsuccess = () => {
            resolve(getRequest.result)
        }

        getRequest.onerror = () => {
            const err = getRequest.error
            console.log(
                `${storeName}에서 가져오는 과정에서 오류가 발생하였습니다: ${err}`
            )

            reject(err)
        }
    })

    return data
}

// indexedDB에 저장함
const addToDb = async (storeName, entry, key = '') => {
    // database 변수가 아직 초기화가 되어있지 않다면,
    // openDatabase 함수를 실행하여 데이터베이스 객체를 할당함.
    if (!database) {
        database = await openDatabase()
    }
    const transaction = database.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    const result = new Promise((resolve, reject) => {
        // key가 주어졌다면 해당 key로 db에 추가하고,
        // key가 없다면, 기본 설정대로 autoincrement(1, 2, 3 ... 순서)로
        // key를 설정하여 추가함.
        const addRequest = key ? store.add(entry, key) : store.add(entry)

        addRequest.onsuccess = () => {
            console.log(`${storeName}에 정상적으로 추가되었습니다.`)
            resolve()
        }

        addRequest.onerror = () => {
            const err = addRequest.error
            console.log(
                `${storeName}에 추가하는데 오류가 발생하였습니다: ${err}`
            )

            reject(err)
        }
    })

    return result
}

// indexedDB의 데이터를 수정함
const putToDb = async (storeName, key, dataModifyFunc) => {
    // database 변수가 아직 초기화가 되어있지 않다면,
    // openDatabase 함수를 실행하여 데이터베이스 객체를 할당함.
    if (!database) {
        database = await openDatabase()
    }

    const transaction = database.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    const result = new Promise((resolve, reject) => {
        // 우선 현재 데이터를 가져옴 (데이터 없을 시, 빈 객체 할당)
        const getRequest = store.get(key)

        // 가져온 다음 수정 진행
        getRequest.onsuccess = () => {
            const data = getRequest.result || {}
            // 데이터 수정
            dataModifyFunc(data)

            // 수정한 데이터 삽입
            const putRequest = store.put(data, key)

            putRequest.onsuccess = () => {
                console.log(`${storeName}가 정상적으로 수정되었습니다.`)
                resolve()
            }

            putRequest.onerror = () => {
                const err = putRequest.error
                console.log(
                    `${storeName}를 수정하는데 에러가 발생하였습니다: ${err} `
                )

                reject(err)
            }
        }
    })

    return result
}

// indexedDB의 데이터를 삭제함
const deleteFromDb = async (storeName, key = '') => {
    // database 변수가 아직 초기화가 되어있지 않다면,
    // openDatabase 함수를 실행하여 데이터베이스 객체를 할당함.
    if (!database) {
        database = await openDatabase()
    }

    const transaction = database.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    const result = new Promise((resolve, reject) => {
        // key가 주어졌다면 key에 해당하는 특정 아이템만,
        // key가 없다면 모든 아이템을 삭제함
        const deleteRequest = key ? store.delete(key) : store.clear()

        deleteRequest.onsuccess = () => {
            console.log(`${storeName}에서 정상적으로 삭제되었습니다.`)
            resolve()
        }

        deleteRequest.onerror = () => {
            const err = deleteRequest.error
            console.log(
                `${storeName}에서 삭제하는데 에러가 발생하였습니다: ${err} `
            )

            reject(err)
        }
    })

    return result
}

//숫자에 쉼표를 추가함. (10000 -> 10,000)
export const addCommas = (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'
}

//checkUrlParams("id");
// addAllElements();
// addAllEvents();

// html에 요소를 추가하는 함수들을 묶어주어서 코드를 깔끔하게 하는 역할임.
// function addAllElements() {
//     createNavbar();
//     insertProductData();
// }

// addEventListener들을 묶어주어서 코드를 깔끔하게 하는 역할임.
// function addAllEvents() { }

// async function insertProductData() {
//     const { id } = getUrlParams();
//     const product = await Api.get(`/api/products/${id}`);

//     // 객체 destructuring
//     const {
//         title,
//         detailDescription,
//         manufacturer,
//         imageKey,
//         isRecommended,
//         price,
//     } = product;
//     const imageUrl = await getImageUrl(imageKey);

//     productImageTag.src = imageUrl;
//     titleTag.innerText = title;
//     detailDescriptionTag.innerText = detailDescription;
//     manufacturerTag.innerText = manufacturer;
//     priceTag.innerText = `${addCommas(price)}원`;

//     if (isRecommended) {
//         titleTag.insertAdjacentHTML(
//             "beforeend",
//             '<span class="tag is-success is-rounded">추천</span>'
//         );
//     }

//     addToCartButton.addEventListener("click", async () => {
//         try {
//             await insertDb(product);

//             alert("장바구니에 추가되었습니다.");
//         } catch (err) {
//             // Key already exists 에러면 아래와 같이 alert함
//             if (err.message.includes("Key")) {
//                 alert("이미 장바구니에 추가되어 있습니다.");
//             }

//             console.log(err);
//         }
//     });

//     purchaseButton.addEventListener("click", async () => {
//         try {
//             await insertDb(product);

//             window.location.href = "/order";
//         } catch (err) {
//             console.log(err);

//             //insertDb가 에러가 되는 경우는 이미 제품이 장바구니에 있던 경우임
//             //따라서 다시 추가 안 하고 바로 order 페이지로 이동함
//             window.location.href = "/order";
//         }
//     });
// }
