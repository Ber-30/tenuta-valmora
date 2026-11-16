// ==========================================================================
// TENUTA VALMORA - MAIN GLOBAL JAVASCRIPT
// Header, Mobile Drawer, Modale Dettagli Vino, Toast & Newsletter
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileClose = document.getElementById('mobile-drawer-close');

  function openMobileNav() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.add('open');
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileDrawer && mobileOverlay) {
      mobileDrawer.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileBtn) mobileBtn.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

  // 3. Modal Dettagli Prodotto
  const productModalBackdrop = document.getElementById('product-modal-backdrop');
  const productModalClose = document.getElementById('product-modal-close');

  if (productModalClose && productModalBackdrop) {
    productModalClose.addEventListener('click', () => {
      productModalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    });

    productModalBackdrop.addEventListener('click', (e) => {
      if (e.target === productModalBackdrop) {
        productModalBackdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // 4. Newsletter form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        window.showToast('✓ Grazie per esserti iscritto alla newsletter della Tenuta Valmora!', false);
        input.value = '';
      }
    });
  }
});

// Apre modale dettagli prodotto
function openProductModal(productId) {
  const product = window.getProductById ? window.getProductById(productId) : null;
  if (!product) return;

  const backdrop = document.getElementById('product-modal-backdrop');
  if (!backdrop) return;

  document.getElementById('modal-product-img').src = product.image;
  document.getElementById('modal-product-img').alt = product.name;
  document.getElementById('modal-product-appellation').textContent = product.appellation;
  document.getElementById('modal-product-name').textContent = `${product.name} ${product.vintage}`;
  document.getElementById('modal-product-badge').textContent = product.badge;
  document.getElementById('modal-product-price').textContent = `€${product.price.toFixed(2)}`;
  document.getElementById('modal-product-desc').textContent = product.description;
  document.getElementById('modal-product-grapes').textContent = product.grapes;
  document.getElementById('modal-product-terroir').textContent = product.terroir;
  document.getElementById('modal-product-format').textContent = `${product.format} • ${product.alcohol}`;

  document.getElementById('modal-tasting-visual').textContent = product.tastingNotes.visual;
  document.getElementById('modal-tasting-olfactory').textContent = product.tastingNotes.olfactory;
  document.getElementById('modal-tasting-taste').textContent = product.tastingNotes.taste;
  document.getElementById('modal-product-pairing').textContent = product.pairing;

  // Setup bottone aggiungi al carrello
  const addBtn = document.getElementById('modal-add-cart-btn');
  addBtn.onclick = () => {
    const qtyInput = document.getElementById('modal-qty-input');
    const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    window.addToCart(product.id, qty);
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

window.openProductModal = openProductModal;
