// ==========================================================================
// TENUTA VALMORA - CHATBOT SOMMELIER VIRTUALE
// Risposte intelligenti a orari, spedizioni, resi, abbinamenti e prodotti
// ==========================================================================

const CHAT_KNOWLEDGE = {
  orari: {
    title: "Orari di Apertura & Visite in Cantina",
    text: "La nostra cantina e la sala degustazione a Teolo (Colli Euganei) sono aperte con i seguenti orari:<br><br>" +
          "• <strong>Lunedì – Sabato:</strong> 09:30 – 19:00<br>" +
          "• <strong>Domenica:</strong> 10:00 – 18:00 (su prenotazione)<br><br>" +
          "Organizziamo <strong>visite guidate con degustazione</strong> tra le vigne e la bottaia storica tutti i giorni alle ore <strong>11:00</strong> e alle <strong>16:30</strong>. Puoi prenotare compilando il modulo nella pagina Contatti o chiamandoci direttamente al +39 049 892 4110."
  },
  spedizioni: {
    title: "Spedizioni e Consegna",
    text: "Spediamo in tutta Italia e nell'Unione Europea con la massima cura:<br><br>" +
          "• <strong>Tempi di consegna:</strong> 24/48 ore lavorative (72 ore per isole e zone remote).<br>" +
          "• <strong>Spedizione Gratuita:</strong> per tutti gli ordini superiori a <strong>€99,00</strong>.<br>" +
          "• <strong>Costo standard:</strong> €7,90 per ordini inferiori alla soglia.<br>" +
          "• <strong>Imballaggi isotermici:</strong> utilizziamo solo cantinette brevettate anti-urto e a temperatura controllata per preservare l'integrità aromatica dei nostri vini."
  },
  resi: {
    title: "Politica Resi e Garanzia 'Bottiglia Perfetta'",
    text: "La tua serenità è al primo posto:<br><br>" +
          "• <strong>Diritto di recesso:</strong> hai 14 giorni di tempo dalla ricezione per restituire l'ordine.<br>" +
          "• <strong>Bottiglia con sentore di tappo o difetto:</strong> te la sostituiamo gratuitamente a nostre spese o ti rimborsiamo l'intero importo, senza discussioni.<br>" +
          "• <strong>Pacco danneggiato dal corriere:</strong> basta inviarci una foto a <em>ordini@tenutavalmora.it</em> e rispediremo subito una nuova cassa di vino."
  },
  contatti: {
    title: "Dove Siamo e Recapiti",
    text: "<strong>Tenuta Valmora</strong><br>" +
          "Via dei Colli Euganei 42, 35037 Teolo (Padova), Italia<br><br>" +
          "• Telefono Cantina: <strong>+39 049 892 4110</strong><br>" +
          "• Email Informazioni: <strong>info@tenutavalmora.it</strong><br>" +
          "• Email Ordini: <strong>ordini@tenutavalmora.it</strong>"
  }
};

// Genera messaggio del bot nel DOM
function appendBotMessage(htmlContent, product = null) {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble bot';
  bubble.innerHTML = htmlContent;

  if (product) {
    const prodCard = document.createElement('div');
    prodCard.className = 'chat-product-card';
    prodCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="chat-product-thumb">
      <div class="chat-product-info">
        <h5>${product.name} (${product.vintage})</h5>
        <p>${product.appellation}</p>
        <div class="price">€${product.price.toFixed(2)}</div>
        <button type="button" class="btn btn-primary btn-sm" style="margin-top:4px; padding:0.35rem 0.75rem; font-size:0.75rem;" onclick="window.addToCart('${product.id}', 1)">
          Aggiungi al Carrello
        </button>
      </div>
    `;
    bubble.appendChild(prodCard);
  }

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

// Genera messaggio dell'utente nel DOM
function appendUserMessage(text) {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble user';
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

// Elabora query dell'utente (AI Intent Matcher per vini e cantina)
function processUserQuery(query) {
  const q = query.toLowerCase().trim();

  // 1. Orari e visite
  if (q.includes('orari') || q.includes('apert') || q.includes('quando') || q.includes('visita') || q.includes('degustaz') || q.includes('tour') || q.includes('orario')) {
    appendBotMessage(CHAT_KNOWLEDGE.orari.text);
    return;
  }

  // 2. Spedizioni e consegne
  if (q.includes('spediz') || q.includes('tempi') || q.includes('costo') || q.includes('corriere') || q.includes('consegna') || q.includes('gratis') || q.includes('gratuita') || q.includes('isoter')) {
    appendBotMessage(CHAT_KNOWLEDGE.spedizioni.text);
    return;
  }

  // 3. Resi e garanzia
  if (q.includes('reso') || q.includes('resi') || q.includes('rotto') || q.includes('danneg') || q.includes('tappo') || q.includes('rimbors') || q.includes('garanz')) {
    appendBotMessage(CHAT_KNOWLEDGE.resi.text);
    return;
  }

  // 4. Dove siamo e contatti
  if (q.includes('contatt') || q.includes('dove') || q.includes('indirizz') || q.includes('telefono') || q.includes('mail') || q.includes('teolo') || q.includes('padova')) {
    appendBotMessage(CHAT_KNOWLEDGE.contatti.text);
    return;
  }

  // 5. Consigli su vini specifici
  if (q.includes('carmenere') || q.includes('vulcano') || q.includes('spezia')) {
    const prod = window.getProductById ? window.getProductById('vulcano-nero-carmenere') : null;
    appendBotMessage("Se cerchi un'esperienza unica legata all'anima vulcanica dei Colli Euganei, ti consiglio senza esitazione il nostro <strong>Vulcano Nero Carmenère Riserva 2020</strong>. Note di cardamomo, ginepro e mirtillo nero con una freschezza minerale straordinaria. Perfetto con selvaggina, arrosti o piatti al tartufo.", prod);
    return;
  }

  if (q.includes('cabernet') || q.includes('eremo') || q.includes('san giorgio') || q.includes('struttur')) {
    const prod = window.getProductById ? window.getProductById('eremo-san-giorgio-cabernet') : null;
    appendBotMessage("Per gli amanti dei grandi rossi da invecchiamento e meditazione: l'<strong>Eremo di San Giorgio Cabernet Sauvignon Riserva 2019</strong> (Tre Bicchieri Gambero Rosso). Affinato 24 mesi in barrique, sprigiona tabacco, cassis e grafite pura.", prod);
    return;
  }

  if (q.includes('dolce') || q.includes('passito') || q.includes('aura') || q.includes('moscato') || q.includes('fior d\'arancio') || q.includes('dessert')) {
    const prod = window.getProductById ? window.getProductById('fior-darancio-passito') : null;
    appendBotMessage("Per il dessert o per un momento di meditazione esclusivo, il nostro <strong>Aura d'Oro - Fior d'Arancio Passito DOCG</strong> è una poesia di zagara d'arancio, albicocca disidratata e miele d'acacia. Eccezionale anche abbinato a formaggi erborinati.", prod);
    return;
  }

  if (q.includes('prestigio') || q.includes('regalo') || q.includes('speciale') || q.includes('quattro generazioni') || q.includes('migliore') || q.includes('top')) {
    const prod = window.getProductById ? window.getProductById('quattro-generazioni-superiore') : null;
    appendBotMessage("La nostra opera magna è <strong>Quattro Generazioni Colli Euganei Rosso Superiore 2018</strong>. Prodotto in tiratura limitata con bottiglie numerate a mano e custodito in cofanetto di rovere pregiato. Il regalo di maggior prestigio per un vero intenditore.", prod);
    return;
  }

  if (q.includes('consigli') || q.includes('vino') || q.includes('cena') || q.includes('carne') || q.includes('abbinam') || q.includes('rosso')) {
    const prod = window.getProductById ? window.getProductById('valmora-rosso-doc') : null;
    appendBotMessage("Per una cena a base di carni o formaggi ti suggerisco il nostro cavallo di battaglia: <strong>Valmora Rosso DOC 2021</strong>. È il nostro rosso d'autore simbolo: armonico, con note di mora e spezie dolci, elegantemente affinato in legno.", prod);
    return;
  }

  // Risposta di default accogliente e proattiva
  appendBotMessage("Grazie per la tua domanda! Come Sommelier Virtuale di Tenuta Valmora posso fornirti subito dettagli su:<br><br>" +
    "• <strong>Orari e visite</strong> guidate in bottaia<br>" +
    "• <strong>Spedizioni</strong> sicure e gratuite oltre 99€<br>" +
    "• <strong>Politica resi</strong> e garanzia bottiglia perfetta<br>" +
    "• <strong>Consigli personalizzati</strong> per la tua cantina o per una cena speciale.<br><br>" +
    "Seleziona uno dei pulsanti rapidi in basso o scrivimi pure cosa vorresti degustare!");
}

// Trigger chips
function handleChipClick(topic) {
  if (topic === 'orari') {
    appendUserMessage("Quali sono gli orari e come funzionano le visite?");
    setTimeout(() => appendBotMessage(CHAT_KNOWLEDGE.orari.text), 300);
  } else if (topic === 'spedizioni') {
    appendUserMessage("Come funzionano le spedizioni e quali sono i costi?");
    setTimeout(() => appendBotMessage(CHAT_KNOWLEDGE.spedizioni.text), 300);
  } else if (topic === 'resi') {
    appendUserMessage("Qual è la vostra politica sui resi e sulle bottiglie danneggiate?");
    setTimeout(() => appendBotMessage(CHAT_KNOWLEDGE.resi.text), 300);
  } else if (topic === 'vino') {
    appendUserMessage("Potresti consigliarmi un vino per una cena importante?");
    const prod = window.getProductById ? window.getProductById('valmora-rosso-doc') : null;
    setTimeout(() => {
      appendBotMessage("Certamente! Il nostro <strong>Valmora Rosso Colli Euganei DOC 2021</strong> è la scelta perfetta per conquistare i tuoi ospiti: corposo ma vellutato, esalta arrosti e formaggi stagionati.", prod);
    }, 400);
  } else if (topic === 'contatti') {
    appendUserMessage("Come posso contattarvi direttamente?");
    setTimeout(() => appendBotMessage(CHAT_KNOWLEDGE.contatti.text), 300);
  }
}

// Inizializzazione Chatbot
function toggleChatbot() {
  const win = document.getElementById('chatbot-window');
  if (win) {
    win.classList.toggle('open');
    if (win.classList.contains('open')) {
      const input = document.getElementById('chatbot-input');
      if (input) input.focus();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const triggerBtn = document.getElementById('chatbot-trigger-btn');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');

  if (triggerBtn) triggerBtn.addEventListener('click', toggleChatbot);
  if (closeBtn) closeBtn.addEventListener('click', toggleChatbot);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input ? input.value.trim() : '';
      if (!val) return;

      appendUserMessage(val);
      input.value = '';

      setTimeout(() => {
        processUserQuery(val);
      }, 400);
    });
  }

  // Chip handlers
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.getAttribute('data-topic');
      handleChipClick(topic);
    });
  });
});

// Esporta globalmente
window.toggleChatbot = toggleChatbot;
window.handleChipClick = handleChipClick;
