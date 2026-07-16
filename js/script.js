document.addEventListener("DOMContentLoaded", () => {
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
if (navToggle && mainNav) {
navToggle.addEventListener("click", () => {
mainNav.classList.toggle("is-open");
});
}
const toast = document.getElementById("toast");
let toastTimer = null;
function showToast(message) {
if (!toast) return;
toast.textContent = message;
toast.classList.add("is-visible");
clearTimeout(toastTimer);
toastTimer = setTimeout(() => {
toast.classList.remove("is-visible");
}, 2500);
}
const CART_KEY = "beanBoutiqueCart";
function getCart() {
try {
const raw = localStorage.getItem(CART_KEY);
return raw ? JSON.parse(raw) : [];
} catch (e) {
return [];
}
}
function saveCart(cart) {
localStorage.setItem(CART_KEY, JSON.stringify(cart));
updateCartNavCount();
}
function addToCart(name, price) {
const cart = getCart();
const existing = cart.find(item => item.name === name);
if (existing) {
existing.qty += 1;
} else {
cart.push({ name, price, qty: 1 });
}
saveCart(cart);
showToast(`${name} added to your cart`);
}
function updateCartNavCount() {
const cart = getCart();
const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
document.querySelectorAll("#cartNavCount").forEach(el => {
el.textContent = totalItems;
});
}
updateCartNavCount();
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
btn.addEventListener("click", () => {
const name = btn.dataset.name;
const price = parseFloat(btn.dataset.price);
if (name && !isNaN(price)) {
addToCart(name, price);
}
});
});
const cartBody = document.getElementById("cartBody");
if (cartBody) {
const cartTable = document.getElementById("cartTable");
const cartSummary = document.getElementById("cartSummary");
const cartEmptyMsg = document.getElementById("cartEmptyMsg");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartDeliveryEl = document.getElementById("cartDelivery");
const cartTotalEl = document.getElementById("cartTotal");
const DELIVERY_FEE = 8000;
function formatMoney(n) {
return `MK ${Math.round(n).toLocaleString("en-US")}`;
}
function renderCartPage() {
const cart = getCart();
cartBody.innerHTML = "";

if (cart.length === 0) {
cartTable.classList.add("hidden");
cartSummary.classList.add("hidden");
cartEmptyMsg.classList.remove("hidden");
return;
}
cartTable.classList.remove("hidden");
cartSummary.classList.remove("hidden");
cartEmptyMsg.classList.add("hidden");
let subtotal = 0;
cart.forEach((item, index) => {
const lineTotal = item.price * item.qty;
subtotal += lineTotal;
const row = document.createElement("tr");
row.innerHTML = `
<td>${item.name}</td>
<td>${formatMoney(item.price)}</td>
<td>
<div class="qty-control">
<button class="qty-minus" data-index="${index}" aria-label="Decrease quantity">&minus;</button>
<span class="qty-value">${item.qty}</span>
<button class="qty-plus" data-index="${index}" aria-label="Increase quantity">&plus;</button>
</div>
</td>
<td class="line-subtotal">${formatMoney(lineTotal)}</td>
<td><button class="btn btn-outline btn-small remove-item" data-index="${index}">Remove</button></td>
`;
cartBody.appendChild(row);
});
const delivery = DELIVERY_FEE;
const total = subtotal + delivery;
cartSubtotalEl.textContent = formatMoney(subtotal);
cartDeliveryEl.textContent = formatMoney(delivery);
cartTotalEl.textContent = formatMoney(total);
cartBody.querySelectorAll(".qty-plus").forEach(btn => {
btn.addEventListener("click", () => changeQty(btn.dataset.index, 1));
});
cartBody.querySelectorAll(".qty-minus").forEach(btn => {
btn.addEventListener("click", () => changeQty(btn.dataset.index, -1));
});
cartBody.querySelectorAll(".remove-item").forEach(btn => {
btn.addEventListener("click", () => removeItem(btn.dataset.index));
});
}

function changeQty(index, delta) {
const cart = getCart();
const item = cart[index];
if (!item) return;
item.qty = Math.max(1, item.qty + delta);
saveCart(cart);
renderCartPage();
}
function removeItem(index) {
const cart = getCart();
const removed = cart[index];
cart.splice(index, 1);
saveCart(cart);
renderCartPage();
if (removed) {
showToast(`${removed.name} removed from your cart`);
}
}
renderCartPage();
}
const modal = document.getElementById("welcomeModal");
if (modal) {
const closeBtn = modal.querySelector(".modal-close");
const signupForm = document.getElementById("signupForm");
const WELCOME_KEY = "beanBoutiqueWelcomeShown";
function openModal() {
modal.classList.add("is-visible");
sessionStorage.setItem(WELCOME_KEY, "true");
}
function closeModal() {
modal.classList.remove("is-visible");
}
if (!sessionStorage.getItem(WELCOME_KEY)) {
setTimeout(openModal, 1200);
}
if (closeBtn) {
closeBtn.addEventListener("click", closeModal);
}
modal.addEventListener("click", (e) => {
if (e.target === modal) closeModal();
});

if (signupForm) {
signupForm.addEventListener("submit", (e) => {
e.preventDefault();

// Honeypot check: real visitors never fill this hidden field in
const honeypot = signupForm.querySelector('input[name="hp_field"]');
if (honeypot && honeypot.value !== "") {
closeModal();
return;
}

const emailInput = signupForm.querySelector('input[type="email"]');
if (!emailInput || !emailInput.checkValidity()) {
showToast("Please enter a valid email address");
return;
}

closeModal();
showToast("You're signed up! Use code WELCOME10 at checkout.");
});
}
}
const coffeeSearchInput = document.getElementById("coffeeSearch");
const coffeeGrid = document.getElementById("coffeeGrid");

if (coffeeSearchInput && coffeeGrid) {
const coffeeCards = coffeeGrid.querySelectorAll(".filterable");
const noResultsMsg = document.getElementById("noResultsMsg");
const noResultsQuery = document.getElementById("noResultsQuery");

coffeeSearchInput.addEventListener("input", () => {
const rawQuery = coffeeSearchInput.value.trim();
const query = rawQuery.toLowerCase();
let visibleCount = 0;

coffeeCards.forEach(card => {
const haystack = card.dataset.name || "";
const isMatch = query === "" || haystack.includes(query);
card.classList.toggle("is-hidden", !isMatch);
if (isMatch) visibleCount++;
});

if (query !== "" && visibleCount === 0) {
if (noResultsQuery) noResultsQuery.textContent = rawQuery;
if (noResultsMsg) noResultsMsg.classList.remove("hidden");
} else if (noResultsMsg) {
noResultsMsg.classList.add("hidden");
}
});
}
const requestBlendBtn = document.getElementById("requestBlendBtn");
const customBlendPanel = document.getElementById("customBlendPanel");
const customBlendForm = document.getElementById("customBlendForm");

if (requestBlendBtn && customBlendPanel) {
requestBlendBtn.addEventListener("click", () => {
customBlendPanel.classList.remove("hidden");
customBlendPanel.scrollIntoView({ behavior: "smooth", block: "center" });
});
}
if (customBlendForm) {
customBlendForm.addEventListener("submit", (e) => {
e.preventDefault();
const honeypot = customBlendForm.querySelector('input[name="hp_field"]');
if (honeypot && honeypot.value !== "") {
customBlendForm.reset();
customBlendPanel.classList.add("hidden");
return;
}
const nameInput = customBlendForm.querySelector("#blendName");
const emailInput = customBlendForm.querySelector("#blendEmail");
if (!nameInput.value.trim()) {
showToast("Please enter your name");
return;
}
if (!emailInput.checkValidity()) {
showToast("Please enter a valid email address");
return;
}
customBlendForm.reset();
customBlendPanel.classList.add("hidden");
showToast("Thanks! We'll be in touch about your custom blend.");
});
}
});
