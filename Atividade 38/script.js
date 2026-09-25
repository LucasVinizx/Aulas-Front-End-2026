/* ==========================================================================
   1. BASE DE DADOS DOS PRODUTOS
   ========================================================================== */
const products = [
    {
        id: 1,
        name: "Éclat Vert de Lotus",
        category: "Cítrico",
        price: 389.00,
        volume: "100ml",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80",
        notes: "Flor de Lótus, Bergamota Siciliana, Chá Verde e Vetiver.",
        description: "Fragrância leve, revigorante e profundamente serena, inspirada no frescor matinal das águas límpidas."
    },
    {
        id: 2,
        name: "Sândalo Imperial & Folhas",
        category: "Amadeirado",
        price: 440.00,
        volume: "100ml",
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=500&q=80",
        notes: "Sândalo Nobre, Cedro do Atlas, Pimenta Rosa e Musgo de Carvalho.",
        description: "Um mergulho sofisticado no coração das florestas temperadas. Encorpado, elegante e marcante."
    },
    {
        id: 3,
        name: "Flor de Orquídea Silvestre",
        category: "Floral",
        price: 365.00,
        volume: "75ml",
        image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=500&q=80",
        notes: "Orquídeas Raras, Jasmim Sambac e Almíscar Branco Limpo.",
        description: "A essência feminina e poética de orquídeas que florescem no coração da mata Atlântica."
    },
    {
        id: 4,
        name: "Brisa de Neroli & Verbena",
        category: "Cítrico",
        price: 320.00,
        volume: "100ml",
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=80",
        notes: "Flor de Laranjeira, Verbena Fresca e Âmbar Botânico.",
        description: "Sensação do frescor da manhã ensolarada com gotas de orvalho repousando em folhas verdes."
    },
    {
        id: 5,
        name: "Rosa Negra & Cardamomo",
        category: "Floral",
        price: 490.00,
        volume: "100ml",
        image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=500&q=80",
        notes: "Rosa Damascena, Cardamomo Especiado, Baunilha Bourbon.",
        description: "Fragrância intensa, quente e misteriosa criada para ocasiões memoráveis."
    },
    {
        id: 6,
        name: "Cedro & Patchouli Orgânico",
        category: "Amadeirado",
        price: 410.00,
        volume: "100ml",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80",
        notes: "Madeiras Claras, Patchouli, Resinas Naturais e Lavanda.",
        description: "A harmonia perfeita entre o vigor das raízes da floresta e o toque aromático das folhas."
    }
];

/* ==========================================================================
   2. ESTADO GLOBAL DA APLICAÇÃO
   ========================================================================== */
let cart = [];
let currentUser = null; // { name: 'Nome', email: 'email@...' } quando logado

/* ==========================================================================
   3. NAVEGAÇÃO ENTRE PÁGINAS (SPA)
   ========================================================================== */
function navigateTo(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
        targetView.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Sincroniza links do menu
    if (viewId === 'home') document.querySelectorAll('.nav-link')[0]?.classList.add('active');
    if (viewId === 'catalog') document.querySelectorAll('.nav-link')[1]?.classList.add('active');
}

/* ==========================================================================
   4. RENDERIZAÇÃO DE PRODUTOS E CATÁLOGO
   ========================================================================== */
function formatCurrency(val) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function createProductCard(product) {
    return `
    <article class="product-card" onclick="viewProductDetails(${product.id})">
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${product.category} • ${product.volume}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">${formatCurrency(product.price)}</div>
        <button class="btn btn-secondary btn-block" onclick="event.stopPropagation(); addToCart(${product.id})">
          Adicionar à Sacola
        </button>
      </div>
    </article>
  `;
}

function renderCatalog(items = products) {
    const catalogGrid = document.getElementById('catalogGrid');
    const homeFeaturedGrid = document.getElementById('homeFeaturedGrid');

    if (catalogGrid) {
        catalogGrid.innerHTML = items.map(createProductCard).join('');
    }
    if (homeFeaturedGrid) {
        homeFeaturedGrid.innerHTML = products.slice(0, 3).map(createProductCard).join('');
    }
}

function filterProducts(category, btnElement) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    if (category === 'Todos') {
        renderCatalog(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderCatalog(filtered);
    }
}

/* ==========================================================================
   5. PÁGINA DE DETALHES DO PRODUTO
   ========================================================================== */
function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const container = document.getElementById('productDetailContainer');
    container.innerHTML = `
    <div class="detail-img-box">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="detail-info">
      <span class="product-category">${product.category} • Eau de Parfum (${product.volume})</span>
      <h2>${product.name}</h2>
      <div class="detail-price">${formatCurrency(product.price)}</div>
      
      <p class="detail-desc">${product.description}</p>
      
      <div class="notes-box">
        <h4>🌿 Pirâmide Olfativa:</h4>
        <p>${product.notes}</p>
      </div>

      <div class="detail-action-buttons">
        <button class="btn btn-primary" onclick="addToCart(${product.id}); toggleCart(true);">
          Comprar Agora
        </button>
        <button class="btn btn-secondary" onclick="addToCart(${product.id})">
          + Adicionar à Sacola
        </button>
      </div>
    </div>
  `;

    navigateTo('product-detail');
}

/* ==========================================================================
   6. CARRINHO LATERAL (DRAWER)
   ========================================================================== */
function toggleCart(open) {
    const overlay = document.getElementById('cartOverlay');
    if (open) {
        renderCartItems();
        overlay.classList.add('open');
    } else {
        overlay.classList.remove('open');
    }
}

function closeCartOnOutside(e) {
    if (e.target.id === 'cartOverlay') toggleCart(false);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartBadge();
    renderCartItems();
}

function changeQuantity(productId, delta) {
    const item = cart.find(p => p.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== productId);
    }

    updateCartBadge();
    renderCartItems();
}

function updateCartBadge() {
    const count = cart.reduce((acc, curr) => acc + curr.quantity, 0);
    document.getElementById('cartCount').innerText = count;
}

function calculateCartTotal() {
    return cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
}

function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const totalDrawer = document.getElementById('cartTotalDrawer');

    if (cart.length === 0) {
        container.innerHTML = `
      <div class="cart-empty-state">
        <p class="cart-empty-icon">🍃</p>
        <p>Sua sacola está vazia.</p>
      </div>
    `;
        totalDrawer.innerText = formatCurrency(0);
        return;
    }

    container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatCurrency(item.price)}</div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');

    totalDrawer.innerText = formatCurrency(calculateCartTotal());
}

/* ==========================================================================
   7. FLUXO DE CHECKOUT E RESUMO
   ========================================================================== */
function goToCheckout() {
    if (cart.length === 0) {
        alert("Sua sacola está vazia! Adicione fragrâncias antes de finalizar.");
        return;
    }
    toggleCart(false);

    const checkoutList = document.getElementById('checkoutItemsList');
    checkoutList.innerHTML = cart.map(item => `
    <div class="summary-item">
      <span>${item.quantity}x ${item.name}</span>
      <span>${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join('');

    const total = calculateCartTotal();
    document.getElementById('checkoutSubtotal').innerText = formatCurrency(total);
    document.getElementById('checkoutTotal').innerText = formatCurrency(total);

    if (currentUser) {
        document.getElementById('orderName').value = currentUser.name;
        document.getElementById('orderEmail').value = currentUser.email;
    }

    navigateTo('checkout');
}

function handleCheckout(e) {
    e.preventDefault();

    const name = document.getElementById('orderName').value;
    const address = document.getElementById('orderAddress').value;
    const payment = document.getElementById('paymentMethod').value;
    const totalFormatted = formatCurrency(calculateCartTotal());

    document.getElementById('sumOrderId').innerText = `#LC-${Math.floor(100000 + Math.random() * 900000)}`;
    document.getElementById('sumCustomer').innerText = name;
    document.getElementById('sumAddress').innerText = address;
    document.getElementById('sumPayment').innerText = payment;
    document.getElementById('sumTotal').innerText = totalFormatted;

    cart = [];
    updateCartBadge();

    navigateTo('order-summary');
}

/* ==========================================================================
   8. AUTENTICAÇÃO, MODAIS E AVATAR DO USUÁRIO
   ========================================================================== */
function openAuthModal(tab = 'login') {
    document.getElementById('authModal').classList.add('open');
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('open');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const name = email.split('@')[0];

    setUserLoggedIn({ name: name.charAt(0).toUpperCase() + name.slice(1), email });
    closeAuthModal();
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;

    setUserLoggedIn({ name, email });
    closeAuthModal();
}

function handleForgot(e) {
    e.preventDefault();
    alert("Instruções de recuperação foram enviadas para o seu e-mail!");
    openAuthModal('login');
}

function setUserLoggedIn(user) {
    currentUser = user;
    document.getElementById('authActions').style.display = 'none';

    const avatarContainer = document.getElementById('userAvatarContainer');
    const initials = user.name.substring(0, 2).toUpperCase();
    document.getElementById('avatarInitials').innerText = initials;
    avatarContainer.style.display = 'block';
}

function toggleUserDropdown() {
    const drop = document.getElementById('userDropdown');
    drop.classList.toggle('show');
}

function logout() {
    currentUser = null;
    document.getElementById('authActions').style.display = 'block';
    document.getElementById('userAvatarContainer').style.display = 'none';
    document.getElementById('userDropdown').classList.remove('show');
}

window.addEventListener('click', (e) => {
    if (!e.target.closest('.user-profile-menu')) {
        document.getElementById('userDropdown')?.classList.remove('show');
    }
});

/* ==========================================================================
   9. INICIALIZAÇÃO
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
});