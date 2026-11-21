/**
 * Tenuta Valmora - Google Analytics 4 Event Tracking
 * File: assets/js/analytics-events.js
 *
 * Gestisce l'invio degli eventi personalizzati ed e-commerce a GA4 (gtag)
 * dopo il caricamento della pagina (evento window 'load').
 */

(function () {
  'use strict';

  /**
   * Helper sicuro per inviare eventi a GA4.
   * Se window.gtag non esiste o non è una funzione, non genera errori e non fa nulla.
   *
   * @param {string} eventName - Nome dell'evento GA4
   * @param {Object} [params]  - Parametri associati all'evento
   */
  function trackEvent(eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        if (params && typeof params === 'object') {
          window.gtag('event', eventName, params);
        } else {
          window.gtag('event', eventName);
        }
      }
    } catch (err) {
      console.warn('Errore durante l\'invio dell\'evento GA4 [' + eventName + ']:', err);
    }
  }

  /**
   * 1) Avvolge le funzioni globali di e-commerce:
   *    - window.openProductModal(productId) -> evento "view_item"
   *    - window.addToCart(productId, qty)   -> evento "add_to_cart"
   *
   * Utilizza window.getProductById(id) per recuperare i dettagli dei prodotti.
   * Formato e-commerce GA4: currency "EUR", value, items: [{item_id, item_name, item_category, price, quantity}]
   */
  function wrapEcommerceFunctions() {
    // Wrapper per window.openProductModal
    try {
      if (typeof window.openProductModal === 'function') {
        const originalOpenProductModal = window.openProductModal;
        window.openProductModal = function (productId) {
          let result;
          try {
            result = originalOpenProductModal.apply(this, arguments);
          } catch (origErr) {
            console.error(origErr);
            throw origErr;
          }

          try {
            const product = (typeof window.getProductById === 'function')
              ? window.getProductById(productId)
              : null;

            if (product) {
              const price = typeof product.price === 'number'
                ? product.price
                : (parseFloat(product.price) || 0);

              const item = {
                item_id: String(product.id),
                item_name: product.name || String(product.id),
                price: price,
                quantity: 1
              };

              if (product.appellation) {
                item.item_category = product.appellation;
              }

              trackEvent('view_item', {
                currency: 'EUR',
                value: price,
                items: [item]
              });
            }
          } catch (trackErr) {
            console.warn('Errore tracciamento view_item:', trackErr);
          }

          return result;
        };
      }
    } catch (e) {
      console.warn('Errore avvolgimento openProductModal:', e);
    }

    // Wrapper per window.addToCart
    try {
      if (typeof window.addToCart === 'function') {
        const originalAddToCart = window.addToCart;
        window.addToCart = function (productId, qty) {
          let result;
          try {
            result = originalAddToCart.apply(this, arguments);
          } catch (origErr) {
            console.error(origErr);
            throw origErr;
          }

          try {
            const quantity = (typeof qty === 'number' && !isNaN(qty) && qty > 0)
              ? qty
              : (parseInt(qty, 10) || 1);

            const product = (typeof window.getProductById === 'function')
              ? window.getProductById(productId)
              : null;

            const price = product && typeof product.price === 'number'
              ? product.price
              : (product ? parseFloat(product.price) || 0 : 0);

            const item = {
              item_id: String(product ? product.id : productId),
              item_name: product ? product.name : String(productId),
              price: price,
              quantity: quantity
            };

            if (product && product.appellation) {
              item.item_category = product.appellation;
            }

            const totalValue = Number((price * quantity).toFixed(2));

            trackEvent('add_to_cart', {
              currency: 'EUR',
              value: totalValue,
              items: [item]
            });
          } catch (trackErr) {
            console.warn('Errore tracciamento add_to_cart:', trackErr);
          }

          return result;
        };
      }
    } catch (e) {
      console.warn('Errore avvolgimento addToCart:', e);
    }
  }

  /**
   * 2) Nella pagina ordine-confermato.html:
   *    Legge da sessionStorage "valmora_confirmed_order".
   *    SOLO se esiste (ordine reale) invia "purchase" con:
   *    - transaction_id = orderId
   *    - value = totals.total
   *    - shipping = totals.shipping
   *    - currency = "EUR"
   *    - items dal campo items
   *
   *    Evita doppi invii salvando in localStorage l'elenco degli orderId già inviati.
   */
  function trackPurchaseIfConfirmed() {
    try {
      const isConfirmationPage = window.location.pathname.includes('ordine-confermato') ||
                                 window.location.href.includes('ordine-confermato');
      if (!isConfirmationPage) return;

      const rawOrder = sessionStorage.getItem('valmora_confirmed_order');
      if (!rawOrder) return; // Ordine non presente: è una visita dimostrativa o accesso diretto

      const order = JSON.parse(rawOrder);
      if (!order || !order.orderId) return;

      const STORAGE_KEY = 'valmora_ga_sent_orders';
      let sentOrders = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          sentOrders = JSON.parse(stored);
        }
        if (!Array.isArray(sentOrders)) {
          sentOrders = [];
        }
      } catch (e) {
        sentOrders = [];
      }

      // Evita doppi invii se l'ordine è già stato tracciato
      if (sentOrders.indexOf(order.orderId) !== -1) {
        return;
      }

      const items = Array.isArray(order.items) ? order.items.map(function (it) {
        const prod = (typeof window.getProductById === 'function' && it.id)
          ? window.getProductById(it.id)
          : null;

        const price = typeof it.price === 'number'
          ? it.price
          : (parseFloat(it.price) || 0);

        const qty = typeof it.quantity === 'number'
          ? it.quantity
          : (parseInt(it.quantity, 10) || 1);

        const itemObj = {
          item_id: String(it.id || it.item_id),
          item_name: it.name || it.item_name || String(it.id),
          price: price,
          quantity: qty
        };

        const appellation = (prod && prod.appellation) || it.appellation || it.item_category;
        if (appellation) {
          itemObj.item_category = appellation;
        }

        return itemObj;
      }) : [];

      const totalValue = (order.totals && typeof order.totals.total === 'number')
        ? order.totals.total
        : (order.totals ? parseFloat(order.totals.total) || 0 : 0);

      const shippingValue = (order.totals && typeof order.totals.shipping === 'number')
        ? order.totals.shipping
        : (order.totals ? parseFloat(order.totals.shipping) || 0 : 0);

      trackEvent('purchase', {
        transaction_id: order.orderId,
        value: totalValue,
        shipping: shippingValue,
        currency: 'EUR',
        items: items
      });

      // Registra l'orderId come già tracciato
      sentOrders.push(order.orderId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sentOrders));
      } catch (e) {
        console.warn('Impossibile salvare orderId in localStorage:', e);
      }
    } catch (err) {
      console.warn('Errore durante il tracciamento purchase:', err);
    }
  }

  /**
   * 3) Tracciamento interazioni Chatbot (Sommelier Virtuale):
   *    - Clic su #chatbot-trigger-btn -> "chatbot_open" (solo all'apertura)
   *    - Clic su .chip-btn            -> "chatbot_question" con parametro topic = data-topic
   *    - Invio del form #chatbot-form -> "chatbot_message" (senza inviare il testo dell'utente)
   */
  function setupChatbotTracking() {
    try {
      // Clic su #chatbot-trigger-btn: solo quando il chatbot si apre
      const triggerBtn = document.getElementById('chatbot-trigger-btn');
      if (triggerBtn) {
        triggerBtn.addEventListener('click', function () {
          try {
            const checkOpen = function () {
              const win = document.getElementById('chatbot-window');
              if (win && win.classList.contains('open')) {
                trackEvent('chatbot_open');
              }
            };

            const win = document.getElementById('chatbot-window');
            // Se la classe 'open' è già stata inserita dal gestore sincrono di toggleChatbot
            if (win && win.classList.contains('open')) {
              trackEvent('chatbot_open');
            } else {
              // Se toggleChatbot viene eseguito asincronamente o successivamente
              setTimeout(checkOpen, 0);
            }
          } catch (e) {}
        });
      }

      // Clic sui bottoni chip (.chip-btn)
      const chips = document.querySelectorAll('.chip-btn');
      chips.forEach(function (btn) {
        btn.addEventListener('click', function () {
          try {
            const topic = btn.getAttribute('data-topic');
            if (topic) {
              trackEvent('chatbot_question', { topic: topic });
            }
          } catch (e) {}
        });
      });

      // Invio del form chatbot (#chatbot-form)
      const chatbotForm = document.getElementById('chatbot-form');
      if (chatbotForm) {
        chatbotForm.addEventListener('submit', function () {
          try {
            trackEvent('chatbot_message');
          } catch (e) {}
        });
      }
    } catch (err) {
      console.warn('Errore configurazione tracciamento chatbot:', err);
    }
  }

  /**
   * 4) Tracciamento Social:
   *    Con un unico ascoltatore dei clic sul documento, per i link a:
   *    - instagram.com
   *    - facebook.com
   *    - youtube.com
   *    Invia l'evento "social_click" con:
   *    - network: "instagram" | "facebook" | "youtube"
   *    - page: window.location.pathname
   */
  function setupSocialTracking() {
    try {
      document.addEventListener('click', function (event) {
        try {
          const anchor = event.target && event.target.closest ? event.target.closest('a') : null;
          if (!anchor) return;

          const href = anchor.href || anchor.getAttribute('href') || '';
          let network = null;

          if (href.indexOf('instagram.com') !== -1) {
            network = 'instagram';
          } else if (href.indexOf('facebook.com') !== -1) {
            network = 'facebook';
          } else if (href.indexOf('youtube.com') !== -1) {
            network = 'youtube';
          }

          if (network) {
            trackEvent('social_click', {
              network: network,
              page: window.location.pathname
            });
          }
        } catch (e) {}
      });
    } catch (err) {
      console.warn('Errore configurazione tracciamento social:', err);
    }
  }

  /**
   * Inizializzazione di tutti i tracciamenti all'evento window 'load'
   */
  function init() {
    try {
      wrapEcommerceFunctions();
      trackPurchaseIfConfirmed();
      setupChatbotTracking();
      setupSocialTracking();
    } catch (err) {
      console.warn('Errore inizializzazione analytics-events:', err);
    }
  }

  // Esegue dopo il caricamento della pagina (evento window 'load')
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
