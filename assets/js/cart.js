// ==========================================================================
// TENUTA VALMORA - GESTIONE CARRELLO (CART STATE & LOCALSTORAGE)
// ==========================================================================

const CART_STORAGE_KEY = 'valmora_cart_items_v1';
const FREE_SHIPPING_THRESHOLD = 99.00;
const STANDARD_SHIPPING_COST = 7.90;

// Carica carrello da localStorage
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Errore lettura carrello:', e);
    return [];
  }
}

// Salva carrello in localStorage
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
  } catch (e) {
    console.error('Errore salvataggio carrello:', e);
  }
}

// Aggiunge prodotto al carrello
function addToCart(productId, qty = 1) {
  const product = window.getProductById ? window.getProductById(productId) : null;
  if (!product) {
    console.warn('Prodotto non trovato:', productId);
    return;
  }

  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      vintage: product.vintage,
      price: product.price,
      image: product.image,
      format: product.format,
      quantity: qty
    });
  }

  saveCart(cart);
  showToast(`Aggiunto al carrello: ${product.name} (${qty} ${qty > 1 ? 'bottiglie' : 'bottiglia'})`);
  openCartDrawer();
}

// Modifica quantità
function updateCartItemQty(productId, delta) {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart(cart);
  }
}

// Rimuove prodotto
function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

// Svuota carrello
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartUI();
}

// Calcoli carrello
function getCartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || count === 0;
  const shipping = isFreeShipping ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shipping;

  return { subtotal, count, isFreeShipping, shipping, total };
}

// Aggiorna tutta la UI del carrello
function updateCartUI() {
  const { subtotal, count, isFreeShipping, shipping, total } = getCartTotals();
  const cart = getCart();

  // Badge nei pulsanti header
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });

  const countElements = document.querySelectorAll('.cart-count-val');
  countElements.forEach(el => el.textContent = count);

  // Aggiorna contenuto lista carrello
  const itemsContainer = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty-state');
  const footerEl = document.getElementById('cart-footer');
  const shippingBarFill = document.getElementById('shipping-bar-fill');
  const shippingBarText = document.getElementById('shipping-bar-text');

  if (itemsContainer && emptyState && footerEl) {
    if (cart.length === 0) {
      itemsContainer.style.display = 'none';
      emptyState.style.display = 'block';
      footerEl.style.display = 'none';
      if (shippingBarText) {
        shippingBarText.innerHTML = `<span>Aggiungi <strong>€${FREE_SHIPPING_THRESHOLD.toFixed(2)}</strong> per la spedizione gratuita</span>`;
      }
      if (shippingBarFill) shippingBarFill.style.width = '0%';
    } else {
      itemsContainer.style.display = 'block';
      emptyState.style.display = 'none';
      footerEl.style.display = 'block';

      // Calcolo barra spedizione
      if (shippingBarFill && shippingBarText) {
        if (isFreeShipping) {
          shippingBarFill.style.width = '100%';
          shippingBarText.innerHTML = `<span style="color:#27AE60;">🎉 <strong>Congratulazioni!</strong> Hai diritto alla spedizione gratuita</span>`;
        } else {
          const diff = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
          const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
          shippingBarFill.style.width = `${percent}%`;
          shippingBarText.innerHTML = `<span>Ti mancano <strong>€${diff}</strong> per la <strong>spedizione gratuita</strong></span><span>${percent}%</span>`;
        }
      }

      // Render items
      itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-vintage">${item.vintage} &bull; ${item.format}</div>
            <div class="cart-item-meta">
              <div class="cart-qty-ctrl">
                <button type="button" class="cart-qty-btn" onclick="updateCartItemQty('${item.id}', -1)" aria-label="Riduci">−</button>
                <span class="cart-qty-val">${item.quantity}</span>
                <button type="button" class="cart-qty-btn" onclick="updateCartItemQty('${item.id}', 1)" aria-label="Aumenta">+</button>
              </div>
              <div class="cart-item-price">€${(item.price * item.quantity).toFixed(2)}</div>
              <button type="button" class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Rimuovi prodotto" aria-label="Rimuovi">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `).join('');

      // Aggiorna subtotali
      const subtotalEl = document.getElementById('cart-subtotal-val');
      const shippingEl = document.getElementById('cart-shipping-val');
      const totalEl = document.getElementById('cart-total-val');

      if (subtotalEl) subtotalEl.textContent = `€${subtotal.toFixed(2)}`;
      if (shippingEl) shippingEl.textContent = isFreeShipping ? 'Gratuita' : `€${shipping.toFixed(2)}`;
      if (totalEl) totalEl.textContent = `€${total.toFixed(2)}`;
    }
  }
}

// Apertura/Chiusura Drawer
function openCartDrawer() {
  const backdrop = document.getElementById('cart-backdrop');
  const drawer = document.getElementById('cart-drawer');
  if (backdrop && drawer) {
    backdrop.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const backdrop = document.getElementById('cart-backdrop');
  const drawer = document.getElementById('cart-drawer');
  if (backdrop && drawer) {
    backdrop.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Toast Notifiche
function showToast(message, withCartLink = true) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-success-icon">✓</span>
    <span>${message}</span>
    ${withCartLink ? `<span class="toast-view-cart" onclick="openCartDrawer()">Vedi carrello</span>` : ''}
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Inizializzazione al caricamento
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  // Event listener sui bottoni carrello
  document.querySelectorAll('.cart-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  const closeBtn = document.getElementById('cart-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);

  const backdrop = document.getElementById('cart-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeCartDrawer);

  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeCartDrawer();
      if (window.openCheckoutModal) {
        window.openCheckoutModal();
      }
    });
  }
});

// Esporta globalmente
window.addToCart = addToCart;
window.updateCartItemQty = updateCartItemQty;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.getCart = getCart;
window.getCartTotals = getCartTotals;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.updateCartUI = updateCartUI;
window.showToast = showToast;
