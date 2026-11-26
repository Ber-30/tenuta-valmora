// Catalogo Ufficiale Tenuta Valmora - Vini d'Autore dei Colli Euganei
const PRODUCTS = [
  {
    id: "valmora-rosso-doc",
    name: "Valmora Rosso",
    appellation: "Colli Euganei Rosso DOC",
    vintage: "2021",
    category: "rossi",
    price: 28.00,
    badge: "Icona di Famiglia",
    rating: 94,
    alcohol: "14.5% Vol.",
    format: "750 ml",
    image: "assets/images/bottle-rosso.jpg",
    shortDescription: "Il nostro rosso d'autore simbolo: equilibrio magistrale tra Merlot e Cabernet sui suoli vulcanici.",
    description: "Espressione fedele della nostra collina, Valmora Rosso unisce la setosità del Merlot alla struttura minerale del Cabernet Sauvignon e alla nota speziata del Carmenère. Fermentato in tini di rovere e affinato 14 mesi in tonneaux, sprigiona un profilo aromatico profondo e inconfondibile.",
    grapes: "60% Merlot, 30% Cabernet Sauvignon, 10% Carmenère",
    terroir: "Pendici vulcaniche dei Colli Euganei, suoli ricchi di marna e basalto a 240m s.l.m.",
    tastingNotes: {
      visual: "Rosso rubino profondo con riflessi granati lucenti.",
      olfactory: "Bouquet avvolgente di ciliegia marasca matura, mora di rovo, macchia mediterranea e sottili sfumature di pepe nero e grafite.",
      taste: "Pieno, vellutato e di straordinaria armonia. I tannini sono levigati e conducono a un finale lungo con tocchi balsamici."
    },
    pairing: "Arrosti di manzo, carni rosse brasate al vino rosso, tagliata con rosmarino e formaggi stagionati dei pascoli veneti."
  },
  {
    id: "eremo-san-giorgio-cabernet",
    name: "Eremo di San Giorgio",
    appellation: "Colli Euganei Cabernet Sauvignon Riserva DOC",
    vintage: "2019",
    category: "riserve",
    price: 45.00,
    badge: "Selezione della famiglia",
    rating: 96,
    alcohol: "15.0% Vol.",
    format: "750 ml",
    image: "assets/images/bottle-cabernet.jpg",
    shortDescription: "Riserva solenne da singola vigna storica esposta a mezzogiorno, elevata 24 mesi in barrique.",
    description: "Nato dalle viti più antiche della tenuta, piantate dal nonno Giorgio nel 1968 sul crinale del colle. Un vino di rara intensità e longevità che incarna la quintessenza dell'aristocrazia enologica euganea.",
    grapes: "100% Cabernet Sauvignon da vecchia vigna ad alberello modificato",
    terroir: "Suoli basaltici di origine lavica con abbondante scheletro, microclima caldo e ventilato.",
    tastingNotes: {
      visual: "Rosso granato impenetrabile e compatto.",
      olfactory: "Complessità aristocratica: cassis, tabacco toscano, cacao amaro, cuoio nobile e richiami di grafite e rosmarino selvatico.",
      taste: "Austero, monumentale e profondo. Trama tannica cesellata a mano, freschezza minerale vibrante e persistenza infinita."
    },
    pairing: "Fiorentina di chianina, selvaggina da pelo in salmì, faraona tartufata e grandi formaggi erborinati d'alpeggio."
  },
  {
    id: "vulcano-nero-carmenere",
    name: "Vulcano Nero",
    appellation: "Colli Euganei Carmenère Riserva DOC",
    vintage: "2020",
    category: "riserve",
    price: 52.00,
    badge: "Edizione Limitata - 2.800 bottiglie",
    rating: 97,
    alcohol: "14.5% Vol.",
    format: "750 ml",
    image: "assets/images/bottle-carmenere.jpg",
    shortDescription: "La rarità vulcanica: un Carmenère in purezza dalle note speziate e balsamiche straordinarie.",
    description: "Il Carmenère ha trovato nei Colli Euganei una seconda patria d'elezione fin dall'Ottocento. Vulcano Nero è la nostra interpretazione più audace: resa per ettaro bassissima, vendemmia manuale all'alba e affinamento in legni selezionati.",
    grapes: "100% Carmenère selezionato a mano",
    terroir: "Terrazze vulcaniche ripide con affioramenti di trachite e basalto nero.",
    tastingNotes: {
      visual: "Rosso porpora fitto con bagliori violacei intensi.",
      olfactory: "Inconfondibile timbro varietale con cardamomo, ginepro, alloro, pepe verde tostato e confettura di mirtilli neri.",
      taste: "Sorso sapido, vulcanico, vibrante. Acidità viva fusa a tannini vellutati che regalano una chiusura speziata indimenticabile."
    },
    pairing: "Petto d'anatra all'arancia e pepe rosa, cinghiale in umido alla padovana, risotto ai funghi porcini e tartufo nero."
  },
  {
    id: "canto-autunno-merlot",
    name: "Canto d'Autunno",
    appellation: "Colli Euganei Merlot Riserva DOC",
    vintage: "2020",
    category: "rossi",
    price: 38.00,
    badge: "Riserva storica",
    rating: 95,
    alcohol: "14.5% Vol.",
    format: "750 ml",
    image: "assets/images/bottle-merlot.jpg",
    shortDescription: "Merlot maestoso e carezzevole, ricco di piccoli frutti rossi, prugna secca e cioccolato.",
    description: "Raccolto a fine ottobre a piena maturazione fenolica, Canto d'Autunno celebra la morbidezza che solo le marne argillose dei Colli Euganei riescono a donare a questo nobile vitigno internazionale.",
    grapes: "100% Merlot",
    terroir: "Marne calcaree con argille rosse ricche di ferro e potassio a 190m s.l.m.",
    tastingNotes: {
      visual: "Rosso rubino cupo con riflessi porpora.",
      olfactory: "Fascinoso incontro di prugna matura, ciliegia sotto spirito, vaniglia bourbon, noce moscata e violetta appassita.",
      taste: "Morbido, setoso e avvolgente come un velluto. Calore elegante sostenuto da un finale fruttato e carezzevole."
    },
    pairing: "Filetto di manzo al pepe verde, ossobuco alla milanese, pasta fresca al ragù d'anatra e pecorino semistagionato."
  },
  {
    id: "quattro-generazioni-superiore",
    name: "Quattro Generazioni",
    appellation: "Colli Euganei Rosso Superiore Cuvée Prestige",
    vintage: "2018",
    category: "riserve",
    price: 85.00,
    badge: "Flagship Cuvée - Cofanetto Pregiato",
    rating: 98,
    alcohol: "15.5% Vol.",
    format: "750 ml in cofanetto di rovere",
    image: "assets/images/bottle-prestige.jpg",
    shortDescription: "La massima opera enologica di Tenuta Valmora. Vendemmia delle migliori uve selezionate acino per acino.",
    description: "Dedicato alla storia della famiglia Valmora e alle quattro generazioni di vignaioli che si sono tramandate l'arte del vino. Ogni bottiglia è numerata a mano ed è frutto di 36 mesi di affinamento in rovere e 18 mesi di riposo in bottiglia nella nostra cantina storica.",
    grapes: "50% Cabernet Sauvignon, 35% Merlot, 15% Carmenère da vigne storiche",
    terroir: "Le vigne più alte della tenuta su rocce trachitiche esposte a sud-ovest.",
    tastingNotes: {
      visual: "Rosso granato regale, profondo e splendente.",
      olfactory: "Sinfonia olfattiva di amarena candita, tartufo, fave di cacao, scatola di sigari, incenso e liquirizia pura.",
      taste: "Impatto sontuoso e imponente. Tessitura serica impareggiabile, complessità infinita con una persistenza che supera i due minuti."
    },
    pairing: "Grande vino da meditazione, lepre in salmì, carni nobili a lunga cottura e formaggio Asiago Stravecchio stra-stagionato."
  },
  {
    id: "fior-darancio-passito",
    name: "Aura d'Oro",
    appellation: "Colli Euganei Fior d'Arancio Passito DOCG",
    vintage: "2021",
    category: "dolci",
    price: 34.00,
    badge: "DOCG D'Eccellenza",
    rating: 96,
    alcohol: "13.0% Vol.",
    format: "500 ml",
    image: "assets/images/bottle-passito.jpg",
    shortDescription: "Nettare prezioso dei Colli Euganei: uve Moscato Giallo appassite sui graticci per 4 mesi.",
    description: "Il vitigno autoctono più celebre del nostro territorio interpretato nella sua veste più sublime. I grappoli dorati riposano nel fruttaio fino a inizio inverno prima della pigiatura soffice e del lungo affinamento in piccole botti di ciliegio, che gli regala il caldo colore ramato.",
    grapes: "100% Moscato Giallo dei Colli Euganei",
    terroir: "Pendii soleggiati e ben arieggiati con suoli calcareo-vulcanici.",
    tastingNotes: {
      visual: "Rosso ramato brillante, dal rubino chiaro all'ambra sull'unghia del vino.",
      olfactory: "Fiori d'arancio, scorza di mandarino candita, ciliegia candita, miele d'acacia e albicocca disidratata.",
      taste: "Dolcezza sontuosa bilanciata da una vivacissima scia agrumata e minerale che ne evita ogni stucchevolezza."
    },
    pairing: "Pasticceria secca tradizionale veneta (zaeti, fregolotta), foie gras, e formaggi erborinati tipo Gorgonzola naturale."
  },
  {
    id: "pietra-viva-cabernet-franc",
    name: "Pietra Viva",
    appellation: "Colli Euganei Cabernet Franc DOC",
    vintage: "2022",
    category: "rossi",
    price: 32.00,
    badge: "Nuova Annata",
    rating: 92,
    alcohol: "13.5% Vol.",
    format: "750 ml",
    image: "assets/images/bottle-cabernet-franc.jpg",
    shortDescription: "Cabernet Franc in purezza dalle note erbacee e speziate, tipico carattere dei colli vulcanici.",
    description: "Il Cabernet Franc è tra i vitigni a bacca rossa più radicati nei Colli Euganei, dove le escursioni termiche e i suoli di origine vulcanica ne esaltano freschezza e profumi. Pietra Viva è un rosso schietto e territoriale, fermentato in acciaio e affinato 12 mesi in botti grandi di rovere.",
    grapes: "100% Cabernet Franc",
    terroir: "Pendii vulcanici con suoli di trachite e marna a 200m s.l.m., esposizione sud-est.",
    tastingNotes: {
      visual: "Rosso rubino vivace con riflessi violacei.",
      olfactory: "Lampone, ribes nero, peperone verde dolce, violetta e una nota di pepe bianco.",
      taste: "Fresco, succoso e di buon equilibrio. Tannini fini, sapidità minerale e finale pulito di piccoli frutti rossi."
    },
    pairing: "Salumi dei Colli Euganei, bigoli al ragù d'anatra, carni bianche arrosto e formaggi semistagionati."
  },
  {
    id: "monte-alto-rosso-riserva",
    name: "Monte Alto",
    appellation: "Colli Euganei Rosso Riserva DOC",
    vintage: "2020",
    category: "riserve",
    price: 42.00,
    badge: "Riserva della Tenuta",
    rating: 93,
    alcohol: "14.0% Vol.",
    format: "750 ml",
    image: "assets/images/bottle-rosso-riserva.jpg",
    shortDescription: "Il Rosso Riserva dei Colli Euganei: un taglio bordolese strutturato, elegante e pronto a evolvere.",
    description: "Monte Alto nasce dalle migliori parcelle collinari della tenuta, vendemmiate a piena maturazione. Merlot, Cabernet Franc e Cabernet Sauvignon fermentano separatamente e si uniscono dopo 18 mesi di affinamento in botti di rovere, per un rosso di grande equilibrio e tipicità.",
    grapes: "50% Merlot, 30% Cabernet Franc, 20% Cabernet Sauvignon",
    terroir: "Versanti vulcanici esposti a sud con suoli di trachite e marna a 220m s.l.m.",
    tastingNotes: {
      visual: "Rosso rubino intenso con riflessi granati.",
      olfactory: "Prugna, mora, ribes nero, tabacco dolce, spezie e una leggera nota balsamica.",
      taste: "Pieno e armonico, con tannini levigati, buona freschezza e un finale lungo e speziato."
    },
    pairing: "Carni rosse alla griglia, brasati, anatra arrosto e formaggi stagionati del territorio."
  }
];

// Helper per ottenere prodotto per ID
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

// Prezzo all'italiana: 28,00 € (virgola decimale, simbolo dopo, spazio non separabile)
const priceFormatter = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
function formatPrice(valore) {
  return priceFormatter.format(Number(valore) || 0);
}

// Esporta globalmente per uso in browser
if (typeof window !== 'undefined') {
  window.PRODUCTS = PRODUCTS;
  window.getProductById = getProductById;
  window.formatPrice = formatPrice;
}

if (typeof module !== 'undefined') {
  module.exports = PRODUCTS;
}
