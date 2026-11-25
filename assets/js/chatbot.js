(() => {
  const root = document.querySelector('.chatbot-wrapper');
  if (!root) return;

  const links = {
    visita: ['Prenota una visita', 'contatti.html#scrivici'],
    spedizioni: ['Condizioni di spedizione', 'informazioni.html#spedizioni'],
    resi: ['Diritto di recesso', 'informazioni.html#recesso'],
    shop: ['Esplora i vini', 'shop.html'],
    storia: ['La nostra storia', 'chi-siamo.html'],
    contatti: ['Contatta la tenuta', 'contatti.html#recapiti']
  };
  const sendIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>';

  root.innerHTML = `
    <button type="button" class="chatbot-trigger-btn" id="chatbot-trigger-btn" aria-expanded="false" aria-controls="chatbot-window">
      <span class="chatbot-mark" aria-hidden="true"><img src="assets/images/logo-valmora.svg" alt="" width="34" height="34"></span>
      <span>Sommelier Virtuale</span>
      <svg class="chatbot-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
    </button>
    <section class="chatbot-window" id="chatbot-window" role="dialog" aria-labelledby="chatbot-title" inert>
      <header class="chatbot-header">
        <span class="chatbot-mark" aria-hidden="true"><img src="assets/images/logo-valmora.svg" alt="" width="38" height="38"></span>
        <div>
          <h2 id="chatbot-title">Sommelier Virtuale</h2>
          <p>Assistente IA di Tenuta Valmora</p>
        </div>
        <button type="button" class="chatbot-header-close" id="chatbot-close-btn" aria-label="Chiudi la chat">×</button>
      </header>
      <div class="chatbot-messages" id="chatbot-messages" role="log" aria-label="Conversazione" aria-live="polite" aria-relevant="additions">
        <div class="chat-bubble bot"><p>Ciao! Ti aiuto a scegliere un vino, organizzare una visita o trovare informazioni su ordini e spedizioni.</p></div>
      </div>
      <p class="chatbot-progress" role="status" hidden>Sto preparando la risposta…</p>
      <div class="chatbot-bottom">
        <div class="chatbot-chips" role="group" aria-label="Domande rapide">
          <button type="button" class="chip-btn" data-topic="orari">Orari e visite</button>
          <button type="button" class="chip-btn" data-topic="spedizioni">Spedizioni</button>
          <button type="button" class="chip-btn" data-topic="resi">Resi</button>
          <button type="button" class="chip-btn" data-topic="vino">Consigli sui vini</button>
          <button type="button" class="chip-btn" data-topic="storia">La nostra storia</button>
          <button type="button" class="chip-btn" data-topic="contatti">Contatti</button>
        </div>
        <form class="chatbot-input-area" id="chatbot-form">
          <textarea id="chatbot-input" class="chatbot-input" aria-label="Scrivi una domanda" placeholder="Scrivi una domanda…" rows="1" maxlength="1200"></textarea>
          <button type="submit" class="chatbot-send-btn" aria-label="Invia la domanda">${sendIcon}</button>
        </form>
        <p class="chatbot-note">Evita di inserire dati personali.</p>
      </div>
    </section>`;

  const trigger = root.querySelector('#chatbot-trigger-btn');
  const panel = root.querySelector('#chatbot-window');
  const close = root.querySelector('#chatbot-close-btn');
  const log = root.querySelector('#chatbot-messages');
  const progress = root.querySelector('.chatbot-progress');
  const form = root.querySelector('#chatbot-form');
  const input = root.querySelector('#chatbot-input');
  const send = root.querySelector('.chatbot-send-btn');
  const quickQuestions = root.querySelector('.chatbot-chips');
  quickQuestions?.addEventListener('wheel', event => {
    // Leave native horizontal gestures, Shift+wheel and zoom to the browser.
    if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
    const maximum = quickQuestions.scrollWidth - quickQuestions.clientWidth;
    const start = quickQuestions.scrollLeft;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? quickQuestions.clientWidth : 1;
    const destination = Math.min(maximum, Math.max(0, start + event.deltaY * unit));
    if (maximum <= 0 || Math.abs(destination - start) < .5) return;
    event.preventDefault();
    quickQuestions.scrollLeft = destination;
  }, { passive: false });

  const chips = [...root.querySelectorAll('.chip-btn')];
  const currency = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
  let history = [];
  let busy = false;

  function fitViewport() {
    if (!window.visualViewport) return;
    const { height, offsetTop } = window.visualViewport;
    root.style.setProperty('--chatbot-viewport', height + 'px');
    root.style.setProperty('--chatbot-keyboard', Math.max(0, window.innerHeight - height - offsetTop) + 'px');
    root.classList.toggle('chatbot-compact', height < 480);
  }

  function setOpen(open) {
    trigger.setAttribute('aria-expanded', String(open));
    panel.inert = !open;
    panel.classList.toggle('open', open);
    if (open) {
      fitViewport();
      close.focus({ preventScroll: true });
    }
    else trigger.focus({ preventScroll: true });
  }

  function appendMessage(text, role) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + role;
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    bubble.append(paragraph);
    log.append(bubble);
    return bubble;
  }

  function appendProduct(bubble, id) {
    const product = window.getProductById?.(id);
    if (!product) return;
    const card = document.createElement('div');
    card.className = 'chat-product-card';
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = '';
    image.width = 40;
    image.height = 56;
    image.loading = 'lazy';
    const name = document.createElement('strong');
    name.textContent = `${product.name} · ${product.vintage}`;
    const price = document.createElement('span');
    price.textContent = currency.format(product.price);
    const info = document.createElement('div');
    info.append(name, price);
    const cart = document.createElement('button');
    cart.type = 'button';
    cart.className = 'chatbot-add';
    cart.textContent = 'Aggiungi';
    cart.setAttribute('aria-label', 'Aggiungi ' + product.name + ' al carrello');
    cart.addEventListener('click', () => window.addToCart?.(product.id, 1));
    card.append(image, info);
    if (typeof window.addToCart === 'function') card.append(cart);
    bubble.append(card);
  }

  function appendLinks(bubble, ids) {
    const group = document.createElement('div');
    group.className = 'chatbot-links';
    for (const id of ids) {
      if (!Object.hasOwn(links, id)) continue;
      const link = document.createElement('a');
      const [label, href] = links[id];
      link.href = href;
      link.textContent = label + ' ↗';
      group.append(link);
    }
    if (group.childElementCount) bubble.append(group);
  }

  function setBusy(value) {
    busy = value;
    progress.hidden = !value;
    // Keep focus on the originating button while a response is pending.
    for (const button of [send, ...chips]) {
      if (value) button.setAttribute('aria-disabled', 'true');
      else button.removeAttribute('aria-disabled');
    }
  }

  async function ask(question, topic, retryFrom) {
    if (busy) return;
    retryFrom?.remove();
    log.querySelectorAll('.chatbot-retry').forEach(button => button.remove());
    if (!retryFrom) appendMessage(question, 'user');
    const message = { role: 'user', content: question };
    const messages = [...history, message];
    setBusy(true);
    log.scrollTop = log.scrollHeight;
    let errorMessage = 'Non riesco a raggiungere la chat. Riprova tra poco.';
    try {
      const response = await fetch('/api/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(topic ? { topic } : { messages }),
        signal: AbortSignal.timeout(22_000)
      });
      const result = await response.json();
      if (!response.ok) {
        if (typeof result.error === 'string') errorMessage = result.error;
        throw new Error('Chat unavailable');
      }
      if (typeof result.answer !== 'string' || !result.answer.trim()) throw new Error('Empty answer');
      const bubble = appendMessage(result.answer, 'bot');
      if (Array.isArray(result.productIds)) result.productIds.slice(0, 2).forEach(id => appendProduct(bubble, id));
      if (Array.isArray(result.links)) appendLinks(bubble, result.links);
      history = [...messages, { role: 'assistant', content: result.answer }].slice(-10);
    } catch {
      const bubble = appendMessage(errorMessage, 'bot chat-error');
      appendLinks(bubble, ['contatti']);
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'chatbot-retry';
      retry.textContent = 'Riprova';
      retry.addEventListener('click', () => {
        if (busy) return;
        input.focus({ preventScroll: true });
        ask(question, topic, bubble);
      });
      bubble.append(retry);
    } finally {
      setBusy(false);
      log.scrollTop = log.scrollHeight;
    }
  }

  window.visualViewport?.addEventListener('resize', fitViewport);
  window.visualViewport?.addEventListener('scroll', fitViewport);
  trigger.addEventListener('click', () => setOpen(trigger.getAttribute('aria-expanded') !== 'true'));
  close.addEventListener('click', () => setOpen(false));
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.inert) {
      event.stopPropagation();
      setOpen(false);
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || busy) return;
    input.value = '';
    ask(question);
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  chips.forEach(chip => {
    chip.addEventListener('click', () => ask(chip.textContent.trim(), chip.dataset.topic));
  });
})();
