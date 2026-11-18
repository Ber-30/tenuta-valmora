// Home: apertura, header, pannello Menu, video e animazioni allo scorrimento.

// Apertura con il logo alla prima visita della sessione.
// Se lo cambi, cambia anche INTRO_ENABLED nello script in cima al <body> di index.html.
const INTRO_ENABLED = true;

// Velocità del video della hero (1 = normale, 1.5 = una volta e mezza).
const VIDEO_SPEED = 1;

// true: le animazioni di comparsa ripartono ogni volta che un elemento rientra nello schermo.
// false: ogni animazione parte una volta sola.
const REPLAY = true;

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var canObserve = 'IntersectionObserver' in window;
  var animated = !reduceMotion && canObserve;
  var wide = window.matchMedia ? window.matchMedia('(min-width: 1024px)') : { matches: false };

  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.home-hero');
  var heroContent = document.querySelector('.home-hero__content');
  var heroShade = document.querySelector('.home-hero__shade');
  var heroMedia = document.querySelector('.home-hero__media');
  var manifesto = document.querySelector('.home-manifesto__text');
  var visit = document.querySelector('.home-visit');
  var visitMedia = document.querySelector('.home-visit__media');
  var drawer = document.getElementById('mobile-nav-drawer');
  var menuBtn = document.getElementById('mobile-menu-btn');
  var closeBtn = document.getElementById('mobile-drawer-close');

  // Stessa chiave usata dallo script in cima al <body>.
  var OPENING_KEY = 'home-opening-seen';
  var OPENING_REVEAL_MS = 1350; // inizio della dissolvenza
  var OPENING_TOTAL_MS = 1800;  // rimozione della schermata

  var MARQUEE_BASE = 32;        // velocità base della fascia (px al secondo)

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }

  function menuOpen() {
    return !!(drawer && drawer.classList.contains('open'));
  }

  // --- Posizioni delle sezioni (misurate al ridimensionamento, non a ogni frame)

  var geo = { vh: window.innerHeight, heroTop: 0, heroH: 1, headerH: 0, manTop: 0, manH: 1, visitTop: 0, visitH: 1 };

  function measure() {
    var sy = window.scrollY;
    geo.vh = window.innerHeight;

    if (hero) {
      // Altezza della topbar: la hero riempie lo schermo sotto di essa.
      root.style.setProperty('--home-offset', Math.round(hero.getBoundingClientRect().top + sy) + 'px');
      var h = hero.getBoundingClientRect();
      geo.heroTop = h.top + sy;
      geo.heroH = h.height || 1;
    }
    if (header) geo.headerH = header.offsetHeight;
    if (manifesto) {
      var m = manifesto.getBoundingClientRect();
      geo.manTop = m.top + sy;
      geo.manH = m.height || 1;
    }
    if (visit) {
      var v = visit.getBoundingClientRect();
      geo.visitTop = v.top + sy;
      geo.visitH = v.height || 1;
    }
    if (marquee.group) marquee.width = marquee.group.getBoundingClientRect().width;

    lastHeroP = -1;
    frame();
  }

  var measureQueued = false;
  function queueMeasure() {
    if (measureQueued) return;
    measureQueued = true;
    window.requestAnimationFrame(function () {
      measureQueued = false;
      measure();
    });
  }

  // --- Header: barra crema dopo la hero, nascosto scorrendo verso il basso --

  var headerSolid = false;
  var headerHidden = false;

  function setHeaderHidden(hide) {
    if (!header || hide === headerHidden) return;
    headerHidden = hide;
    header.classList.toggle('home-header--hidden', hide);
  }

  function updateHeader(y, dy) {
    if (!header) return;
    var heroBottom = geo.heroTop + geo.heroH;
    var solid = y > heroBottom - geo.headerH;

    if (solid !== headerSolid) {
      headerSolid = solid;
      header.classList.toggle('home-header--solid', solid);
    }

    if (reduceMotion || menuOpen()) return;

    if (y < heroBottom) setHeaderHidden(false);
    else if (dy > 6 && !header.contains(document.activeElement)) setHeaderHidden(true);
    else if (dy < -6) setHeaderHidden(false);
  }

  function initHeader() {
    if (!header) return;
    header.classList.add('home-header--managed');
    // Con la tastiera l'header torna visibile.
    header.addEventListener('focusin', function () {
      setHeaderHidden(false);
    });
  }

  // --- Pannello Menu: accessibilità (apertura e chiusura restano a main.js) --

  function initMenu() {
    if (!drawer || !menuBtn) return;
    var wasOpen = false;

    function sync() {
      var open = menuOpen();
      if (open === wasOpen) return;
      wasOpen = open;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');

      if (open) {
        setHeaderHidden(false);
        setTimeout(function () {
          if (closeBtn && menuOpen()) closeBtn.focus();
        }, 60);
      } else if (drawer.contains(document.activeElement) || document.activeElement === document.body) {
        menuBtn.focus();
      }
    }

    if ('MutationObserver' in window) {
      new MutationObserver(sync).observe(drawer, { attributes: true, attributeFilter: ['class'] });
    }

    document.addEventListener('keydown', function (e) {
      if (!menuOpen()) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (closeBtn) closeBtn.click();
        return;
      }
      if (e.key !== 'Tab') return;

      // Il tasto Tab resta dentro il pannello.
      var items = drawer.querySelectorAll('a[href], button:not([disabled])');
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
  }

  // --- Video della hero -----------------------------------------------------

  function initVideo() {
    var video = document.querySelector('.home-hero__video');
    if (!video) return;

    // Movimento ridotto: resta l'immagine (il video è nascosto anche da CSS).
    if (reduceMotion) {
      video.removeAttribute('autoplay');
      video.pause();
      return;
    }

    function hideVideo() {
      video.classList.add('home-hero__video--off');
    }

    function applySpeed() {
      video.defaultPlaybackRate = VIDEO_SPEED;
      video.playbackRate = VIDEO_SPEED;
    }

    function play() {
      var attempt = video.play();
      if (attempt && attempt.catch) attempt.catch(function () {});
    }

    var source = video.querySelector('source');
    if (source) source.addEventListener('error', hideVideo);
    video.addEventListener('error', hideVideo);
    video.addEventListener('loadedmetadata', applySpeed);
    video.addEventListener('play', applySpeed);
    applySpeed();

    // In pausa quando la hero non è nello schermo.
    if (canObserve && hero) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) play();
        else video.pause();
      }).observe(hero);
    }
  }

  // --- Foto con segnaposto --------------------------------------------------

  function initPhotos() {
    each(document.querySelectorAll('.home-photo img'), function (img) {
      var box = img.parentNode;
      img.addEventListener('error', function () {
        box.classList.add('home-photo--missing');
      });
      img.addEventListener('load', function () {
        box.classList.remove('home-photo--missing');
      });
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
        box.classList.add('home-photo--missing');
      }
    });
  }

  // --- Titoli riga per riga -------------------------------------------------

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Divide il titolo nelle righe realmente visibili, mantenendo il corsivo.
  function splitLines(title) {
    if (title.homeSource === undefined) title.homeSource = title.innerHTML;
    title.innerHTML = title.homeSource;

    var words = [];
    var spaceBefore = false;

    each(Array.prototype.slice.call(title.childNodes), function (node) {
      if (node.nodeType === 1 && node.tagName === 'BR') {
        spaceBefore = true;
        return;
      }
      if (node.nodeType !== 1 && node.nodeType !== 3) return;

      var italic = node.nodeType === 1 && node.tagName === 'EM';
      var holder = document.createDocumentFragment();

      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          spaceBefore = true;
          holder.appendChild(document.createTextNode(' '));
          return;
        }
        var span = document.createElement('span');
        span.textContent = part;
        holder.appendChild(span);
        words.push({ el: span, text: part, italic: italic, space: spaceBefore });
        spaceBefore = false;
      });

      if (italic) {
        node.textContent = '';
        node.appendChild(holder);
      } else {
        title.replaceChild(holder, node);
      }
    });

    var lines = [];
    var lastTop = null;
    words.forEach(function (word) {
      var top = word.el.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 4) {
        lines.push([]);
        lastTop = top;
      }
      lines[lines.length - 1].push(word);
    });

    title.innerHTML = lines.map(function (line, index) {
      var html = '';
      var open = false;
      line.forEach(function (word, i) {
        if (open && !word.italic) { html += '</em>'; open = false; }
        if (i > 0 && word.space) html += ' ';
        if (!open && word.italic) { html += '<em>'; open = true; }
        html += escapeHtml(word.text);
      });
      if (open) html += '</em>';
      return '<span class="home-line"><span class="home-line__inner" style="--home-i:' + index + '">' + html + '</span></span>';
    }).join(' ');
  }

  var titles = Array.prototype.slice.call(document.querySelectorAll('.home-lines'));

  function splitAllTitles() {
    titles.forEach(splitLines);
  }

  // --- Manifesto: parole che si accendono seguendo lo scorrimento -----------

  var words = [];
  var litCount = -1;

  function wrapWords(node) {
    each(Array.prototype.slice.call(node.childNodes), function (child) {
      if (child.nodeType === 1) {
        wrapWords(child);
        return;
      }
      if (child.nodeType !== 3) return;

      var frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        var span = document.createElement('span');
        span.className = 'home-word';
        span.textContent = part;
        frag.appendChild(span);
        words.push(span);
      });
      node.replaceChild(frag, child);
    });
  }

  function updateManifesto(y) {
    if (!words.length) return;
    var start = geo.manTop - geo.vh * 0.8;
    var end = geo.manTop + geo.manH - geo.vh * 0.45;
    var p = clamp((y - start) / Math.max(1, end - start), 0, 1);
    var count = Math.round(p * words.length);
    if (count === litCount) return;

    // Aggiorna solo le parole che cambiano stato.
    var from = litCount < 0 ? 0 : Math.min(count, litCount);
    var to = litCount < 0 ? words.length : Math.max(count, litCount);
    for (var i = from; i < to; i++) {
      words[i].classList.toggle('home-word--lit', i < count);
    }
    litCount = count;
  }

  // --- Hero: uscita legata allo scorrimento e parallasse --------------------

  var lastHeroP = -1;

  function updateHero(y) {
    if (!heroContent) return;
    var p = clamp(y / Math.max(1, geo.heroTop + geo.heroH), 0, 1);
    if (Math.abs(p - lastHeroP) < 0.0005) return;
    lastHeroP = p;

    heroContent.style.transform = p ? 'translate3d(0,' + (-p * geo.heroH * 0.22).toFixed(1) + 'px,0)' : '';
    heroContent.style.opacity = p ? clamp(1 - p * 2.2, 0, 1).toFixed(3) : '';
    if (heroShade) heroShade.style.opacity = (p * 0.7).toFixed(3);
    if (heroMedia) {
      heroMedia.style.transform = wide.matches && p ? 'translate3d(0,' + (y * 0.3).toFixed(1) + 'px,0)' : '';
    }
  }

  // --- Visita: parallasse leggera (da 1024px) -------------------------------

  var visitShifted = false;

  function updateVisit(y) {
    if (!visitMedia) return;
    if (!wide.matches) {
      if (visitShifted) {
        visitMedia.style.transform = '';
        visitShifted = false;
      }
      return;
    }
    if (y + geo.vh < geo.visitTop || y > geo.visitTop + geo.visitH) return;

    var distance = (geo.visitTop + geo.visitH / 2) - (y + geo.vh / 2);
    var limit = geo.visitH * 0.1;
    var shift = clamp(-distance * 0.15, -limit, limit);
    visitMedia.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
    visitShifted = true;
  }

  // --- Fascia di testo: velocità base più spinta dello scorrimento ----------

  var marquee = { track: null, group: null, width: 0, x: 0, speed: MARQUEE_BASE, impulse: 0, visible: false, running: false, last: 0 };

  function marqueeStep(time) {
    if (!marquee.visible) {
      marquee.running = false;
      return;
    }
    var dt = marquee.last ? Math.min((time - marquee.last) / 1000, 0.05) : 0;
    marquee.last = time;

    // La spinta si esaurisce gradualmente e la velocità la segue morbida.
    marquee.impulse *= Math.exp(-dt / 0.35);
    marquee.speed += (MARQUEE_BASE + marquee.impulse - marquee.speed) * Math.min(1, dt * 4);
    marquee.x -= marquee.speed * dt;
    if (marquee.width > 0) {
      while (marquee.x <= -marquee.width) marquee.x += marquee.width;
    }
    marquee.track.style.transform = 'translate3d(' + marquee.x.toFixed(2) + 'px,0,0)';
    window.requestAnimationFrame(marqueeStep);
  }

  function marqueeImpulse(dy) {
    if (!marquee.track || !marquee.visible || !dy) return;
    marquee.impulse = Math.min(marquee.impulse + Math.abs(dy) * 6, 1400);
  }

  function initMarquee() {
    var track = document.querySelector('.home-marquee__track');
    if (!track || !animated) return;
    marquee.track = track;
    marquee.group = track.querySelector('.home-marquee__group');

    // Il ciclo gira solo mentre la fascia è nello schermo.
    new IntersectionObserver(function (entries) {
      marquee.visible = entries[0].isIntersecting;
      if (marquee.visible && !marquee.running) {
        marquee.running = true;
        marquee.last = 0;
        window.requestAnimationFrame(marqueeStep);
      }
    }).observe(track.parentNode);
  }

  // --- Ciclo di scorrimento: un solo requestAnimationFrame ------------------

  var lastY = window.scrollY;
  var ticking = false;

  function frame() {
    ticking = false;
    var y = window.scrollY;
    var dy = y - lastY;
    lastY = y;

    updateHeader(y, dy);
    if (!animated) return;
    updateHero(y);
    updateManifesto(y);
    updateVisit(y);
    marqueeImpulse(dy);
  }

  function requestFrame() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(frame);
  }

  // --- Comparsa allo scorrimento --------------------------------------------

  function initReveal() {
    var items = document.querySelectorAll('.home-observe, .home-reveal');

    // Entrata: basta una parte dell'elemento nello schermo.
    var enter = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('home-in');
        if (!REPLAY) enter.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    // Uscita: reset solo quando l'elemento è completamente fuori dallo schermo.
    var leave = REPLAY ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) entry.target.classList.remove('home-in');
      });
    }, { threshold: 0 }) : null;

    each(items, function (item) {
      enter.observe(item);
      if (leave) leave.observe(item);
    });
  }

  // Ingresso della hero, dopo l'apertura.
  function revealHero() {
    if (!hero || !animated) return;
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        hero.classList.add('home-hero--in');
      });
    });
  }

  // --- Apertura con il logo -------------------------------------------------

  var OPENING_SVG =
    '<svg class="home-opening__logo" viewBox="218 36 164 164" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="home-opening-clip"><circle cx="300" cy="118" r="72"/></clipPath></defs>' +
      '<g class="home-opening__fill" clip-path="url(#home-opening-clip)">' +
        '<circle cx="264" cy="80" r="10" fill="#B08D57"/>' +
        '<path d="M190 214 C228 196 244 98 278 94 C308 98 318 160 346 176 L346 240 L190 240 Z" fill="#CDAAB0"/>' +
        '<path d="M286 176 C310 160 322 78 348 74 C376 78 390 170 420 200 L420 240 L286 240 Z" fill="#8E4553"/>' +
        '<path d="M190 176 Q300 124 410 176 L410 240 L190 240 Z" fill="#5E1A28"/>' +
      '</g>' +
      '<g clip-path="url(#home-opening-clip)" stroke="#F6F1E7">' +
        '<path class="home-opening__line" pathLength="1" d="M210 172 Q300 148 390 172"/>' +
        '<path class="home-opening__line" pathLength="1" d="M210 183 Q300 157 390 183"/>' +
        '<path class="home-opening__line" pathLength="1" d="M210 194 Q300 166 390 194"/>' +
        '<path class="home-opening__line" pathLength="1" d="M210 205 Q300 175 390 205"/>' +
        '<path class="home-opening__line" pathLength="1" d="M210 216 Q300 184 390 216"/>' +
      '</g>' +
      '<circle class="home-opening__line home-opening__line--ring" pathLength="1" cx="300" cy="118" r="78" stroke="#B08D57"/>' +
    '</svg>';

  // Mostra l'apertura solo alla prima visita della sessione, poi chiama done().
  function runOpening(done) {
    var show = false;
    try {
      var seen = sessionStorage.getItem(OPENING_KEY);
      // home-intro-timeout: lo script in cima al body ha già mostrato la pagina.
      show = INTRO_ENABLED && animated && !seen && !root.classList.contains('home-intro-timeout');
      if (!seen) sessionStorage.setItem(OPENING_KEY, '1');
    } catch (e) {
      show = false;
    }

    if (!show) {
      root.classList.remove('home-intro-pending');
      done();
      return;
    }

    var screen = document.createElement('div');
    screen.className = 'home-opening';
    screen.setAttribute('aria-hidden', 'true');
    screen.innerHTML = OPENING_SVG;
    document.body.appendChild(screen);
    // La schermata copre già la pagina: si può togliere l'attesa.
    root.classList.remove('home-intro-pending');

    var revealed = false;
    var skipEvents = ['pointerdown', 'touchstart', 'keydown', 'wheel'];

    function reveal() {
      if (revealed) return;
      revealed = true;
      done();
    }

    function remove() {
      skipEvents.forEach(function (name) {
        window.removeEventListener(name, skip, true);
      });
      if (screen.parentNode) screen.parentNode.removeChild(screen);
    }

    function skip() {
      clearTimeout(revealTimer);
      clearTimeout(removeTimer);
      screen.classList.add('home-opening--skip');
      reveal();
      setTimeout(remove, 220);
    }

    var revealTimer = setTimeout(reveal, OPENING_REVEAL_MS);
    var removeTimer = setTimeout(remove, OPENING_TOTAL_MS);

    skipEvents.forEach(function (name) {
      window.addEventListener(name, skip, { capture: true, passive: true });
    });
  }

  // --- Avvio ----------------------------------------------------------------

  initHeader();
  initMenu();
  initVideo();
  initPhotos();

  if (animated) {
    root.classList.add('home-js');
    var grid = document.querySelector('.home-wines .products-grid');
    if (grid) grid.classList.add('home-cards');
    splitAllTitles();
    if (manifesto) wrapWords(manifesto);
    initMarquee();
  }

  // I contenuti della hero ora sono nascosti dalle maschere (o visibili senza animazioni).
  root.classList.remove('home-hero-wait');

  measure();
  window.addEventListener('scroll', requestFrame, { passive: true });

  var lastWidth = window.innerWidth;
  var splitTimer;
  window.addEventListener('resize', function () {
    queueMeasure();
    if (!animated || window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(splitTimer);
    splitTimer = setTimeout(function () {
      splitAllTitles();
      queueMeasure();
    }, 150);
  }, { passive: true });

  window.addEventListener('load', queueMeasure);
  if ('ResizeObserver' in window) {
    var main = document.querySelector('.home-main');
    if (main) new ResizeObserver(queueMeasure).observe(main);
  }
  if (animated && document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      splitAllTitles();
      queueMeasure();
    });
  }

  runOpening(function () {
    revealHero();
    if (animated) initReveal();
  });
})();
