document.addEventListener('DOMContentLoaded', function() {
    renderCheckoutSummary();
});

//取得購物車的內容
function getCart() {
    const wholecart = localStorage.getItem('Cart');
    if (!wholecart) return [];

    return wholecart.split('＊').map(itemStr => {
        const parts = itemStr.split('|');   
        return {
            name: parts[0],
            price: parseInt(parts[1]) || 0,
            image: parts[2]
        };
    });
}


function renderCheckoutSummary() {
    const cart = getCart();
    const summaryContainer = document.getElementById('checkout-items-list'); 
    const totalPriceElem = document.getElementById('total-price');
    
    if (!summaryContainer) return;

    const combinedCart = {};
    cart.forEach(item => {
        if (combinedCart[item.name]) {
            combinedCart[item.name].qty += 1;
        } else {
            combinedCart[item.name] = { ...item, qty: 1};
        }
    });

    let CheckoutHTML = '';
    let total = 0;
    Object.values(combinedCart).forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        CheckoutHTML += `
            <div class="checkout-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                <div style="display: flex; align-items: center;">
                    <img src="../assets/image/${item.image}" style="width: 60px; height: 60px; object-fit: cover; margin-right: 15px; border-radius: 5px;">
                    <div>
                        <div style="font-weight: bold; font-size: 1.1em;">${item.name}</div>
                        <div style="color: #666;">$${item.price} x ${item.qty}</div>
                    </div>
                </div>
                <div style="font-weight: bold; color: #999;">$${subtotal}</div>
            </div>
        `;
    });

    summaryContainer.innerHTML = CheckoutHTML || '';
    
    if (totalPriceElem) {
        totalPriceElem.textContent = `$${total}`;
    }


}
function clearCart(jumpto) {
    localStorage.removeItem("Cart");

    const count = document.getElementById('cart-count');
    if (count) {
        count.textContent = '0';
    }
    window.location.href = jumpto;
}

function SaveOrder() {
    const wholecart = localStorage.getItem('Cart');
    if (!wholecart || wholecart.trim() === "") return;

    let history = localStorage.getItem("OrderHistory") || "";

    if (history === "") {
        history = wholecart;
    } else {
        history = wholecart + "＃" + history;
    }
    
    localStorage.setItem("OrderHistory", history);
}

