// Tenuta Valmora: topbar, header, pannello Menu e footer condivisi da tutte le pagine.
// Incluso due volte per pagina, in modo sincrono:
//   <script src="assets/js/layout.js" data-part="header"></script>  -> topbar, header, pannello
//   <script src="assets/js/layout.js" data-part="footer"></script>  -> footer
// Il markup viene inserito subito prima dello script, così esiste già al DOMContentLoaded
// quando partono main.js e cart.js. La pagina corrente si legge da <body data-page="...">.

(function () {
  'use strict';

  // ==========================================================================
  // CONFIGURAZIONE: testi e link di topbar, header, pannello e footer.
  // Modificare qui una voce la cambia su tutte le pagine.
  // ==========================================================================

  var CONFIG = {
    topbar: 'Spedizione gratuita in tutta Italia per ordini superiori a <strong>€99,00</strong> &bull; Consegna in cantinette isotermiche certificate',

    pages: {
      'home': { label: 'Home', href: 'index.html' },
      'chi-siamo': { label: 'Chi siamo', href: 'chi-siamo.html' },
      'shop': { label: 'Shop', href: 'shop.html' },
      'contatti': { label: 'Contatti', href: 'contatti.html' },
      'informazioni': { label: 'Informazioni', href: 'informazioni.html' }
    },

    // Voci dell'header da 1024px, ai lati del logo.
    headerLeft: ['home', 'chi-siamo'],
    headerRight: ['shop', 'contatti'],

    // Pannello Menu: una colonna per pagina.
    menu: [
      { page: 'home', links: [
        { label: 'Radici', href: 'index.html#radici' },
        { label: 'Vulcano', href: 'index.html#vulcano' },
        { label: 'Tempo', href: 'index.html#tempo' },
        { label: 'I nostri vini', href: 'index.html#home-vini' },
        { label: 'La visita', href: 'index.html#home-visita' }
      ] },
      { page: 'chi-siamo', links: [
        { label: 'La famiglia', href: 'chi-siamo.html#la-famiglia' },
        { label: 'Le quattro generazioni', href: 'chi-siamo.html#generazioni' },
        { label: 'La nostra filosofia', href: 'chi-siamo.html#filosofia' }
      ] },
      { page: 'shop', links: [
        { label: 'Tutti i vini', href: 'shop.html' },
        { label: 'Rossi classici', href: 'shop.html?categoria=rossi' },
        { label: 'Grandi riserve', href: 'shop.html?categoria=riserve' },
        { label: 'Passito DOCG', href: 'shop.html?categoria=dolci' }
      ] },
      { page: 'contatti', links: [
        { label: 'Scrivici', href: 'contatti.html#scrivici' },
        { label: 'Orari e indirizzo', href: 'contatti.html#recapiti' },
        { label: 'Come raggiungerci', href: 'contatti.html#come-raggiungerci' }
      ] },
      { page: 'informazioni', links: [
        { label: 'Condizioni di vendita', href: 'informazioni.html#condizioni' },
        { label: 'Spedizioni', href: 'informazioni.html#spedizioni' },
        { label: 'Diritto di recesso', href: 'informazioni.html#recesso' },
        { label: 'Privacy e cookie', href: 'informazioni.html#privacy' }
      ] }
    ],

    contacts: {
      company: 'Tenuta Valmora S.S. Agricola',
      street: 'Via dei Colli Euganei 42',
      city: '35037 Teolo (Padova) - Italia',
      place: 'Teolo, Colli Euganei (Padova)',
      phone: '+39 049 892 4110',
      phoneHref: 'tel:+390498924110',
      email: 'tenutavalmora@gmail.com'
    },

    social: [
      { label: 'Instagram', href: 'https://instagram.com',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>' },
      { label: 'Facebook', href: 'https://facebook.com',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>' },
      { label: 'YouTube', href: 'https://youtube.com',
        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>' }
    ],

    footer: {
      about: 'Cantina storica dei Colli Euganei guidata dalla stessa famiglia da quattro generazioni. \n            Produzione artigianale di vini rossi d\'autore su suoli vulcanici d\'eccellenza.',
      navigation: [
        { label: 'Home', href: 'index.html' },
        { label: 'La Cantina & Chi siamo', href: 'chi-siamo.html' },
        { label: 'Shop Vini d\'Autore', href: 'shop.html' },
        { label: 'Contatti & Prenotazioni', href: 'contatti.html' }
      ],
      information: [
        { label: 'Condizioni di Vendita', href: 'informazioni.html#condizioni' },
        { label: 'Spedizioni & Imballaggi', href: 'informazioni.html#spedizioni' },
        { label: 'Diritto di Recesso', href: 'informazioni.html#recesso' },
        { label: 'Privacy Policy', href: 'informazioni.html#privacy' },
        { label: 'Cookie Policy', href: 'informazioni.html#cookie' }
      ],
      copyright: '&copy; 2026 Tenuta Valmora S.S. Tutti i diritti riservati. P.IVA 03498120284.',
      badge: 'Sito dimostrativo sviluppato via Vibe Coding &bull; Stripe Test Mode attivo'
    }
  };

  // ==========================================================================

  var script = document.currentScript;
  var part = script ? script.getAttribute('data-part') : null;
  var currentPage = document.body ? document.body.getAttribute('data-page') : null;

  function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  function link(item, className) {
    return '<a href="' + escapeAttr(item.href) + '"' + (className ? ' class="' + className + '"' : '') + '>' + item.label + '</a>';
  }

  // Chiave di pagina di un link interno ("index.html#radici" -> "home").
  function pageOf(href) {
    var file = href.split('#')[0].split('?')[0];
    for (var key in CONFIG.pages) {
      if (CONFIG.pages[key].href === file) return key;
    }
    return null;
  }

  // --- Markup ---------------------------------------------------------------

  function headerNav(keys, label) {
    var html = '<nav class="site-header__nav" aria-label="' + label + '">';
    keys.forEach(function (key) {
      var page = CONFIG.pages[key];
      var current = key === currentPage ? ' aria-current="page"' : '';
      html += '<a href="' + page.href + '" class="site-header__link"' + current + '>' + page.label + '</a>';
    });
    return html + '</nav>';
  }

  function headerMarkup() {
    var overlay = currentPage === 'home' ? ' site-header--overlay' : '';
    return '' +
      '<div class="topbar">\n' +
      '    <span>' + CONFIG.topbar + '</span>\n' +
      '  </div>\n' +
      '  <header class="site-header' + overlay + '">\n' +
      '    <div class="container header-inner">\n' +
      '      <div class="site-header__side site-header__side--left">\n' +
      '        <button type="button" class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Apri menu" aria-controls="mobile-nav-drawer" aria-expanded="false">' +
                 '<span class="site-header__menu-line" aria-hidden="true"></span><span class="site-header__menu-text">Menu</span></button>\n' +
      '        ' + headerNav(CONFIG.headerLeft, 'Navigazione principale') + '\n' +
      '      </div>\n' +
      '      <a href="index.html" class="brand-logo-link" aria-label="Tenuta Valmora Home">' +
               '<img src="assets/images/logo-valmora.svg" alt="" class="brand-logo-img" width="40" height="40">' +
               '<span class="brand-title">Tenuta Valmora</span></a>\n' +
      '      <div class="site-header__side site-header__side--right">\n' +
      '        ' + headerNav(CONFIG.headerRight, 'Shop e contatti') + '\n' +
      '        <div class="header-actions">\n' +
      '          <button type="button" class="cart-toggle-btn" aria-label="Visualizza carrello">' +
                   '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
                   '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>' +
                   '<span class="site-header__cart-text">Carrello</span>' +
                   '<span class="cart-badge" style="display:none;">0</span></button>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </header>\n' +
      '  ' + menuMarkup() + '\n';
  }

  function menuMarkup() {
    var cols = CONFIG.menu.map(function (col) {
      var page = CONFIG.pages[col.page];
      var id = 'site-menu-list-' + col.page;
      var current = col.page === currentPage;
      var items = col.links.map(function (item) {
        return '<li>' + link(item, 'site-menu__link') + '</li>';
      }).join('');
      return '<li class="site-menu__col' + (current ? ' site-menu__col--current' : '') + '">' +
          '<div class="site-menu__head">' +
            '<a href="' + page.href + '" class="site-menu__title"' + (current ? ' aria-current="page"' : '') + '>' + page.label + '</a>' +
            '<button type="button" class="site-menu__toggle" aria-expanded="false" aria-controls="' + id + '" aria-label="Voci di ' + page.label + '">' +
              '<span class="site-menu__plus" aria-hidden="true"></span></button>' +
          '</div>' +
          '<ul class="site-menu__list" id="' + id + '">' + items + '</ul>' +
        '</li>';
    }).join('');

    var social = CONFIG.social.map(function (item) {
      return '<li><a href="' + item.href + '" target="_blank" rel="noopener">' + item.label + '</a></li>';
    }).join('');

    return '' +
      '<div class="mobile-nav-overlay" id="mobile-nav-overlay"></div>\n' +
      '  <aside class="mobile-nav-drawer site-menu" id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Menu">' +
        '<div class="site-menu__top">' +
          '<button type="button" class="site-menu__close" id="mobile-drawer-close" aria-label="Chiudi menu">' +
            '<span class="site-menu__x" aria-hidden="true"></span><span>Chiudi</span></button>' +
          '<a href="index.html" class="site-menu__brand" aria-label="Tenuta Valmora Home">' +
            '<img src="assets/images/logo-valmora.svg" alt="" width="40" height="40">' +
            '<span class="site-menu__brand-name">Tenuta Valmora</span></a>' +
        '</div>' +
        '<nav class="site-menu__nav" aria-label="Menu principale"><ul class="site-menu__cols">' + cols + '</ul></nav>' +
        '<div class="site-menu__bottom">' +
          '<a href="mailto:' + CONFIG.contacts.email + '">' + CONFIG.contacts.email + '</a>' +
          '<a href="' + CONFIG.contacts.phoneHref + '">' + CONFIG.contacts.phone + '</a>' +
          '<ul class="site-menu__social" aria-label="Social">' + social + '</ul>' +
        '</div>' +
      '</aside>';
  }

  function footerList(items) {
    return items.map(function (item) {
      return '            <li>' + link(item) + '</li>';
    }).join('\n');
  }

  // Stessa struttura e stessi stili inline del footer originale della Home.
  function footerMarkup() {
    var c = CONFIG.contacts;
    var f = CONFIG.footer;
    var social = CONFIG.social.map(function (item) {
      return '            <a href="' + item.href + '" target="_blank" rel="noopener" class="social-icon-btn" aria-label="' + item.label + '">\n' +
             '              ' + item.icon + '\n' +
             '            </a>';
    }).join('\n');

    return '' +
      '<footer class="site-footer">\n' +
      '    <div class="container">\n' +
      '      <div class="footer-grid">\n' +
      '        <div class="footer-col footer-about">\n' +
      '          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem;">\n' +
      '            <img src="assets/images/logo-valmora.svg" alt="Tenuta Valmora" style="width:38px; height:38px;">\n' +
      '            <span style="font-family:var(--font-serif); font-size:1.3rem; color:#FFFFFF; font-weight:700;">TENUTA VALMORA</span>\n' +
      '          </div>\n' +
      '          <p>\n' +
      '            ' + f.about + '\n' +
      '          </p>\n' +
      '          <div class="footer-social">\n' + social + '\n' +
      '          </div>\n' +
      '        </div>\n\n' +
      '        <div class="footer-col">\n' +
      '          <h4>Navigazione</h4>\n' +
      '          <ul class="footer-links">\n' + footerList(f.navigation) + '\n' +
      '          </ul>\n' +
      '        </div>\n\n' +
      '        <div class="footer-col">\n' +
      '          <h4>Informazioni</h4>\n' +
      '          <ul class="footer-links">\n' + footerList(f.information) + '\n' +
      '          </ul>\n' +
      '        </div>\n\n' +
      '        <div class="footer-col">\n' +
      '          <h4>Sede & Contatti</h4>\n' +
      '          <p style="font-size:0.88rem; line-height:1.7; color:#D6C2C7; margin-bottom:0.75rem;">\n' +
      '            <strong>' + c.company + '</strong><br>\n' +
      '            ' + c.street + '<br>\n' +
      '            ' + c.city + '\n' +
      '          </p>\n' +
      '          <p style="font-size:0.85rem; color:#D6C2C7;">\n' +
      '            Tel: ' + c.phone + '<br>\n' +
      '            Mail: <a href="mailto:' + c.email + '" style="color:var(--color-gold);">' + c.email + '</a>\n' +
      '          </p>\n' +
      '        </div>\n' +
      '      </div>\n\n' +
      '      <div class="footer-bottom">\n' +
      '        <div>\n' +
      '          ' + f.copyright + '\n' +
      '        </div>\n' +
      '        <div class="footer-test-badge">\n' +
      '          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2zm0-10h2v8h-2z"/></svg>\n' +
      '          ' + f.badge + '\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </footer>\n';
  }

  // ==========================================================================
  // COMPORTAMENTO (una sola volta per pagina, dall'include dell'header)
  // ==========================================================================

  function initBehaviour() {
    var root = document.documentElement;
    var header = document.querySelector('.site-header');
    var drawer = document.getElementById('mobile-nav-drawer');
    var overlay = document.getElementById('mobile-nav-overlay');
    var menuBtn = document.getElementById('mobile-menu-btn');
    var closeBtn = document.getElementById('mobile-drawer-close');
    if (!header || !drawer || !menuBtn || !closeBtn) return;

    var isOverlay = header.classList.contains('site-header--overlay');
    var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var mobile = window.matchMedia ? window.matchMedia('(max-width: 767px)') : { matches: false };

    function menuOpen() {
      return drawer.classList.contains('open');
    }

    // --- Header: pieno dopo la hero (Home) e nascosto scorrendo verso il basso

    var heroBottom = 0;
    var headerBottom = 0;
    var solid = false;
    var hidden = false;
    var lastY = window.scrollY;
    var ticking = false;

    function measure() {
      var sy = window.scrollY;
      var rect = header.getBoundingClientRect();
      // Posizione naturale dell'header (sotto la topbar), indipendente dalla traslazione.
      var topbar = document.querySelector('.topbar');
      headerBottom = (topbar ? topbar.offsetHeight : 0) + rect.height;
      var hero = isOverlay ? document.querySelector('.home-hero') : null;
      heroBottom = hero ? hero.getBoundingClientRect().bottom + sy : 0;
      update();
    }

    function setHidden(value) {
      if (value === hidden) return;
      hidden = value;
      header.classList.toggle('site-header--hidden', value);
    }

    function update() {
      ticking = false;
      var y = window.scrollY;
      var dy = y - lastY;
      lastY = y;

      if (isOverlay) {
        var isSolid = y > heroBottom - header.offsetHeight;
        if (isSolid !== solid) {
          solid = isSolid;
          header.classList.toggle('site-header--solid', isSolid);
        }
      }

      if (menuOpen()) return;
      // Mai nascosto in cima alla pagina (e nella Home finché si è sulla hero).
      var limit = isOverlay ? Math.max(heroBottom, headerBottom) : headerBottom * 2;
      if (y <= limit) setHidden(false);
      else if (dy > 6 && !header.contains(document.activeElement)) setHidden(true);
      else if (dy < -6) setHidden(false);
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('load', measure);
    header.addEventListener('focusin', function () { setHidden(false); });
    measure();
    if (reduceMotion) root.classList.add('site-reduced-motion');

    // --- Pannello: apertura e chiusura ------------------------------------

    // Su ordine-confermato.html main.js non è incluso: senza di lui nessuno
    // aggiungerebbe la classe "open", quindi qui il pannello lo gestisce layout.js.
    function bindOwnToggle() {
      if (document.querySelector('script[src*="main.js"]')) return;
      function open() {
        drawer.classList.add('open');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      function close() {
        drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
      menuBtn.addEventListener('click', open);
      closeBtn.addEventListener('click', close);
      if (overlay) overlay.addEventListener('click', close);
    }

    // Senza carrello laterale (cart.js assente) il bottone porta allo shop.
    function bindCartFallback() {
      if (document.getElementById('cart-drawer')) return;
      var cartBtn = header.querySelector('.cart-toggle-btn');
      if (!cartBtn) return;
      cartBtn.setAttribute('aria-label', 'Vai allo shop');
      cartBtn.addEventListener('click', function () {
        window.location.href = CONFIG.pages.shop.href;
      });
    }

    // --- Pannello: accessibilità (vale anche quando lo apre main.js) --------

    var wasOpen = false;

    function syncOpen() {
      var open = menuOpen();
      if (open === wasOpen) return;
      wasOpen = open;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        setHidden(false);
        setTimeout(function () {
          if (menuOpen()) closeBtn.focus();
        }, 60);
      } else if (drawer.contains(document.activeElement) || document.activeElement === document.body) {
        menuBtn.focus();
      }
    }

    if ('MutationObserver' in window) {
      new MutationObserver(syncOpen).observe(drawer, { attributes: true, attributeFilter: ['class'] });
    }

    // Elementi raggiungibili con Tab (esclusi quelli nascosti della fisarmonica).
    function focusables() {
      return Array.prototype.filter.call(
        drawer.querySelectorAll('a[href], button:not([disabled])'),
        function (el) { return el.offsetParent !== null; }
      );
    }

    document.addEventListener('keydown', function (e) {
      if (!menuOpen()) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeBtn.click();
        return;
      }
      if (e.key !== 'Tab') return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (!drawer.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // --- Fisarmonica (sotto 768px): una sezione aperta alla volta ----------

    var toggles = drawer.querySelectorAll('.site-menu__toggle');
    Array.prototype.forEach.call(toggles, function (toggle) {
      toggle.addEventListener('click', function () {
        var opening = toggle.getAttribute('aria-expanded') !== 'true';
        Array.prototype.forEach.call(toggles, function (other) {
          var on = other === toggle && opening;
          other.setAttribute('aria-expanded', on ? 'true' : 'false');
          other.closest('.site-menu__col').classList.toggle('site-menu__col--open', on);
        });
      });
    });

    // --- Link con ancora sulla stessa pagina: chiude il pannello e scorre ---

    drawer.addEventListener('click', function (e) {
      var anchor = e.target.closest ? e.target.closest('a[href*="#"]') : null;
      if (!anchor || !menuOpen()) return;
      var href = anchor.getAttribute('href');
      if (pageOf(href) !== currentPage) return;
      var target = document.getElementById(href.split('#')[1]);
      if (!target) return;
      e.preventDefault();
      closeBtn.click();
      if (history.replaceState) history.replaceState(null, '', '#' + target.id);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });

    // Con la fisarmonica chiusa su mobile, al cambio di larghezza si riparte puliti.
    if (mobile.addEventListener) {
      mobile.addEventListener('change', function () {
        Array.prototype.forEach.call(toggles, function (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.closest('.site-menu__col').classList.remove('site-menu__col--open');
        });
      });
    }

    document.addEventListener('DOMContentLoaded', function () {
      bindOwnToggle();
      bindCartFallback();
      measure();
    });
  }

  // ==========================================================================
  // AVVIO
  // ==========================================================================

  if (!script) return;

  if (part === 'header') {
    script.insertAdjacentHTML('beforebegin', headerMarkup());
    if (!window.__valmoraLayout) {
      window.__valmoraLayout = true;
      initBehaviour();
    }
  } else if (part === 'footer') {
    script.insertAdjacentHTML('beforebegin', footerMarkup());
  }
})();
