
let cart = [];
let cartCount = 0;

//加減產品頁面的購買數量 
function changeQty(n) {
    let input = document.getElementById('buy-qty');
    if (input) {
        let val = parseInt(input.value) + n;
        if (val < 1) val = 1; 
        input.value = val;
    }
}

// 加入購物車
function addToCart(name, price, image) {
    let qtyInput = document.getElementById('buy-qty');
    let qty = qtyInput ? parseInt(qtyInput.value) : 1;
    
    for(let i = 0; i < qty; i++) {
        cart.push({name, price, image});
        cartCount++;
    }
    
    document.getElementById('cart-count').textContent = cartCount;
    updateCart();
    document.getElementById('cart-panel').classList.add('open');
}

//移除的功能
function removeFromCart(name) {

    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        cart.splice(index, 1);
        cartCount--;
        document.getElementById('cart-count').textContent = cartCount;
        updateCart();
    }
}

//彈出右邊購物車
function toggleCart() {
    document.getElementById('cart-panel').classList.toggle('open');
}

//購物車
function updateCart() {
    const combinedCart = {};
    cart.forEach(item => {
        if (combinedCart[item.name]) {
            combinedCart[item.name].qty += 1;
        } else {
            combinedCart[item.name] = { ...item, qty: 1 };
        }
    });

    let cartHTML = '';
    Object.values(combinedCart).forEach((item) => {
        cartHTML += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                <div style="display: flex; align-items: center;">
                    <img src="../../assets/image/${item.image}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 12px; border-radius: 4px;">
                    <div>
                        <div style="font-weight: bold;">${item.name}</div>
                        <div style="color: #666; font-size: 0.9em;">$${item.price} x ${item.qty}</div>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.name}')" style="color: #ff4d4f; border: none; background: none; cursor: pointer; font-size: 16px;">移除</button>
            </div>
        `;
    });
    
    document.getElementById('cart-items').innerHTML = cartHTML || '<p style="text-align:center; color:#999; margin-top:20px;"><span class="i18n">購物車是空的</span></p>';
}



window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.changeQty = changeQty;