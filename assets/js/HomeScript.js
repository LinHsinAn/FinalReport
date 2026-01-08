document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    /*hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });*/

    InitialCart();
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    /*
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 50);

        const countElem = document.getElementById('cart-count');
        if (countElem)
             countElem.textContent = cart.length;
        updateCart();
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    */
});


let cart = loadCart();
let cartCount = cart.length;


//儲存購物車內的內容  //localStorage 又是你
function saveCart() {
    const cartString = cart.map(item => `${item.name}|${item.price}|${item.image}`).join('＊');
    localStorage.setItem('Cart', cartString);
}
//載入購物車的內容
function loadCart() {
    const wholecart = localStorage.getItem('Cart');
    if (!wholecart)
         return [];

    return wholecart.split('＊').map(itemStr => {
        const parts = itemStr.split('|');   
        return {
            name: parts[0],
            price: parts[1],
            image: parts[2]
        };
    });
}

//進網頁後把購物車裡該有的內容更新出來
function InitialCart() {
    const count = document.getElementById('cart-count');
    if (count) {
        count.textContent = cart.length; 
    }
    updateCart(); 
}


//加減產品頁面的購買數量 
function changeQty(n) {
    let input = document.getElementById('buy-qty');
    if (input) {
        let val = parseInt(input.value) + n;
        if (val < 1) val = 1; 
        input.value = val;
    }
}

//加入購物車
function addToCart(name, price, image) {
    let qtyInput = document.getElementById('buy-qty');
    let qty = qtyInput ? parseInt(qtyInput.value) : 1;
    
    for(let i = 0; i < qty; i++) {
        cart.push({name, price, image});
        cartCount++;
    }
    
    saveCart(cart);

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
        saveCart(cart);

        document.getElementById('cart-count').textContent = cartCount;
        updateCart();
    }
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
                    <img src="../assets/image/${item.image}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 12px; border-radius: 4px;">
                    <div>
                        <div style="font-weight: bold;">${item.name}</div>
                        <div style="color: #666; font-size: 0.9em;">$${item.price} x ${item.qty}</div>
                    </div>
                </div>
                <button onclick="removeFromCart('${item.name}')" style="color: #ff4d4f; border: none; background: none; cursor: pointer; font-size: 24px;"><span class="i18n"> 🗑︎ </span></button>
            </div>
        `;
    });
    
    document.getElementById('cart-items').innerHTML = cartHTML || '<p style="text-align:center; color:#999; margin-top:20px;"><span class="i18n"> 購物車是空的 </span></p>';
}
//彈出右邊購物車
function toggleCart() {
    document.getElementById('cart-panel').classList.toggle('open');
}




window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.changeQty = changeQty;