document.addEventListener('DOMContentLoaded', function() {
    renderOrderHistory();
});

function renderOrderHistory() {

    const rawHistory = localStorage.getItem("OrderHistory");
    const container = document.getElementById("order-items-list");
    
    if (!container) return;

    if (!rawHistory || rawHistory.trim() === "") {
        container.innerHTML = '<p class="muted i18n" style="text-align:center; padding:20px;">Empty</p>';
        return;
    }

    const orders = rawHistory.split('＃');
    let finalHTML = '';

    orders.forEach((orderStr, index) => {
        if (!orderStr.trim()) return;

        const items = orderStr.split('＊').map(itemStr => {
            const parts = itemStr.split('|');
            return { 
                name: parts[0], 
                price: parseInt(parts[1]) || 0, 
                image: parts[2] 
            };
        });

        const combined = {};
        let orderTotal = 0;
        items.forEach(item => {
            if (combined[item.name]) {
                combined[item.name].qty++;
            } else {
                combined[item.name] = { ...item, qty: 1 };
            }
            orderTotal += item.price;
        });

        let orderItemsHTML = '';
        Object.values(combined).forEach(item => {
            const subtotal = item.price * item.qty; 
            orderItemsHTML += `
                <div class="order-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px dotted #eee;">
                    <div style="display: flex; align-items: center;">
                        <img src="../assets/image/${item.image}" style="width: 45px; height: 45px; object-fit: cover; margin-right: 12px; border-radius: 4px; border: 1px solid #eee;">
                        <div>
                            <div style="font-weight: bold; color: #333;">${item.name}</div>
                            <div style="color: #777; font-size: 0.85em;">$${item.price} x ${item.qty}</div>
                        </div>
                    </div>
                    <div style="font-weight: bold; color: #444;">$${subtotal}</div>
                </div>
            `;
        });

        finalHTML += `
            <div class="order-group" style="margin-bottom: 25px; border: 1px solid #ddd; border-radius: 8px; padding: 15px; background: #fff;">
                <div style="font-weight: bold; color: #888; margin-bottom: 10px; display: flex; justify-content: space-between; border-bottom: 2px solid #f9f9f9; padding-bottom: 5px;">
                    <span>No. #${orders.length - index}</span>
                    <span style="color: var(--accent-color);"> $${orderTotal}</span>
                </div>
                ${orderItemsHTML}
            </div>
        `;
    });

    container.innerHTML = finalHTML;
}

function toggleOrder() {
    const area = document.getElementById("order-display-area");
    const arrow = document.getElementById("order-arrow");
    
    if (!area || !arrow) return;

    if (area.style.display === "none" || area.style.display === "") {
        area.style.display = "block";
        arrow.textContent = "▲"; 
    } else {
        area.style.display = "none";
        arrow.textContent = "▼"; 
    }
}

window.toggleOrder = toggleOrder;