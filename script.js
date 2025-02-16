document.addEventListener('DOMContentLoaded', function(){
    let data=[]
    let cart=[]

    //fetching the json data
    fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        console.log(jsonData)
        showdesserts();
    })

    function showdesserts() {
        //function to populate the html with elements and resources drawn from the json file
        let output = "";
        if (data.length > 0){
            data.forEach((item, index) => {
                output += `
                        <div class="product">
                            <img src="${item.image}" alt="${item.image}" class="img1">
                            <button class="button" data-item-index="${index}" ><img id="butimg" src="./assets/images/icon-add-to-cart.svg">  Add to Cart</button>
                            <p class="category">${item.category}</p>
                            <p class="name">${item.name}</p>
                            <p class="price">
                                <span>&dollar;</span>
                                <span>${item.price.toFixed(2)}</span>
                            </p>
                        </div>    
                    `
            })
            document.querySelector(".tabs-cont").innerHTML = output;
            const buttons = document.querySelectorAll('.button').forEach(btn => {
                btn.addEventListener('click', function(){
                    const itemIndex = this.dataset.itemIndex
                    const selectedItem = data[itemIndex]
                    addItemToCart(selectedItem)
                    console.log(btn)
                    /* console.log(cart) */
                    /* this.innerHTML = `
                        <button class="red-qty">-</button>
                        <p class="qty">1</p>
                        <button class="inc-qty">+</button>
                    ` */
                    const buttonContainer = this.parentElement
                    this.style.display = 'none'

                    category = document.querySelectorAll('.category')
                    /* console.log(category[itemIndex]) */
                    category[itemIndex].style.marginTop = '30px'

                    const qtyBtn = document.createElement('div')
                    qtyBtn.classList.add('qty-btn')
                    qtyBtn.innerHTML = `
                        <button class="red-qty">-</button>
                        <p class="qty">1</p>
                        <button class="inc-qty">+</button>
                    `;

                    buttonContainer.appendChild(qtyBtn)
                    //creating the quantity buttons and giving them functionality
                    const incBtn = qtyBtn.querySelector('.inc-qty')
                    const redBtn = qtyBtn.querySelector('.red-qty')
                    const quantityValue = qtyBtn.querySelector('.qty')
                    quantity = 1
                    const img1 = document.querySelectorAll('.img1')
                    img1[itemIndex].style.border = '2px solid hsl(14, 86%, 42%)'
                    console.log(itemIndex)

                    incBtn.addEventListener('click', function(){
                        quantity= quantity+1
                        quantityValue.innerHTML = quantity
                        updateCartQuantity(selectedItem, quantity)
                        /* img1[itemIndex].style.border = '2px solid hsl(14, 86%, 42%)' */
                    })

                    redBtn.addEventListener('click', function(){
                        if(quantity > 1){
                            quantity= quantity-1
                            quantityValue.innerHTML = quantity
                            updateCartQuantity(selectedItem, quantity)
                        }else{
                            removeItemFromCart(selectedItem)
                            qtyBtn.style.display='none'
                            buttonContainer.querySelector('.button').style.display='inline'
                            category[itemIndex].style.marginTop = '-10px'
                            img1[itemIndex].style.border = 'none'
                        }
                    })
                })
            })
        }   
    }

    function addItemToCart(item){
        //function to add items to the cart and crosscheck if already selected
        const alreadyExists = cart.find(cartItem => cartItem.name === item.name)
        if(alreadyExists){
            alreadyExists.quantity++
        }else{
            cart.push({...item, quantity: 1, id: item.name})
        }
        updateCart(cart)
    }

    function removeItemFromCart(item){
        //function to remove items from the cart
        cart = cart.filter(cartItem => cartItem.id !== item.name)
        updateCart(cart)
    }

    function updateCart(items){
        //updating the cart display
        const cart_img = document.querySelector('#cartimg')
        const cart_text  = document.querySelector('#stxt2')
        const sub2 = document.querySelector('#sub2')
        const all_cart_items = document.querySelector('.all-cart-items')
        const cart_confirmation = document.querySelector('.cart-confirmation')
        const qno = document.querySelector('#stxt1')

        if(items.length === 0){
            sub2.innerHTML = `
                <div id="stxt1">Your Cart(<span id="listno">0</span>)</div>
                <img src="./assets/images/illustration-empty-cart.svg" id="cartimg">
                <div id="stxt2">Your added items will appear here</div><br>
                <div class="all-cart-items"></div>
                <div class="cart-confirmation"></div>
                <br>
            `
        } else{
            const sub_sect = document.querySelector('#sub2')
            cart_img.style.display = 'none'
            cart_text.style.display = 'none'

            let totalPrice = 0
            all_cart_items.innerHTML = ''
            cart_confirmation.innerHTML = ''
            qno.innerHTML = `Your Cart (${items.length})`

            items.forEach(item =>{
                const itemTotalPrice = (item.price * item.quantity).toFixed(2);
                totalPrice += parseFloat(itemTotalPrice);

                const cart_text = `
                    <div class="cart-items" data-item-id="${item.name}">
                        <div class="ct">
                            <div class="cta">${item.name}</div>
                            <div class="ctb"><span class="ctc">${item.quantity}x</span>${item.price.toFixed(2)} &dollar;${itemTotalPrice}</div>
                        </div>
                        <div class="cart-img2">
                            <img class="img3" src="./assets/images/icon-remove-item.svg">
                        </div>
                    </div><hr></hr>                    
                `
                all_cart_items.innerHTML += cart_text

                const cart_roundup = `
                    <div id="stxt3">
                        <div id="sa1">Order Total</div>
                        <div id="sa2">
                            <span>&dollar;${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                    <div id="stxt4"><img id="img2" src="./assets/images/icon-carbon-neutral.svg" >  This is a <strong>carbon neutral</strong> delivery</div>
                    <button class="confirm-order">Confirm Order</button>
                `
                cart_confirmation.innerHTML = cart_roundup

                document.querySelectorAll('.cart-img2').forEach(del =>{
                    del.addEventListener('click', function(){
                        const itemId = this.closest('.cart-items').dataset.itemId
                        const deleteitem = cart.find(cartItem => cartItem.id === itemId)
                        removeItemFromCart(deleteitem)
                    })
                })
            })
            document.querySelector('.confirm-order').addEventListener('click', function() {
                const modalOverlay = document.querySelector('.modal-overlay');
                
                // Clear any previous modal container if it exists
                const existingModalContainer = document.querySelector('.modal-container');
                if (existingModalContainer) {
                    existingModalContainer.remove(); // Remove any previous content
                }
                
                // Ensure cart is not empty
                if (cart.length === 0) {
                    console.log('Cart is empty, no order to confirm.');
                    return; // Don't show the modal if the cart is empty
                }
            
                // Create a new modal container
                const modalContainer = document.createElement('div');
                modalContainer.classList.add('modal-container');
            
                // Generate HTML for cart items
                let cartHTML = '';
                let totalPrice = 0;
            
                cart.forEach(item => {
                    totalPrice += item.price * item.quantity;
                    
                    // Ensure that only valid items are added to the modal
                    if (item.name && item.quantity) {
                        cartHTML += `
                        <div class="modal-cart-item">
                            <img class="dessert-img" src="${item.image}" alt="${item.name}" />
                            <div class="confirmed-cart-text">
                              <div class="confirmed-cart-price">
                                <p class="conf-item-name">${item.name}</p>
                                <div class="confirmed-cart-quantity">
                                    <p class="pq1">${item.quantity}x</p>
                                    <p class="pq2">   @$${item.price.toFixed(2)}</p>
                                </div>
                              </div>
                              <p class="pq3">$${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                        `;
                    }
                });
            
                // Add the cart items and total price to the modal content
                modalContainer.innerHTML = `
                <img class="img4" src="./assets/images/icon-order-confirmed.svg" alt="Confirm sign"/>
                <div class="confirm-order-title">
                    <h3 class="bi1">Order Confirmed</h3>
                    <p class="bi2">We hope you enjoy your food!</p>
                </div>
                <div class="modal-cart-items">
                    ${cartHTML}
                    <div class="modal-total-order-container">
                        <p class="bi3">Order Total</p>
                        <p class="pq3">$${totalPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div class="d1">
                    <a href="index.html" class="start-new-btn">Start New Order</a>
                </div>
                
                `;
            
                // Append the modal container to the modal overlay
                modalOverlay.appendChild(modalContainer);
            
                // Open the modal
                modalOverlay.classList.add('open-modal');
            
                // Handle closing the modal and resetting the cart and buttons
                document.querySelector('.start-new-btn').addEventListener('click', function() {
                    modalOverlay.classList.remove('open-modal');
                    modalOverlay.innerHTML = ''; // Clear the modal content
            
                    // Clear the cart
                    cart = [];
                    updateCart(cart); // Reset the cart display
            
                    // Reset activated buttons
                    document.querySelectorAll('.qty-btn').forEach(qtyBtn => {
                        const btnContainer = qtyBtn.parentElement;
                        qtyBtn.remove(); // Remove quantity buttons
                        btnContainer.querySelector('.button').style.display = 'inline'; // Show Add to Cart buttons
                    });
                });
            });
        }
    }
    function updateCartQuantity(item, newQuantity) {
        const cartItem = cart.find(cartItem => cartItem.name === item.name);
    
        if (cartItem) {
            cartItem.quantity = newQuantity; // Update the quantity in the cart
        }
    
        updateCart(cart); // Refresh the cart display with the updated quantity
    }
})












/* let http = new XMLHttpRequest();

http.open('get', 'data.json', true);
http.send();

http.onload = function(){
    if (this.readyState == 4 & this.status == 200){
        let products = JSON.parse(this.responseText);
        console.log(products)
        let output = "";
        for(let item of products){
            output += `
                <div class="product">
                    <img src="${item.image}" alt="${item.image}" id="img1">
                    <button class="button"><img id="butimg" src="./assets/images/icon-add-to-cart.svg">  Add to Cart</button>
                    <p class="category">${item.category}</p>
                    <p class="name">${item.name}</p>
                    <p class="price">
                        <span>&dollar;</span>
                        <span>${item.price.toFixed(2)}</span>
                    </p>
                </div>    
            `
        }
        document.querySelector(".tabs-cont").innerHTML = output;
    }
} */











/* let http = new XMLHttpRequest();

http.open('get', 'data.json', true);
http.send();

http.onload = function(){
    if (this.readyState == 4 & this.status == 200){
        let products = JSON.parse(this.responseText);
        let output = "";
        for(let item of products){
            output += `
                <div class="product">
                    <img src="${item.image}" alt="${item.image}" id="img1">
                    <button class="button"><img id="butimg" src="./assets/images/icon-add-to-cart.svg">  Add to Cart</button>
                    <p class="category">${item.category}</p>
                    <p class="name">${item.name}</p>
                    <p class="price">
                        <span>&dollar;</span>
                        <span>${item.price.toFixed(2)}</span>
                    </p>
                </div>    
            `
        }
        document.querySelector(".tabs-cont").innerHTML = output;
    }
} */

