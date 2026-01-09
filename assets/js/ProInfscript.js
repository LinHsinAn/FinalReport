document.addEventListener('DOMContentLoaded', function() {
    InitialCart();

    const stars = document.querySelectorAll('#star-input span');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            currentRating = this.getAttribute('data-value');
            Star();
        });
    });

    renderLocalComments();
});

let cart = loadCart();
let cartCount = cart.length;

let currentRating = 5;

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
                <button onclick="removeFromCart('${item.name}')" style="color: #ff4d4f; border: none; background: none; cursor: pointer; font-size: 24px;">🗑︎</button>
            </div>
        `;
    });
    
    document.getElementById('cart-items').innerHTML = cartHTML || '<p style="text-align:center; color:#999; margin-top:20px;"><span class="i18n">購物車是空的</span></p>';
}

function getProductName() {
    return typeof CURRENT_PRODUCT_ID !== 'undefined' ? CURRENT_PRODUCT_ID : "DefaultProduct";
}
//用來對星星要幾顆 因為網頁已經有了span才能成
function Star() {
    const stars = document.querySelectorAll('#star-input span');
    stars.forEach(star => {
        if (star.getAttribute('data-value') <= currentRating) {

            star.textContent = '★';
        } else {
            star.textContent = '☆';
        }
    });
}
//送出評論
function submitComment() {
    const text = document.getElementById('my-comment-text').value;
    if (!text.trim()) {
        alert("請輸入評論內容！\nPlease type in the comment content!");
        return;
    }
    
    const productName = getProductName();  //純粹為了確認是否有評論的 const (用於member那邊)
    
    localStorage.setItem(`CommentStar_${productName}`, currentRating);
    localStorage.setItem(`CommentText_${productName}`, text);

    let reviewed = localStorage.getItem("ReviewedProducts") || "";
    if (!reviewed.split(',').includes(productName)) {
        reviewed = (reviewed === "") ? productName : reviewed + "," + productName;
        localStorage.setItem("ReviewedProducts", reviewed);
    }

    renderLocalComments();
    alert("評論已儲存！\nComment saved!");
}

function renderLocalComments() {
    const productName = getProductName();

    const savedStar = localStorage.getItem(`CommentStar_${productName}`);
    const savedText = localStorage.getItem(`CommentText_${productName}`);
    
    const formArea = document.getElementById('my-comment-form');
    const displayArea = document.getElementById('my-comment-display');
    
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const userName = user ? user.name : "You";

    if (!displayArea || !formArea) 
        return;

    if (savedText) {
        const starStr = '★'.repeat(savedStar) + '☆'.repeat(5 - savedStar);
        displayArea.innerHTML = `
            <div>
                <h3 class="comment-title" >${userName}</h3>
                <h3 class="comment-title">${starStr}</h3>
                <p class="comment-text">
                    ${savedText}
                </p>
                <br>
                <button onclick="toggleCommentEdit(true)" style="postion: relative; right: 3%; background: var(--accent-color); color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer;">
                    編輯 Edit
                </button>
            </div>
        `;

        displayArea.style.display = 'flex';
        formArea.style.display = 'none';

        const inputField = document.getElementById('my-comment-text');
        if (inputField && !inputField.value) {
            inputField.value = savedText;
        }

    } else {

        displayArea.style.display = 'none';
        formArea.style.display = 'block';
    }
}
function toggleCommentEdit(show) {
    const displayArea = document.getElementById('my-comment-display');
    const formArea = document.getElementById('my-comment-form');
    
    if (show) {
        displayArea.style.display = 'none';
        formArea.style.display = 'block';
    } else {
        renderLocalComments();
    }
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.changeQty = changeQty;