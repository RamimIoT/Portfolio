/* Project pages: theme toggle, header shadow, image lightbox (no dependencies) */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');

  var themeBtn = document.getElementById('theme-toggle');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#f7f9fc' : '#070b14');
    themeBtn.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  }
  setTheme(root.getAttribute('data-theme') || 'dark');
  themeBtn.addEventListener('click', function () {
    setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });

  var header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  var box = document.getElementById('lightbox');
  var boxImg = box && box.querySelector('img');
  if (box) {
    document.addEventListener('click', function (e) {
      var img = e.target.closest('.pj-fig img');
      if (img) {
        boxImg.src = img.currentSrc || img.src;
        boxImg.alt = img.alt;
        box.hidden = false;
      } else if (e.target.closest('#lightbox')) {
        box.hidden = true;
      }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.hidden = true; });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
