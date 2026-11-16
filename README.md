# 🍷 Tenuta Valmora — Cantina Storica nei Colli Euganei

Sito web e-commerce e istituzionale realizzato per **Tenuta Valmora**, cantina storica a conduzione familiare giunta alla quarta generazione, rinomata per i suoi grandi rossi d'autore vulcanici.

Ispirato al prestigio visivo, all'eleganza classica e allo storytelling cinematografico di [antinori.it](https://antinori.it), il sito integra l'identità visiva e la palette cromatica ufficiale del brand (bordeaux profondo, oro caldo e carta papiro).

---

## 🌟 Pagine & Struttura del Sito

1. **Home (`index.html`)**:
   - Presentazione della tenuta e dell'eredità di 4 generazioni nei Colli Euganei.
   - Sintesi dei prodotti principali e dei grandi rossi d'autore (Valmora Rosso DOC, Eremo di San Giorgio Cabernet Riserva, Vulcano Nero Carmenère).
   - Approfondimento sul terroir vulcanico sottomarino vecchio di 35 milioni di anni.
   - Invito alle visite in bottaia e iscrizione al Club Valmora.

2. **Chi siamo (`chi-siamo.html`)**:
   - Storia completa attraverso quattro generazioni: dal 1928 con nonno Giovanni fino alla quarta generazione odierna.
   - Mission e valori: rispetto della terra (viticoltura biologica), l'arte del tempo (affinamenti lunghi in rovere francese) e l'impronta minerale vulcanica.
   - Galleria visiva della famiglia, delle vigne e della bottaia sotterranea scavata nel basalto.

3. **Shop (`shop.html`)**:
   - Catalogo completo con schede dettagliate, immagini ad alta risoluzione, descrizioni sintetiche, annate, formati e prezzi.
   - Filtri interattivi per categoria (*Tutti i Vini*, *Rossi Classici*, *Grandi Riserve*, *Passito DOCG*).
   - Ordinamento per *Consigliati*, *Prezzo crescente/decrescente* e *Punteggio critica*.
   - Modale scheda vino con note di degustazione complete (esame visivo, olfattivo, gustativo) e abbinamenti consigliati.
   - Pulsanti di acquisto rapido con aggiunta immediata al carrello.

4. **Contatti (`contatti.html`)**:
   - Indirizzo completo a Teolo (PD) nei Colli Euganei, orari di apertura, orari delle degustazioni guidate, telefono, WhatsApp ed email.
   - Link diretti ai canali social media ufficiali (Instagram, Facebook, YouTube).
   - **Form di Contatto conforme alle specifiche richieste:**
     - Campo **Nome** (obbligatorio)
     - Campo **La tua mail** (obbligatorio)
     - Campo **Messaggio (facoltativo)**
     - *Regola di validazione:* il form viene bloccato con messaggi d'errore puntuali e **non può essere inviato** se non vengono compilati almeno "Nome" e un'email valida.
     - Feedback visivo di conferma invio elegante e personalizzato.

5. **Ordine Confermato (`ordine-confermato.html`)**:
   - Pagina di ringraziamento e conferma d'ordine mostrata subito dopo il completamento del checkout.
   - Numero d'ordine univoco (es. `#TV-2026-8491`), data e ID transazione Stripe (`pi_test_...`).
   - Riepilogo completo di destinatario, indirizzo di spedizione isotermica, tabella prodotti acquistati, subtotale e spedizione.
   - Pulsante per la stampa/salvataggio della ricevuta fiscale in PDF.

---

## 🛒 Funzionalità Avanzate

### 1. E-Commerce & Carrello Persistente
- Carrello laterale a comparsa (*slide-over drawer*) accessibile da ogni pagina.
- Sincronizzazione automatica del carrello tramite `localStorage` (non perdi i prodotti cambiando pagina).
- Barra di avanzamento per la **Spedizione Gratuita** (soglia a 99,00€ con calcolo in tempo reale dell'importo mancante).
- Notifiche toast eleganti al momento dell'aggiunta dei prodotti.

### 2. Pagamento Stripe in Modalità Test
- Modale di checkout ispirata all'interfaccia di *Stripe Elements*.
- Pulsante di autocompilazione rapida con le credenziali di test ufficiali di Stripe (`4242 4242 4242 4242`).
- Simulazione completa del flusso bancario (connessione ai server Stripe, autorizzazione crittografata, generazione ricevuta).
- Transizione automatica alla pagina di conferma d'ordine.

### 3. Chatbot Sommelier Virtuale Integrato
- Assistente virtuale fluttuante presente su tutte le pagine del sito.
- Risponde con precisione alle domande fondamentali:
  - **Orari:** orari di apertura, orari e modalità per le visite guidate e le degustazioni.
  - **Spedizioni:** corrieri refrigerati, imballaggi isotermici anti-urto, costi e tempi (24/48h).
  - **Resi:** politica di recesso entro 14 giorni e garanzia "bottiglia perfetta" (sostituzione gratuita immediata per bottiglie difettose o con sentore di tappo).
  - **Vini & Abbinamenti:** consigli personalizzati sui vini della cantina in base al menu o all'occasione, con **scheda vino e pulsante "Aggiungi al carrello" direttamente all'interno della chat!**
- Supporta sia chip a risposta rapida sia domande in linguaggio naturale con comprensione semantica degli intenti.

---

## 🚀 Come Avviare il Progetto in Locale

Il progetto è sviluppato in HTML5, CSS3 moderno e JavaScript modulare senza dipendenze pesanti, quindi è velocissimo e funziona immediatamente.

Puoi avviare un server locale con Python (già installato sul tuo sistema):

```bash
cd "C:\Users\Matteo\.gemini\antigravity\scratch\tenuta-valmora"
python -m http.server 3000
```

Poi apri il browser su: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Come Pubblicare il Sito su Vercel

Il progetto include già il file di configurazione `vercel.json`.

### Metodo 1: Tramite Dashboard di Vercel (Consigliato & Semplicissimo)
1. Vai su [vercel.com](https://vercel.com) e accedi con il tuo account (es. GitHub).
2. Carica la cartella `tenuta-valmora` su un nuovo repository GitHub oppure trascinala su Vercel.
3. Vercel riconoscerà automaticamente il sito statico e lo pubblicherà in pochi secondi fornendoti un URL pubblico HTTPS (es. `tenuta-valmora.vercel.app`).

### Metodo 2: Tramite Vercel CLI
Se hai installato Node.js / Vercel CLI:
```bash
npx vercel
```
Segui i 3 semplici passaggi a video e il tuo sito sarà immediatamente online in tutto il mondo!
