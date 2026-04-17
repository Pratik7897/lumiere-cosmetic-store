// ============================================================
// DATA STORE (localStorage simulation of database)
// ============================================================
const DB = {
  get: (key) => { try { return JSON.parse(localStorage.getItem('csms_'+key)) || null; } catch(e) { return null; } },
  set: (key, val) => { localStorage.setItem('csms_'+key, JSON.stringify(val)); },
};

const SEED_PRODUCTS = [
  {id:1,name:'Velvet Matte Lipstick',brand:'MAC Cosmetics',category:'Lips',price:950,stock:45,discount:15,emoji:'💄',expiry:'2026-12-31',desc:'A long-wearing matte formula with intense pigmentation. Available in 24 shades.'},
  {id:2,name:'Hydra-Boost Serum',brand:'The Ordinary',category:'Skincare',price:1200,stock:30,discount:0,emoji:'💧',expiry:'2027-03-31',desc:'Concentrated hyaluronic acid serum for deep hydration. Suitable for all skin types.'},
  {id:3,name:'Pro Contour Palette',brand:'Anastasia Beverly Hills',category:'Face',price:2800,stock:18,discount:10,emoji:'🎨',expiry:'2026-09-30',desc:'Professional contouring and highlighting palette with 6 shades for a sculpted look.'},
  {id:4,name:'Volume Lash Mascara',brand:'Maybelline',category:'Eyes',price:580,stock:60,discount:0,emoji:'👁️',expiry:'2026-06-30',desc:'Buildable volume formula with curved brush for dramatic lashes without clumping.'},
  {id:5,name:'Rose Gold Highlighter',brand:'Fenty Beauty',category:'Face',price:1650,stock:25,discount:20,emoji:'✨',expiry:'2027-01-31',desc:'Blinding shine with a rose-gold finish. Powder formula for buildable luminosity.'},
  {id:6,name:'Berry Lip Gloss',brand:"L'Oréal Paris",category:'Lips',price:420,stock:55,discount:0,emoji:'💋',expiry:'2026-08-31',desc:'Non-sticky, ultra-shiny gloss with plumping effect. Infused with vitamin E.'},
  {id:7,name:'Vitamin C Brightening Cream',brand:'Olay',category:'Skincare',price:890,stock:40,discount:5,emoji:'🌟',expiry:'2027-06-30',desc:'Daily moisturiser with 10% vitamin C complex to even skin tone and reduce dark spots.'},
  {id:8,name:'Glitter Eye Shadow Trio',brand:'Urban Decay',category:'Eyes',price:1380,stock:22,discount:0,emoji:'🌈',expiry:'2027-02-28',desc:'Three coordinating shades — base, mid-tone, and a high-impact glitter topper.'},
  {id:9,name:'Matte Foundation SPF 15',brand:'Lakme',category:'Face',price:690,stock:50,discount:0,emoji:'🫧',expiry:'2026-10-31',desc:'Lightweight full-coverage foundation with SPF protection. 12-hour wear formula.'},
  {id:10,name:'Peach Blush & Bronzer',brand:'NARS',category:'Face',price:1750,stock:15,discount:12,emoji:'🍑',expiry:'2027-04-30',desc:'Dual-purpose compact with blush and bronzer. Buildable colour with a silky finish.'},
  {id:11,name:'Waterproof Kajal',brand:'Biotique',category:'Eyes',price:180,stock:90,discount:0,emoji:'🖊️',expiry:'2026-05-31',desc:'Rich black formula with almond oil. Long-lasting, waterproof, and smudge-proof.'},
  {id:12,name:'Lip Liner Set',brand:'Charlotte Tilbury',category:'Lips',price:2100,stock:20,discount:8,emoji:'📝',expiry:'2027-05-31',desc:'Set of 4 complementary lip liners — nude, rose, berry, and red — for precision application.'},
  {id:13,name:'Micellar Cleansing Water',brand:'Bioderma',category:'Skincare',price:750,stock:35,discount:0,emoji:'🫧',expiry:'2027-08-31',desc:'Gentle no-rinse cleanser that removes makeup and impurities without stripping skin.'},
  {id:14,name:'Gel Nail Polish Set',brand:'OPI',category:'Nails',price:1850,stock:28,discount:0,emoji:'💅',expiry:'2028-01-01',desc:'Set of 6 chip-resistant gel shades with a high-gloss finish. Lasts up to 3 weeks.'},
  {id:15,name:'Perfume Mist — Rose Oud',brand:'Zara',category:'Fragrance',price:1290,stock:12,discount:0,emoji:'🌹',expiry:'2028-06-01',desc:'An oriental floral blend of fresh rose and smoky oud. Long-lasting body mist.'},
  {id:16,name:'Retinol Night Cream',brand:'RoC',category:'Skincare',price:1580,stock:0,discount:0,emoji:'🌙',expiry:'2027-09-30',desc:'Clinically proven retinol formula to reduce fine lines and wrinkles overnight.'},
];

const SEED_CATEGORIES = ['All','Skincare','Lips','Face','Eyes','Nails','Fragrance'];

function initDB() {
  if (!DB.get('products')) DB.set('products', SEED_PRODUCTS);
  if (!DB.get('categories')) DB.set('categories', SEED_CATEGORIES);
  if (!DB.get('cart')) DB.set('cart', []);
  if (!DB.get('orders')) DB.set('orders', []);
  if (!DB.get('reviews')) DB.set('reviews', [
    {id:1,productId:1,author:'Priya Sharma',rating:5,comment:'Absolutely love this lipstick! The colour payoff is amazing and it lasts all day.',date:'2025-03-10'},
    {id:2,productId:1,author:'Anjali Mehta',rating:4,comment:'Great formula, slightly drying after a few hours. But the shade is stunning!',date:'2025-04-02'},
    {id:3,productId:2,author:'Riya Kapoor',rating:5,comment:'My skin has never felt so hydrated. I use it morning and night.',date:'2025-03-22'},
    {id:4,productId:5,author:'Sana Khan',rating:5,comment:'Best highlighter I have ever tried. The rose gold shade is absolutely ethereal!',date:'2025-04-05'},
  ]);
}

// ============================================================
// STATE
// ============================================================
let currentPage = 'home';
let currentProduct = null;
let selectedRating = 0;
let currentCategory = 'All';
let currentSort = 'default';
let searchQuery = '';
let detailQty = 1;
let selectedPayment = 'cod';

// ============================================================
// PAGE ROUTER
// ============================================================
function showPage(page, data) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  currentPage = page;
  window.scrollTo(0,0);
  if (page === 'home') renderHome();
  if (page === 'cart') renderCart();
  if (page === 'checkout') renderCheckout();
  if (page === 'orders') renderOrders();
  if (page === 'admin') renderAdmin();
  if (page === 'detail' && data) renderDetail(data);
}

function goBack() { showPage('home'); }

// ============================================================
// TOAST & MODAL
// ============================================================
let toastTimer;
function showToast(msg, type = 'default') {
  const el = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  const msgEl = document.getElementById('toast-msg');
  el.className = 'toast';
  if (type === 'success') { el.classList.add('success'); icon.textContent = '✓'; }
  else if (type === 'error') { el.classList.add('error'); icon.textContent = '✗'; }
  else { icon.textContent = '✓'; }
  msgEl.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

function openModal(title, body, confirmCb) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = body;
  document.getElementById('modal-confirm-btn').onclick = () => { closeModal(); confirmCb(); };
  document.getElementById('modal-overlay').classList.add('show');
}
function closeModal() { document.getElementById('modal-overlay').classList.remove('show'); }

// ============================================================
// CART BADGE
// ============================================================
function updateCartBadge() {
  const cart = DB.get('cart') || [];
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  badge.textContent = total;
  badge.classList.toggle('hidden', total === 0);
}

// ============================================================
// PRODUCT HELPERS
// ============================================================
function getProducts() { return DB.get('products') || []; }
function getCategories() { return DB.get('categories') || []; }
function getReviews(productId) { return (DB.get('reviews') || []).filter(r => r.productId == productId); }
function getProductById(id) { return getProducts().find(p => p.id == id); }
function getEffectivePrice(p) { return p.discount ? Math.round(p.price * (1 - p.discount / 100)) : p.price; }
function getAvgRating(productId) {
  const reviews = getReviews(productId);
  return reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
}
function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) html += `<span style="color:${i <= Math.round(rating) ? '#f59e0b' : '#ddd'}">★</span>`;
  return html;
}

// ============================================================
// HOME PAGE
// ============================================================
function renderHome() {
  const products = getProducts();
  document.getElementById('hero-stat-products').textContent = products.length;
  const catNav = document.getElementById('cat-nav');
  const categories = getCategories();
  catNav.innerHTML = categories.map(cat =>
    `<button class="cat-btn${cat === currentCategory ? ' active' : ''}" onclick="filterCategory('${cat}', this)">${cat === 'All' ? 'All Products' : cat}</button>`
  ).join('');
  const apCat = document.getElementById('ap-category');
  if (apCat) apCat.innerHTML = '<option value="">Select Category</option>' + categories.filter(c => c !== 'All').map(c => `<option value="${c}">${c}</option>`).join('');
  renderProductGrid();
}

function filterCategory(cat, btn) {
  currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProductGrid();
}

function sortProducts(val) { currentSort = val; renderProductGrid(); }

function renderProductGrid() {
  let products = getProducts();
  if (currentCategory !== 'All') products = products.filter(p => p.category === currentCategory);
  if (currentSort === 'price-asc') products.sort((a,b) => getEffectivePrice(a) - getEffectivePrice(b));
  else if (currentSort === 'price-desc') products.sort((a,b) => getEffectivePrice(b) - getEffectivePrice(a));
  else if (currentSort === 'rating') products.sort((a,b) => getAvgRating(b.id) - getAvgRating(a.id));
  else if (currentSort === 'name') products.sort((a,b) => a.name.localeCompare(b.name));
  document.getElementById('product-grid').innerHTML = products.map(p => productCardHTML(p)).join('');
}

function productCardHTML(p) {
  const ep = getEffectivePrice(p);
  const avg = getAvgRating(p.id);
  const reviews = getReviews(p.id);
  const inCart = (DB.get('cart')||[]).some(c => c.productId == p.id);
  return `<div class="product-card" onclick="openProduct(${p.id})">
    <div class="product-img">
      ${p.discount ? `<span class="discount-badge">${p.discount}% OFF</span>` : ''}
      <span style="font-size:3.2rem">${p.emoji}</span>
    </div>
    <div class="product-info">
      <div class="product-cat">${p.category}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-brand">${p.brand}</div>
      <div class="product-bottom">
        <div class="product-price">${p.discount ? `<span class="original">₹${p.price}</span>` : ''}₹${ep}</div>
        <div class="product-stars">${avg > 0 ? `<span class="filled">★</span>${avg.toFixed(1)} (${reviews.length})` : '<span>No reviews</span>'}</div>
      </div>
      ${p.stock > 0
        ? `<button class="add-to-cart-btn" onclick="event.stopPropagation();addToCart(${p.id})">${inCart ? '✓ In Cart' : '+ Add to Cart'}</button>`
        : `<button class="out-of-stock" disabled>Out of Stock</button>`}
    </div>
  </div>`;
}

// ============================================================
// SEARCH
// ============================================================
function handleSearch(query) {
  searchQuery = query.trim();
  if (!searchQuery) { showPage('home'); return; }
  showPage('search');
  document.getElementById('search-title').textContent = `Results for "${searchQuery}"`;
  const products = getProducts().filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const grid = document.getElementById('search-grid');
  const empty = document.getElementById('search-empty');
  if (products.length) { grid.innerHTML = products.map(p => productCardHTML(p)).join(''); empty.style.display = 'none'; }
  else { grid.innerHTML = ''; empty.style.display = 'block'; }
}

// ============================================================
// PRODUCT DETAIL
// ============================================================
function openProduct(id) { currentProduct = getProductById(id); detailQty = 1; showPage('detail', id); }

function renderDetail(id) {
  const p = getProductById(id);
  if (!p) return;
  currentProduct = p;
  const ep = getEffectivePrice(p);
  const avg = getAvgRating(p.id);
  document.getElementById('detail-content').innerHTML = `
    <div class="product-detail-img">${p.emoji}</div>
    <div class="product-detail-info">
      <div class="product-detail-cat">${p.category}</div>
      <div class="product-detail-name">${p.name}</div>
      <div class="product-detail-brand">by ${p.brand}</div>
      <div class="product-detail-rating">
        <span class="rating-stars">${renderStars(avg)}</span>
        <span class="rating-count">${avg > 0 ? avg.toFixed(1) + ' · ' + getReviews(p.id).length + ' reviews' : 'No reviews yet'}</span>
      </div>
      <div class="product-detail-price">
        ${p.discount ? `<span style="font-size:.85rem;color:var(--warm-grey);text-decoration:line-through">₹${p.price}</span> ` : ''}
        <span class="price-main">₹${ep}</span>
        ${p.discount ? `<span class="price-save">${p.discount}% off</span>` : ''}
      </div>
      <p class="product-detail-desc">${p.desc}</p>
      <div class="detail-meta">
        <div class="detail-meta-row"><span class="meta-key">Brand</span><span class="meta-val">${p.brand}</span></div>
        <div class="detail-meta-row"><span class="meta-key">Category</span><span class="meta-val">${p.category}</span></div>
        <div class="detail-meta-row"><span class="meta-key">Stock</span><span class="meta-val">${p.stock > 0 ? p.stock + ' units available' : '<span style="color:var(--danger)">Out of Stock</span>'}</span></div>
        <div class="detail-meta-row"><span class="meta-key">Expiry</span><span class="meta-val">${p.expiry}</span></div>
      </div>
      ${p.stock > 0 ? `
      <div class="qty-control"><button class="qty-btn" onclick="changeDetailQty(-1)">−</button><span class="qty-val" id="detail-qty-val">1</span><button class="qty-btn" onclick="changeDetailQty(1)">+</button></div>
      <button class="add-to-cart-detail" onclick="addToCartWithQty(${p.id})">🛒 Add to Cart</button>
      <button class="buy-now-btn" onclick="buyNow(${p.id})">⚡ Buy Now</button>
      ` : `<button class="out-of-stock" style="padding:14px;font-size:.92rem;border-radius:10px" disabled>Out of Stock</button>`}
    </div>`;
  renderReviews(p.id);
}

function changeDetailQty(delta) {
  if (!currentProduct) return;
  detailQty = Math.max(1, Math.min(currentProduct.stock, detailQty + delta));
  document.getElementById('detail-qty-val').textContent = detailQty;
}

function addToCartWithQty(productId) {
  const p = getProductById(productId);
  const cart = DB.get('cart') || [];
  const existing = cart.find(c => c.productId == productId);
  if (existing) existing.qty = Math.min(p.stock, existing.qty + detailQty);
  else cart.push({ productId, qty: detailQty });
  DB.set('cart', cart);
  updateCartBadge();
  showToast(`Added ${detailQty}x ${p.name} to cart!`, 'success');
}

function buyNow(productId) { addToCartWithQty(productId); showPage('checkout'); }

// ============================================================
// REVIEWS
// ============================================================
function renderReviews(productId) {
  const reviews = getReviews(productId);
  const avg = getAvgRating(productId);
  const breakdown = [5,4,3,2,1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const pct = reviews.length ? Math.round((count/reviews.length)*100) : 0;
    return `<div class="review-bar-row"><span>${star}★</span><div class="review-bar-bg"><div class="review-bar-fill" style="width:${pct}%"></div></div><span>${count}</span></div>`;
  }).join('');
  const reviewCards = reviews.length ? reviews.map(r => `
    <div class="review-card"><div class="review-top"><div><div class="review-author">${r.author}</div><div style="font-size:.78rem;color:#f59e0b">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div></div><div class="review-date">${r.date}</div></div><div class="review-text">${r.comment}</div></div>`).join('')
    : `<p style="color:var(--warm-grey);font-size:.88rem;margin-bottom:20px">No reviews yet. Be the first!</p>`;
  document.getElementById('reviews-section').innerHTML = `
    <div class="reviews-header"><div><div class="reviews-avg">${avg > 0 ? avg.toFixed(1) : '—'}</div><div style="font-size:.78rem;color:var(--warm-grey);margin-top:4px">${reviews.length} reviews</div></div><div class="reviews-breakdown">${breakdown}</div></div>
    ${reviewCards}
    <div class="add-review-form"><div class="form-title">Write a Review</div>
      <div class="form-group"><label>Your Name</label><input type="text" id="r-author" placeholder="e.g. Priya S."></div>
      <div class="form-group"><label>Rating</label><div class="star-input" id="star-input">${[1,2,3,4,5].map(i => `<span onclick="setRating(${i})" onmouseover="hoverRating(${i})" onmouseout="unhoverRating()">★</span>`).join('')}</div></div>
      <div class="form-group"><label>Review</label><textarea id="r-comment" rows="3" placeholder="Share your thoughts…"></textarea></div>
      <button class="submit-btn" onclick="submitReview(${productId})">Submit Review</button>
    </div>`;
  selectedRating = 0;
}

function setRating(n) { selectedRating = n; document.querySelectorAll('#star-input span').forEach((s,i) => s.classList.toggle('active', i < n)); }
function hoverRating(n) { document.querySelectorAll('#star-input span').forEach((s,i) => s.style.color = i < n ? '#f59e0b' : '#ddd'); }
function unhoverRating() { document.querySelectorAll('#star-input span').forEach((s,i) => s.style.color = i < selectedRating ? '#f59e0b' : '#ddd'); }

function submitReview(productId) {
  const author = document.getElementById('r-author').value.trim();
  const comment = document.getElementById('r-comment').value.trim();
  if (!author) { showToast('Please enter your name', 'error'); return; }
  if (!selectedRating) { showToast('Please select a rating', 'error'); return; }
  if (!comment) { showToast('Please write a review', 'error'); return; }
  const reviews = DB.get('reviews') || [];
  reviews.push({ id: Date.now(), productId, author, rating: selectedRating, comment, date: new Date().toISOString().split('T')[0] });
  DB.set('reviews', reviews);
  showToast('Review submitted! Thank you.', 'success');
  renderReviews(productId);
}

// ============================================================
// CART
// ============================================================
function addToCart(productId) {
  const p = getProductById(productId);
  if (!p || p.stock === 0) { showToast('Out of stock', 'error'); return; }
  const cart = DB.get('cart') || [];
  const existing = cart.find(c => c.productId == productId);
  if (existing) { if (existing.qty >= p.stock) { showToast('Maximum stock reached', 'error'); return; } existing.qty++; }
  else cart.push({ productId, qty: 1 });
  DB.set('cart', cart);
  updateCartBadge();
  showToast(`${p.name} added to cart!`, 'success');
  if (currentPage === 'home') renderProductGrid();
  if (currentPage === 'search') handleSearch(searchQuery);
}

function renderCart() {
  const cart = DB.get('cart') || [];
  const container = document.getElementById('cart-content');
  if (!cart.length) {
    container.innerHTML = `<div class="empty-cart"><div class="empty-cart-icon">🛒</div><h3>Your cart is empty</h3><p>Looks like you haven't added anything yet.</p><button class="shop-btn" onclick="showPage('home')">Shop Now</button></div>`;
    return;
  }
  let subtotal = 0;
  const itemsHTML = cart.map(item => {
    const p = getProductById(item.productId);
    if (!p) return '';
    const ep = getEffectivePrice(p);
    const lineTotal = ep * item.qty;
    subtotal += lineTotal;
    return `<div class="cart-item"><div class="cart-item-img">${p.emoji}</div><div class="cart-item-info"><div class="cart-item-name">${p.name}</div><div class="cart-item-brand">${p.brand} · ₹${ep} each</div><div class="cart-item-controls"><div class="cart-qty-control"><button class="cart-qty-btn" onclick="updateCartQty(${p.id}, ${item.qty - 1})">−</button><span class="cart-qty-val">${item.qty}</span><button class="cart-qty-btn" onclick="updateCartQty(${p.id}, ${item.qty + 1})">+</button></div><button class="remove-btn" onclick="removeFromCart(${p.id})">Remove</button></div></div><div class="cart-item-price">₹${lineTotal.toLocaleString()}</div></div>`;
  }).join('');
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;
  container.innerHTML = `<div class="cart-layout"><div><div class="cart-items"><div class="cart-header"><h2>Cart Items</h2><span class="cart-count">${cart.length} item${cart.length !== 1 ? 's' : ''}</span></div>${itemsHTML}</div></div><div><div class="order-summary"><h3>Order Summary</h3><div class="summary-row"><span class="label">Subtotal</span><span class="value">₹${subtotal.toLocaleString()}</span></div><div class="summary-row"><span class="label">Shipping</span><span class="value">${shipping === 0 ? '<span style="color:var(--success)">Free</span>' : '₹' + shipping}</span></div>${shipping > 0 ? `<div style="font-size:.75rem;color:var(--warm-grey);margin-top:-4px">Add ₹${(999-subtotal).toLocaleString()} more for free shipping</div>` : ''}<hr class="summary-divider"><div class="summary-total"><span>Total</span><span>₹${total.toLocaleString()}</span></div><button class="checkout-btn" onclick="showPage('checkout')">Proceed to Checkout</button><button class="shop-btn" style="width:100%;background:none;color:var(--warm-grey);border:1px solid var(--border);border-radius:8px;padding:10px" onclick="showPage('home')">Continue Shopping</button></div></div></div>`;
}

function updateCartQty(productId, newQty) {
  const p = getProductById(productId);
  if (!p) return;
  if (newQty < 1) { removeFromCart(productId); return; }
  if (newQty > p.stock) { showToast('Not enough stock', 'error'); return; }
  const cart = DB.get('cart') || [];
  const item = cart.find(c => c.productId == productId);
  if (item) item.qty = newQty;
  DB.set('cart', cart);
  updateCartBadge();
  renderCart();
}

function removeFromCart(productId) {
  openModal('Remove Item', 'Remove this item from your cart?', () => {
    const cart = (DB.get('cart') || []).filter(c => c.productId != productId);
    DB.set('cart', cart);
    updateCartBadge();
    renderCart();
    showToast('Item removed from cart');
  });
}

// ============================================================
// CHECKOUT
// ============================================================
function renderCheckout() {
  const cart = DB.get('cart') || [];
  if (!cart.length) { showPage('cart'); return; }
  let subtotal = 0;
  cart.forEach(item => { const p = getProductById(item.productId); if (p) subtotal += getEffectivePrice(p) * item.qty; });
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;
  const itemsHTML = cart.map(item => { const p = getProductById(item.productId); if (!p) return ''; return `<div class="summary-row"><span class="label">${p.emoji} ${p.name} ×${item.qty}</span><span class="value">₹${(getEffectivePrice(p)*item.qty).toLocaleString()}</span></div>`; }).join('');
  document.getElementById('checkout-content').innerHTML = `<div class="checkout-grid"><div><div class="checkout-form-card"><h2>Delivery Information</h2><div class="form-row"><div class="form-group"><label>First Name *</label><input type="text" id="ch-fname" placeholder="Priya"></div><div class="form-group"><label>Last Name *</label><input type="text" id="ch-lname" placeholder="Sharma"></div></div><div class="form-group"><label>Email *</label><input type="email" id="ch-email" placeholder="priya@email.com"></div><div class="form-group"><label>Phone *</label><input type="tel" id="ch-phone" placeholder="+91 98765 43210"></div><div class="form-group"><label>Address *</label><input type="text" id="ch-address" placeholder="123, MG Road, Koramangala"></div><div class="form-row"><div class="form-group"><label>City *</label><input type="text" id="ch-city" placeholder="Bangalore"></div><div class="form-group"><label>PIN Code *</label><input type="text" id="ch-pin" placeholder="560034"></div></div><div class="payment-method"><div style="font-size:.8rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--warm-grey);margin-bottom:14px">Payment Method</div><div class="payment-option selected" onclick="selectPayment('cod',this)"><input type="radio" name="payment" value="cod" checked><span class="payment-icon">💵</span><div><div class="payment-label">Cash on Delivery</div><div class="payment-desc">Pay when your order arrives</div></div></div><div class="payment-option" onclick="selectPayment('upi',this)"><input type="radio" name="payment" value="upi"><span class="payment-icon">📱</span><div><div class="payment-label">UPI / Online Payment</div><div class="payment-desc">Instant secure payment (simulation)</div></div></div><div class="payment-option" onclick="selectPayment('card',this)"><input type="radio" name="payment" value="card"><span class="payment-icon">💳</span><div><div class="payment-label">Credit / Debit Card</div><div class="payment-desc">Visa, Mastercard, RuPay (simulation)</div></div></div></div><button class="place-order-btn" onclick="placeOrder()">🔒 Place Order — ₹${total.toLocaleString()}</button></div></div><div><div class="order-summary"><h3>Order Summary</h3>${itemsHTML}<hr class="summary-divider"><div class="summary-row"><span class="label">Subtotal</span><span class="value">₹${subtotal.toLocaleString()}</span></div><div class="summary-row"><span class="label">Shipping</span><span class="value">${shipping === 0 ? '<span style="color:var(--success)">Free</span>' : '₹'+shipping}</span></div><hr class="summary-divider"><div class="summary-total"><span>Total</span><span>₹${total.toLocaleString()}</span></div></div></div></div>`;
}

function selectPayment(method, el) {
  selectedPayment = method;
  document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  el.querySelector('input').checked = true;
}

function placeOrder() {
  const fname = document.getElementById('ch-fname').value.trim();
  const lname = document.getElementById('ch-lname').value.trim();
  const email = document.getElementById('ch-email').value.trim();
  const phone = document.getElementById('ch-phone').value.trim();
  const address = document.getElementById('ch-address').value.trim();
  const city = document.getElementById('ch-city').value.trim();
  const pin = document.getElementById('ch-pin').value.trim();
  if (!fname || !lname || !email || !phone || !address || !city || !pin) { showToast('Please fill in all required fields', 'error'); return; }
  const cart = DB.get('cart') || [];
  if (!cart.length) { showToast('Cart is empty', 'error'); return; }
  const content = document.getElementById('checkout-content');
  const paymentLabels = { cod:'Cash on Delivery', upi:'UPI Payment', card:'Card Payment' };
  content.innerHTML = `<div class="payment-processing" style="padding-top:80px"><div class="payment-spinner"></div><h3 style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:var(--deep);margin-bottom:8px">Processing ${paymentLabels[selectedPayment]}</h3><p>Please wait while we confirm your order…</p></div>`;
  setTimeout(() => {
    let subtotal = 0;
    const items = cart.map(item => { const p = getProductById(item.productId); const ep = getEffectivePrice(p); subtotal += ep * item.qty; return { productId: p.id, name: p.name, brand: p.brand, emoji: p.emoji, qty: item.qty, price: ep }; });
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal + shipping;
    const orderId = 'LUM' + Date.now().toString().slice(-6);
    const newOrder = { id: orderId, date: new Date().toISOString(), customer: { fname, lname, email, phone, address: `${address}, ${city} - ${pin}` }, items, subtotal, shipping, total, payment: selectedPayment, status: selectedPayment === 'cod' ? 'pending' : 'processing' };
    const orders = DB.get('orders') || [];
    orders.unshift(newOrder);
    DB.set('orders', orders);
    const products = getProducts();
    cart.forEach(item => { const p = products.find(pr => pr.id == item.productId); if (p) p.stock = Math.max(0, p.stock - item.qty); });
    DB.set('products', products);
    DB.set('cart', []);
    updateCartBadge();
    showSuccessPage(newOrder);
  }, 2200);
}

function showSuccessPage(order) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-success').classList.add('active');
  const payIcon = { cod:'💵', upi:'📱', card:'💳' };
  const payName = { cod:'Cash on Delivery', upi:'UPI Payment', card:'Card Payment' };
  document.getElementById('success-content').innerHTML = `<div style="padding:60px 0 100px"><div class="order-success"><div class="success-icon">✓</div><h2>Order Confirmed!</h2><p>Thank you, <strong>${order.customer.fname}</strong>! Your order has been placed successfully. You'll receive a confirmation at <strong>${order.customer.email}</strong>.</p><div class="order-id-badge">${order.id}</div><div style="background:white;border:1px solid var(--border);border-radius:12px;padding:18px;text-align:left;margin-bottom:24px"><div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:.84rem"><span style="color:var(--warm-grey)">Payment</span><span style="font-weight:600">${payIcon[order.payment]} ${payName[order.payment]}</span></div><div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:.84rem"><span style="color:var(--warm-grey)">Deliver to</span><span style="font-weight:600;text-align:right;max-width:200px">${order.customer.address}</span></div><div style="display:flex;justify-content:space-between;font-size:.84rem"><span style="color:var(--warm-grey)">Order Total</span><span style="font-weight:700;color:var(--plum)">₹${order.total.toLocaleString()}</span></div></div><div style="display:flex;gap:12px"><button class="shop-btn" onclick="showPage('orders')" style="flex:1;background:var(--petal);color:var(--plum)">Track Order</button><button class="shop-btn" onclick="showPage('home')" style="flex:1">Continue Shopping</button></div></div></div>`;
}

// ============================================================
// ORDER HISTORY
// ============================================================
function renderOrders() {
  const orders = DB.get('orders') || [];
  const container = document.getElementById('orders-list');
  if (!orders.length) { container.innerHTML = `<div class="no-orders"><div class="no-orders-icon">📦</div><h3>No orders yet</h3><p>When you place an order, it will appear here.</p><button class="shop-btn" onclick="showPage('home')">Start Shopping</button></div>`; return; }
  const statusMap = { pending:['status-pending','⏳ Pending'], processing:['status-processing','⚙️ Processing'], shipped:['status-shipped','🚚 Shipped'], delivered:['status-delivered','✅ Delivered'] };
  container.innerHTML = orders.map(order => {
    const [sc, sl] = statusMap[order.status] || ['status-pending','⏳ Pending'];
    const date = new Date(order.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
    const itemsHTML = order.items.map(item => `<div class="order-item-row"><div class="order-item-emoji">${item.emoji}</div><div><div class="order-item-name">${item.name}</div><div class="order-item-qty">${item.brand} · Qty ${item.qty}</div></div><div class="order-item-price">₹${(item.price*item.qty).toLocaleString()}</div></div>`).join('');
    return `<div class="order-card"><div class="order-card-header"><div><div class="order-id">#${order.id}</div><div class="order-date-str">${date}</div></div><span class="order-status ${sc}">${sl}</span></div><div class="order-card-items">${itemsHTML}</div><div class="order-card-footer"><div class="order-total">Total: ₹${order.total.toLocaleString()}</div><button class="reorder-btn" onclick="reorder('${order.id}')">Reorder</button></div></div>`;
  }).join('');
}

function reorder(orderId) {
  const orders = DB.get('orders') || [];
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  const cart = DB.get('cart') || [];
  order.items.forEach(item => { const p = getProductById(item.productId); if (!p || p.stock === 0) return; const existing = cart.find(c => c.productId == item.productId); if (existing) existing.qty = Math.min(p.stock, existing.qty + item.qty); else cart.push({ productId: item.productId, qty: Math.min(item.qty, p.stock) }); });
  DB.set('cart', cart);
  updateCartBadge();
  showToast('Items added to cart!', 'success');
  showPage('cart');
}

// ============================================================
// ADMIN PANEL
// ============================================================
function renderAdmin() { renderAdminDashboard(); renderAdminProductsTable(); renderAdminStockTable(); renderAdminOrders(); const apCat = document.getElementById('ap-category'); if (apCat) { const cats = getCategories().filter(c => c !== 'All'); apCat.innerHTML = '<option value="">Select Category</option>' + cats.map(c => `<option value="${c}">${c}</option>`).join(''); } }
function switchAdmin(panel, btn) { document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active')); document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active')); document.getElementById('admin-'+panel).classList.add('active'); btn.classList.add('active'); }

function renderAdminDashboard() {
  const products = getProducts(); const orders = DB.get('orders') || []; const totalRevenue = orders.reduce((s, o) => s + o.total, 0); const lowStock = products.filter(p => p.stock < 10 && p.stock > 0).length;
  document.getElementById('admin-stats').innerHTML = `<div class="admin-stat"><div class="admin-stat-num">${products.length}</div><div class="admin-stat-lbl">Products</div></div><div class="admin-stat"><div class="admin-stat-num">${orders.length}</div><div class="admin-stat-lbl">Orders</div></div><div class="admin-stat"><div class="admin-stat-num" style="color:var(--success)">₹${totalRevenue.toLocaleString()}</div><div class="admin-stat-lbl">Revenue</div></div><div class="admin-stat"><div class="admin-stat-num" style="color:${lowStock > 0 ? 'var(--danger)' : 'var(--success)'}">${lowStock}</div><div class="admin-stat-lbl">Low Stock</div></div>`;
  const recentOrders = orders.slice(0, 5);
  if (!recentOrders.length) { document.getElementById('admin-recent-orders').innerHTML = '<p style="color:var(--warm-grey);font-size:.86rem">No orders yet.</p>'; return; }
  document.getElementById('admin-recent-orders').innerHTML = `<table class="admin-table"><thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead><tbody>${recentOrders.map(o => `<tr><td>#${o.id}</td><td>${o.customer.fname} ${o.customer.lname}</td><td>₹${o.total.toLocaleString()}</td><td><span class="order-status ${o.status === 'pending' ? 'status-pending' : o.status === 'processing' ? 'status-processing' : 'status-shipped'}" style="font-size:.72rem">${o.status}</span></td><td>${new Date(o.date).toLocaleDateString('en-IN')}</td></tr>`).join('')}</tbody></table>`;
}

function renderAdminProductsTable() {
  const products = getProducts();
  document.getElementById('admin-products-table').innerHTML = `<table class="admin-table"><thead><tr><th>Product</th><th>Brand</th><th>Category</th><th>Price</th><th>Discount</th><th>Stock</th><th>Status</th></tr></thead><tbody>${products.map(p => `<tr><td>${p.emoji} ${p.name}</td><td>${p.brand}</td><td>${p.category}</td><td>₹${p.price}</td><td>${p.discount ? p.discount+'%' : '—'}</td><td>${p.stock}</td><td><span style="font-size:.73rem;padding:3px 8px;border-radius:4px;font-weight:600;${p.stock === 0 ? 'background:var(--danger-bg);color:var(--danger)' : p.stock < 10 ? 'background:#fff8e1;color:#e65100' : 'background:var(--success-bg);color:var(--success)'}">${p.stock === 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock'}</span></td></tr>`).join('')}</tbody></table>`;
}

function renderAdminStockTable() {
  const products = getProducts();
  document.getElementById('admin-stock-table').innerHTML = `<table class="admin-table"><thead><tr><th>Product</th><th>Current Stock</th><th>New Stock</th><th>Action</th></tr></thead><tbody>${products.map(p => `<tr><td>${p.emoji} ${p.name}</td><td><span style="font-weight:600;color:${p.stock === 0 ? 'var(--danger)' : p.stock < 10 ? '#e65100' : 'var(--success)'}">${p.stock}</span></td><td><input class="stock-input" type="number" id="stock-${p.id}" value="${p.stock}" min="0" max="999"></td><td><button class="update-stock-btn" onclick="updateStock(${p.id})">Update</button></td></tr>`).join('')}</tbody></table>`;
}

function updateStock(productId) {
  const input = document.getElementById('stock-'+productId);
  const newStock = parseInt(input.value);
  if (isNaN(newStock) || newStock < 0) { showToast('Invalid stock value', 'error'); return; }
  const products = getProducts();
  const p = products.find(pr => pr.id == productId);
  if (!p) return;
  p.stock = newStock;
  DB.set('products', products);
  showToast(`${p.name} stock updated to ${newStock}`, 'success');
  renderAdminStockTable(); renderAdminProductsTable(); renderAdminDashboard();
}

function addProduct() {
  const name = document.getElementById('ap-name').value.trim();
  const brand = document.getElementById('ap-brand').value.trim();
  const category = document.getElementById('ap-category').value;
  const price = parseFloat(document.getElementById('ap-price').value);
  const stock = parseInt(document.getElementById('ap-stock').value);
  const discount = parseInt(document.getElementById('ap-discount').value) || 0;
  const emoji = document.getElementById('ap-emoji').value.trim() || '🧴';
  const expiry = document.getElementById('ap-expiry').value;
  const desc = document.getElementById('ap-desc').value.trim();
  if (!name || !brand || !category || !price || isNaN(stock)) { showToast('Please fill all required fields', 'error'); return; }
  const products = getProducts();
  const newId = Math.max(...products.map(p => p.id), 0) + 1;
  products.push({ id: newId, name, brand, category, price, stock, discount, emoji, expiry: expiry || '2027-12-31', desc: desc || 'No description.' });
  DB.set('products', products);
  const cats = getCategories();
  if (!cats.includes(category)) { cats.splice(-1, 0, category); DB.set('categories', cats); }
  showToast(`${name} added to catalogue!`, 'success');
  ['ap-name','ap-brand','ap-price','ap-stock','ap-discount','ap-emoji','ap-expiry','ap-desc'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('ap-category').value = '';
  renderAdminProductsTable(); renderAdminStockTable(); renderAdminDashboard();
}

function renderAdminOrders() {
  const orders = DB.get('orders') || [];
  const container = document.getElementById('admin-orders-list');
  if (!orders.length) { container.innerHTML = '<p style="color:var(--warm-grey);padding:20px">No orders yet.</p>'; return; }
  const statusOptions = ['pending','processing','shipped','delivered'];
  container.innerHTML = orders.map(order => `<div class="admin-card" style="margin-bottom:14px"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px"><div><span style="font-family:'DM Mono',monospace;font-size:.82rem;font-weight:700;color:var(--plum)">#${order.id}</span><span style="font-size:.78rem;color:var(--warm-grey);margin-left:10px">${new Date(order.date).toLocaleDateString('en-IN')}</span><span style="font-size:.78rem;color:var(--warm-grey);margin-left:8px">· ${order.customer.fname} ${order.customer.lname}</span></div><div style="display:flex;align-items:center;gap:8px"><span style="font-size:.86rem;font-weight:700;color:var(--plum)">₹${order.total.toLocaleString()}</span><select onchange="updateOrderStatus('${order.id}', this.value)" style="border:1px solid var(--border);border-radius:6px;padding:5px 9px;font-size:.78rem;color:var(--ink);background:white;cursor:pointer;outline:none">${statusOptions.map(s => `<option value="${s}" ${s === order.status ? 'selected' : ''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('')}</select></div></div><div style="font-size:.82rem;color:var(--warm-grey)">${order.items.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join(' · ')}</div></div>`).join('');
}

function updateOrderStatus(orderId, status) {
  const orders = DB.get('orders') || [];
  const order = orders.find(o => o.id === orderId);
  if (order) { order.status = status; DB.set('orders', orders); }
  showToast(`Order ${orderId} → ${status}`, 'success');
}

// ============================================================
// INIT
// ============================================================
initDB();
updateCartBadge();
renderHome();
