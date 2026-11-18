// Home: altezza della hero e comparsa delle sezioni allo scorrimento.
(function () {
  'use strict';

  var root = document.documentElement;
  var hero = document.querySelector('.home-hero');

  // Spazio occupato da topbar e header, per far entrare la hero nello schermo.
  function setHeroOffset() {
    if (!hero) return;
    var offset = Math.round(hero.getBoundingClientRect().top + window.scrollY);
    root.style.setProperty('--home-offset', offset + 'px');
  }

  setHeroOffset();
  window.addEventListener('resize', setHeroOffset);

  var items = document.querySelectorAll('.home-reveal');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Senza IntersectionObserver o con movimento ridotto i contenuti restano visibili.
  if (!items.length || reduceMotion || !('IntersectionObserver' in window)) return;

  root.classList.add('home-js');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('home-reveal--in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

  items.forEach(function (item) {
    observer.observe(item);
  });
})();
