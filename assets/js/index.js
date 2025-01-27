const $productList = document.querySelector(".app .product-list");
const $cartContainer = document.querySelector(".app .cart")
const $cartList = document.querySelector(".app .cart-list");
const $cartConfirmBtn = document.querySelector(".app .cart .confirm-btn");
const $confirmModalContainer = document.querySelector(".app .confirm-modal");
const $confirmModalList = document.querySelector(".app .confirm-modal-list");
const $confirmModalBtn = document.querySelector(".app .confirm-modal-btn");

let cartItems = [];

async function getData() {
    const data = await fetch("./public/data.json");
    const response = await data.json()
    return response
}

function createAndListProductItems(imgSrc, id, name, type, price) {


    const productItem = `
        <li id="${id}" class="product-item">
          <img src="${imgSrc}" alt="Product Image" class="product-img">
          <div class="product-info">
            <p class="type">${type}</p>
            <p class="name">${name}</p>
            <p class="price">${price.toFixed(2)}</p>
            <button class="btn">
              <p class="btn-text">

                <svg class="btn-text-icon" xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none" viewBox="0 0 21 20"><g fill="#C73B0F" clip-path="url(#a)"><path d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z"/><path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M.333 0h20v20h-20z"/></clipPath></defs></svg>

                <span class="btn-text-label">Add to Cart</span>
              </p>
              <span class="amount">1</span>

              <svg class="decrement-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>

              <svg class="increment-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
            </button>
          </div>
        </li>
    `

    $productList.innerHTML += productItem

    activateProductBtn()
}

function createCartItem(productElement) {
    const cartId = parseInt(productElement.id)
    const cartImgSrc = productElement.querySelector(".product-img").src;
    const cartName = productElement.querySelector(".name").innerText;
    const cartPrice = parseFloat(productElement.querySelector(".price").innerText)
    const cartAmount = parseFloat(productElement.querySelector(".amount").innerText)

    // console.log(cartName)
    // console.log(cartPrice)
    // console.log(cartAmount)

    const alreadyExists = cartItems.find(item => item.id == cartId)

    if (alreadyExists) return

    const cartItemObject = {
        id: cartId,
        name: cartName,
        price: cartPrice,
        amount: cartAmount,
        total: cartPrice * cartAmount,
        imgSrc: cartImgSrc
     }

    return cartItems.push(cartItemObject)

}

function listCartItems() {
    $cartList.innerHTML = ""

    cartItems.forEach(item => {
        const cartItem = `
        <li id="${item.id}" class="cart-item">
          <div class="cart-info">
            <strong class="name">${item.name}</strong>
            <div class="details">
              <span class="amount">${item.amount}</span>
              <span class="price">${item.price.toFixed(2)}</span>
              <span class="total">${item.total.toFixed(2)}</span>
            </div>
          </div>
          <button class="remove-btn">
            <svg class="remove-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
          </button>
        </li>
        `

        $cartList.innerHTML += cartItem
    })

    activateCartRemoveBtn()
}

function removeItemFromCart(productItem) {
    cartItems = cartItems.filter(cartItem => cartItem.id != productItem.id)
}

function updateCartItemInfo(productItem, amount) {
    const selectedCartItem = cartItems.find( item => item.id == productItem.id)
    selectedCartItem.amount = amount
    selectedCartItem.total = selectedCartItem.price * amount
}

function updateCountingOrder() {
    const countingValueElement = document.querySelector(
        ".cart .counting"
    );

    const countingValue = cartItems.reduce( (sum, item) => {
        return sum + item.amount
    }, 0 )

    countingValueElement.innerText = countingValue
}

function updateTotalOrder(className = "cart") {

    const totalValueElement = document.querySelector(
        `.${className} .total-value`);

    const totalValue = cartItems.reduce( (sum, item) => {
            return sum + item.total
    }, 0 )

    totalValueElement.innerText = totalValue.toFixed(2)

}

function activateProductBtn() {
    const productItems = document.querySelectorAll(".product-item")
    const productItemBtns = document.querySelectorAll(".product-item .btn")
    const productItemAmounts = document.querySelectorAll(".product-item .btn .amount")
    const productDecrementBtns = document.querySelectorAll(".product-item .btn .decrement-icon")
    const productIncrementBtns = document.querySelectorAll(".product-item .btn .increment-icon")

    productItems.forEach((productItem, index) => {

        productItemBtns[index].addEventListener("click", () => {
            !productItem.classList.contains("clicked")
            && productItem.classList.add ("clicked")

            createCartItem(productItem)
            listCartItems();
            updateTotalOrder();
            updateCountingOrder();

            $cartContainer.classList.contains("empty") && $cartContainer.classList.remove("empty")

        })

        productDecrementBtns[index].addEventListener("click", (event) => {
            event.stopPropagation() // Impede que o evento de click do productItemBtns[index] aconteça

            let amount = parseInt(productItemAmounts[index].innerText)
            if (amount > 1) {
                amount--
                productItemAmounts[index].innerText = amount;
                updateCartItemInfo(productItem, amount);
                listCartItems();
                updateTotalOrder();
                updateCountingOrder();
            } else {
                productItem.classList.remove("clicked")
                removeItemFromCart(productItem)
                listCartItems();
                updateTotalOrder()
                updateCountingOrder();
                cartItems.length === 0 && $cartContainer.classList.add("empty")
            }
        })

        productIncrementBtns[index].addEventListener("click", (event) => {
            event.stopPropagation() // Impede que o evento de click do productItemBtns[index] aconteça

            let amount = parseInt(productItemAmounts[index].innerText)
            amount++
            productItemAmounts[index].innerText = amount
            updateCartItemInfo(productItem, amount)
            listCartItems()
            updateTotalOrder()
            updateCountingOrder();
        })

    })
}

function activateCartRemoveBtn() {
    const cartItemBtns = document.querySelectorAll(".cart-item .remove-btn");

    cartItemBtns.forEach((removeBtn) => {
        removeBtn.addEventListener("click", () => {
            const cartItemElement = removeBtn.closest(".cart-item");
            const cartItemId = parseInt(cartItemElement.id)

            const selectedProduct = document.querySelector(
                `.product-item[id="${cartItemId}"]`
            );

            const selectedProductAmount = document.querySelector(
                `.product-item[id="${cartItemId}"] .amount`
            );

            selectedProductAmount.innerText = 1
            updateCartItemInfo(selectedProduct, 1)

            removeItemFromCart(cartItemElement)
            listCartItems();
            updateTotalOrder();
            updateCountingOrder();

            selectedProduct.classList.contains("clicked") && selectedProduct.classList.remove("clicked")
            cartItems.length === 0 && $cartContainer.classList.add("empty")

        })
    })

}

function createConfirmModal() {

    cartItems.forEach(item => {
        const orderItem = `
        <li class="confirm-modal-item">
              <div class="confirm-modal-info">
                <img class="confirm-modal-thumb" src="${item.imgSrc}" alt="${item.name} Thumbnail" />
                <div class="confirm-modal-details">
                  <strong class="confirm-modal-name">${item.name}</strong>
                  <div class="confirm-modal-wrapper">
                    <span class="confirm-modal-amount">${item.amount}</span>
                    <span class="confirm-modal-price">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <span class="confirm-modal-total">${item.total.toFixed(2)}</span>
        </li>
     `

     $confirmModalList.innerHTML += orderItem;
    })

    $confirmModalContainer.classList.add("clicked");
    $confirmModalBtn.addEventListener("click", resetOrder)

    updateTotalOrder("confirm-modal")

}

function confirmOrder() {
    createConfirmModal()
}

function resetOrder() {
    cartItems = []

    $confirmModalList.innerHTML = ""

    listCartItems();
    updateTotalOrder()
    updateCountingOrder();

    const selectedProducts = document.querySelectorAll(".product-item.clicked");

    selectedProducts.forEach( product => {
        console.log(product)
        console.log(product.querySelector(".amount"))

        product.classList.remove("clicked")
        product.querySelector(".amount").innerText = 1




    })

    $confirmModalContainer.classList.remove("clicked")

    cartItems.length === 0 && $cartContainer.classList.add("empty")
    console.log(cartItems)
}

async function init() {

    const isMobile = window.screen.width <= 720

    const data = await getData()

    data.forEach( product => {

        createAndListProductItems(
            isMobile ? product.image.mobile : product.image.desktop,
            product.id,
            product.name,
            product.category,
            product.price
        )

    })

    $cartConfirmBtn.addEventListener("click", confirmOrder)
}

init()