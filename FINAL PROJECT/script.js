
const categories = [
    "Starters", "FastFood", "Indian", "Beverages", "Desserts", "Sweets"
];


const dishes = {
    "Starters": [
        {
            name: "Crispy Corn",
            price: 40,
            imageUrl: "crispycorn.jpeg"
        },
        {
            name: "Paneer Tikka",
            price: 60,
            imageUrl: "paneer tikka.jpeg"
        }
    ],
    "FastFood": [
        {
            name: "Pizza",
            price: 100,
            imageUrl: "pizza.jpeg"
        },
        {
            name: "French Fries",
            price: 50,
            imageUrl: "french.jpeg"
        }
    ],
    "Indian": [
        {
            name: "Dosa",
            price: 80,
            imageUrl: "dosa.jpeg"
        },
        {
            name: "Samosa",
            price: 30,
            imageUrl: "samosa.jpeg"
        }
    ],
    "Beverages": [
        {
            name: "Iced Tea",
            price: 30,
            imageUrl: "iced.jpeg"
        },
        {
            name: "Cold Coffee",
            price: 30,
            imageUrl: "cold.jpeg"
        }
    ],
    "Desserts": [
        {
            name: "Brownie",
            price: 50,
            imageUrl: "brown.jpeg"
        },
        {
            name: "Gulab Jamun",
            price: 15,
            imageUrl: "gulab-jamun.jpg"
        }
    ],
    "Sweets": [
        {
            name: "Rasmalai",
            price: 15,
            imageUrl: "rasmalai.jpeg"
        },
        {
            name: "Jalebi",
            price: 10,
            imageUrl: "jalebi.jpeg"
        }
    ]
};


let orderCart = {};
let recentOrders = [];


function renderCategories(selected = "Starters", onClickCategory) {
    const row = document.getElementById("categoriesRow");
    row.innerHTML = "";
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "category-btn" + (cat === selected ? " active" : "");
        btn.textContent = cat;
        btn.onclick = () => {
            if (onClickCategory) onClickCategory(cat);
            else renderCategories(cat);
        };
        row.appendChild(btn);
    });
}


function renderAddRemoveDish() {
    const content = document.querySelector('.tab-content');
    content.innerHTML = `
        <div class="add-remove-toggle">
            <button id="addTabBtn" class="toggle-btn active">Add</button>
            <button id="removeTabBtn" class="toggle-btn">Remove</button>
        </div>
        <div id="addRemoveForm"></div>
    `;
    renderAddForm();

    document.getElementById('addTabBtn').onclick = () => {
        setToggleActive('addTabBtn');
        renderAddForm();
    };
    document.getElementById('removeTabBtn').onclick = () => {
        setToggleActive('removeTabBtn');
        renderRemoveForm();
    };
}

function setToggleActive(activeId) {
    document.getElementById('addTabBtn').classList.remove('active');
    document.getElementById('removeTabBtn').classList.remove('active');
    document.getElementById(activeId).classList.add('active');
}


function renderAddForm() {
    const form = document.getElementById('addRemoveForm');
    form.innerHTML = `
        <form id="addDishForm" class="dish-form">
            <label>Category:
                <select id="dishCategory" required>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </label>
            <label>Dish Name:
                <input type="text" id="dishName" required />
            </label>
            <label>Image (optional):
                <input type="file" id="dishImage" accept="image/*" />
            </label>
            <label>Price (INR):
                <input type="number" id="dishPrice" min="1" required />
            </label>
            <button type="submit">Create</button>
        </form>
        <div id="addDishMsg"></div>
    `;

    document.getElementById('addDishForm').onsubmit = function(e) {
        e.preventDefault();
        const category = document.getElementById('dishCategory').value;
        const name = document.getElementById('dishName').value.trim();
        const price = document.getElementById('dishPrice').value;
        const imageInput = document.getElementById('dishImage');
        let imageUrl = "";

        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                imageUrl = evt.target.result;
                addDish(category, name, price, imageUrl);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            addDish(category, name, price, "");
        }
    };
}

function addDish(category, name, price, imageUrl) {
    dishes[category].push({ name, price, imageUrl });
    document.getElementById('addDishMsg').textContent = "Dish added!";
    setTimeout(() => { document.getElementById('addDishMsg').textContent = ""; }, 1500);
}

function renderRemoveForm() {
    const form = document.getElementById('addRemoveForm');
    form.innerHTML = `
        <form id="removeDishForm" class="dish-form">
            <label>Category:
                <select id="removeDishCategory" required>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </label>
            <label>Dishes:
                <select id="removeDishSelect" required>
                    <!-- Dishes will be populated here -->
                </select>
            </label>
            <button type="button" id="removeDishBtn" class="remove-btn">Remove</button>
        </form>
        <div id="removeDishMsg"></div>
    `;

   
    populateRemoveDishes();

  
    document.getElementById('removeDishCategory').onchange = populateRemoveDishes;

   
    document.getElementById('removeDishBtn').onclick = function() {
        const category = document.getElementById('removeDishCategory').value;
        const dishName = document.getElementById('removeDishSelect').value;
        if (!dishName) return;
        if (confirm(`Are you sure you want to remove "${dishName}" from ${category}?`)) {
            // Remove dish from array
            dishes[category] = dishes[category].filter(d => d.name !== dishName);
            document.getElementById('removeDishMsg').textContent = "Dish removed!";
            populateRemoveDishes();
            // If currently viewing this category in menu, update it
            if (document.getElementById('nav-menu').classList.contains('active')) {
                renderMenuTab(category);
            }
            setTimeout(() => { document.getElementById('removeDishMsg').textContent = ""; }, 1500);
        }
    };

    function populateRemoveDishes() {
        const category = document.getElementById('removeDishCategory').value;
        const dishSelect = document.getElementById('removeDishSelect');
        const dishList = dishes[category] || [];
        if (dishList.length === 0) {
            dishSelect.innerHTML = `<option value="">No dishes available</option>`;
            document.getElementById('removeDishBtn').disabled = true;
        } else {
            dishSelect.innerHTML = dishList.map(d => `<option value="${d.name}">${d.name}</option>`).join('');
            document.getElementById('removeDishBtn').disabled = false;
        }
    }
}


function renderMenuTab(selectedCategory = "Starters") {
    const content = document.querySelector('.tab-content');
    content.innerHTML = `
        <div class="dishes-list" id="dishesList"></div>
    `;
    renderDishesList(selectedCategory);

    
    renderCategories(selectedCategory, (cat) => {
        renderMenuTab(cat);
    });
}

function renderDishesList(category) {
    const list = document.getElementById('dishesList');
    if (!dishes[category] || dishes[category].length === 0) {
        list.innerHTML = `<div>No dishes in this category.</div>`;
        return;
    }
    list.innerHTML = dishes[category].map((dish, idx) => `
        <div class="dish-card clickable" data-category="${category}" data-idx="${idx}">
            ${dish.imageUrl ? `<img src="${dish.imageUrl}" alt="${dish.name}" class="dish-img" />` : ""}
            <div class="dish-info">
                <div class="dish-name">${dish.name}</div>
                <div class="dish-price">₹${dish.price}</div>
            </div>
        </div>
    `).join('');

    
    document.querySelectorAll('.dish-card.clickable').forEach(card => {
        card.onclick = function() {
            const cat = card.getAttribute('data-category');
            const idx = card.getAttribute('data-idx');
            const dish = dishes[cat][idx];
            if (!orderCart[dish.name]) {
                orderCart[dish.name] = { ...dish, category: cat, quantity: 1 };
            } else {
                orderCart[dish.name].quantity += 1;
            }
            // Add temporary click effect
            card.classList.add('clicked');
            setTimeout(() => card.classList.remove('clicked'), 150);
        };
    });
}


function setActiveNav(id) {
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

let total = 0;


function renderOrderTab() {
    const content = document.querySelector('.tab-content');
    const items = Object.values(orderCart);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // If no items, show empty message
    if (items.length === 0) {
        content.innerHTML = `<div class="order-list"><div>No items in order.</div></div>`;
        return;
    }

   
    if (window.orderPlaced) {
        content.innerHTML = `
            <div class="order-list">
                ${window.lastOrder.items.map(item => `
                    <div class="order-item">
                        <span class="order-dish">${item.name}</span>
                        <span class="order-qty">x${item.quantity}</span>
                        <span class="order-price">₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <b>Total:</b> ₹${window.lastOrder.total}
            </div>
            <button id="printBillBtn" class="print-btn">Print Bill</button>
        `;

       // ...inside the Print Bill button click handler...

document.getElementById('printBillBtn').onclick = function() {
   
    function pad2(n) { return n.toString().padStart(2, '0'); }
    const now = new Date();
   

    const order = window.lastOrder;
    const billHtml = `
        <html>
        <head>
            <title>Bill</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 32px; }
                .restro-name { font-size: 2.2rem; font-weight: bold; text-align: center; margin-bottom: 8px; }
                .bill-no { text-align: center; margin-bottom: 18px; font-size: 1.1rem; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
                th, td { border: 1px solid #444; padding: 8px 12px; text-align: center; }
                th { background: #f0f0f0; }
                .total-row td { font-weight: bold; }
                .regards { text-align: right; margin-top: 32px; font-size: 1.1rem; }
            </style>
        </head>
        <body>
            <div class="restro-name">Zaika Kitchen & Dining</div>
           
            <div class="bill-no">${order.date}</div>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Amount (₹)</th>
                </tr>
                ${order.items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price * item.quantity}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="2">Total</td>
                    <td>₹${order.total}</td>
                </tr>
            </table>
            <div class="regards">
                Regards,<br>
                Zaika Kitchen & Dining
            </div>
        </body>
        </html>
    `;

    const billWindow = window.open('', '', 'width=700,height=700');
    billWindow.document.write(billHtml);
    billWindow.document.close();
    billWindow.print();

    // After printing, clear order and reset state
    orderCart = {};
    window.orderPlaced = false;
    window.lastOrder = null;
    renderOrderTab();
};
        return;
    }


    content.innerHTML = `
        <div class="order-list">
            ${items.map(item => `
                <div class="order-item">
                    <span class="order-dish">${item.name}</span>
                    <span class="order-qty">
                        <button class="qty-minus" data-dish="${item.name}">-</button>
                        x${item.quantity}
                    </span>
                    <span class="order-price">₹${item.price * item.quantity}</span>
                </div>
            `).join('')}
        </div>
        <div class="order-total">
            <b>Total:</b> ₹${total}
        </div>
        <button id="placeOrderBtn" class="order-btn">Place Order</button>
    `;


    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.onclick = function() {
            const dishName = this.getAttribute('data-dish');
            if (orderCart[dishName]) {
                orderCart[dishName].quantity--;
                if (orderCart[dishName].quantity <= 0) {
                    delete orderCart[dishName];
                }
                renderOrderTab();
            }
        };
    });

 
    document.getElementById('placeOrderBtn').onclick = function() {
        if (Object.keys(orderCart).length === 0) return;
        const order = {
            date: new Date().toLocaleString(),
            items: Object.values(orderCart).map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: Object.values(orderCart).reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
        recentOrders.unshift(order);
        window.orderPlaced = true;
        window.lastOrder = order;
        renderOrderTab();
    };
}


function showPrintBill(order) {
    const printSection = document.getElementById('printBillSection');
    printSection.innerHTML = `
        <button id="printBillBtn" class="print-btn">Print Bill</button>
        <div class="bill-details" style="display:none;">
            <h3>Bill</h3>
            <div>${order.date}</div>
            <ul>
                ${order.items.map(item => `<li>${item.name} x${item.quantity} - ₹${item.price * item.quantity}</li>`).join('')}
            </ul>
            <div><b>Total:</b> ₹${order.total}</div>
        </div>
    `;
    document.getElementById('printBillBtn').onclick = function() {
        const billDetails = printSection.querySelector('.bill-details');
        billDetails.style.display = 'block';
        window.print();
        billDetails.style.display = 'none';
    };
}


function renderRecentOrdersTab() {
    const content = document.querySelector('.tab-content');
    if (recentOrders.length === 0) {
        content.innerHTML = `<div>No recent orders.</div>`;
        return;
    }
    content.innerHTML = `
        <div class="recent-orders-list">
            ${recentOrders.map((order, idx) => `
                <div class="recent-order-card">
                    <div class="recent-order-date">${order.date}</div>
                    <ul class="recent-order-list">
                        ${order.items.map(item => `
                            <li>${item.name} x${item.quantity} - ₹${item.price * item.quantity}</li>
                        `).join('')}
                    </ul>
                    <div class="recent-order-total"><b>Total:</b> ₹${order.total}</div>
                    <button class="delete-recent-btn" data-idx="${idx}">Delete</button>
                </div>
            `).join('')}
        </div>
    `;

   
    document.querySelectorAll('.delete-recent-btn').forEach(btn => {
        btn.onclick = function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            recentOrders.splice(idx, 1);
            renderRecentOrdersTab();
        };
    });
}


document.getElementById('nav-recent').onclick = () => {
    setActiveNav('nav-recent');
    document.getElementById("categoriesRow").style.display = "none";
    renderRecentOrdersTab();
};

function printBillPDF() {
    const items = Object.values(orderCart);
    let billWindow = window.open('', '', 'width=600,height=700');
    let total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    billWindow.document.write(`
        <html>
        <head>
            <title>Bill - Zaika Kitchen & Dining</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; }
                h2 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 30px; }
                th, td { border: 1px solid #4CAF50; padding: 10px; text-align: center; }
                th { background: #e8f5e9; }
                .total-row td { font-weight: bold; }
            </style>
        </head>
        <body>
            <h2>Zaika Kitchen & Dining</h2>
            <table>
                <tr>
                    <th>Dish</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                ${items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price * item.quantity}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="2">Total</td>
                    <td>₹${total}</td>
                </tr>
            </table>
        </body>
        </html>
    `);
    billWindow.document.close();
    billWindow.print();
}

window.onload = () => {
    // Initial state: Menu selected, show categories and menu
    setActiveNav('nav-menu');
    document.getElementById("categoriesRow").style.display = "flex";
    renderCategories("Starters", (cat) => renderMenuTab(cat));
    renderMenuTab("Starters");

    // Navbar event listeners
    document.getElementById('nav-menu').onclick = () => {
        setActiveNav('nav-menu');
        document.getElementById("categoriesRow").style.display = "flex";
        renderCategories("Starters", (cat) => renderMenuTab(cat));
        renderMenuTab("Starters");
    };
    document.getElementById('nav-order').onclick = () => {
        setActiveNav('nav-order');
        document.getElementById("categoriesRow").style.display = "none";
        renderOrderTab();
    };
    document.getElementById('nav-addremove').onclick = () => {
        setActiveNav('nav-addremove');
        document.getElementById("categoriesRow").style.display = "none";
        renderAddRemoveDish();
    };
    document.getElementById('nav-recent').onclick = () => {
        setActiveNav('nav-recent');
        document.getElementById("categoriesRow").style.display = "none";
        renderRecentOrdersTab();
    };

   
    document.getElementById('developerBtn').onclick = function() {
        document.getElementById('developerOverlay').classList.add('active');
    };
    document.getElementById('closeDeveloperOverlay').onclick = function() {
        document.getElementById('developerOverlay').classList.remove('active');
    };
    
};

