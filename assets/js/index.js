const $productList = document.querySelector(".app .product-list");
const $cartContainer = document.querySelector(".app .cart")
const $cartList = document.querySelector(".app .cart-list");

const selectedProducts = [];

async function getData() {
    const data = await fetch("data.json");
    const response = await data.json()
    return response
}

function createProductItem(imgSrc, id, name, type, price) {
    const productItem = `
        <li id="${id}" class="product-item">
          <img src="${imgSrc}" alt="Product Image" class="product-img">
          <div class="product-info">
            <p class="type">${type}</p>
            <p class="name">${name}</p>
            <p class="price">${price.toFixed(2)}</p>
            <button class="btn">
              <span class="btn-text">
                <img src="assets/images/icon-add-to-cart.svg" alt="">
                Add to Cart
              </span>
              <span class="amount">1</span>
              <img src="assets/images/icon-decrement-quantity.svg" alt="" class="decrement-icon">
              <img src="assets/images/icon-increment-quantity.svg" alt="" class="increment-icon">
            </button>
          </div>
        </li>
    `

    return $productList.innerHTML += productItem
}

function createCartItem(productElement) {
    const cartId = productElement.id
    const cartName = productElement.children[1].children[1].innerText
    const cartPrice = parseFloat(productElement.children[1].children[2].innerText)
    const cartAmount = parseFloat(productElement.children[1].children[3].innerText)

    const alreadyExists = selectedProducts.find(product => product.id === cartId)

    if (alreadyExists) return console.log("Este produto já se encontra no carrinho")

    const cartItem = `
        <li id="${cartId}" class="cart-item">
          <div class="cart-info">
            <strong class="name">${cartName}</strong>
            <div class="details">
              <span class="amount">${cartAmount}</span>
              <span class="price">${cartPrice}</span>
              <span class="total">${cartAmount * cartPrice}</span>
            </div>
          </div>
          <button class="remove-btn">
            <img src="assets/images/icon-remove-item.svg" alt="Remove Icon" class="remove-icon">
          </button>
        </li>
    `

    const cartItemObject = {
        id: cartId,
        name: cartName,
        price: cartPrice,
        amount: cartAmount
     }

    if (!alreadyExists) {
        !alreadyExists && selectedProducts.push(cartItemObject)
        $cartList.innerHTML += cartItem;
    }

    console.log("Cart criado com sucesso!")
}

function getAllProductInfo(seletor) {
    const $info = document.querySelectorAll(`.app ${seletor}`);

    return Array.from($info)
}

function activateProductBtn() {
    const productItems = getAllProductInfo(".product-item")
    const productItemBtns = getAllProductInfo(".product-item .btn")
    const productItemAmounts = getAllProductInfo(".product-item .btn .amount")
    const productDecrementBtns = getAllProductInfo(".product-item .btn .decrement-icon")
    const productIncrementBtns = getAllProductInfo(".product-item .btn .increment-icon")

    productItems.forEach((productItem, index) => {

        productDecrementBtns[index].addEventListener("click", (event) => {
            event.stopPropagation() // Impede que o evento de click do productItemBtns[index] aconteça

            let amount = parseInt(productItemAmounts[index].innerText)
            if (amount > 1) {
                amount--
                productItemAmounts[index].innerText = amount
            } else {
                // productItemBtns[index].disabled = true
                productItem.classList.remove("clicked")
            }
        })

        productIncrementBtns[index].addEventListener("click", () => {
            let amount = parseInt(productItemAmounts[index].innerText)
            if (amount >= 1) {
                amount++
                productItemAmounts[index].innerText = amount
            } else {
                productItemBtns[index].disabled = true
                productItem.classList.remove("clicked")
            }
        })

        productItemBtns[index].addEventListener("click", () => {
            !productItem.classList.contains("clicked")
            && productItem.classList.add ("clicked")

            createCartItem(productItem)

            $cartContainer.classList.contains("empty") && $cartContainer.classList.remove("empty")


        })



    })
}

async function init() {
    const data = await getData()

    data.forEach( product => {

        createProductItem(
            product.image.desktop,
            product.id,
            product.name,
            product.category,
            product.price
        )

        activateProductBtn()

    })
}

init()