/* Sakiul Mowla Ramim · Portfolio interactions (no dependencies) */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('no-js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
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

  /* ---------- Header + mobile menu ---------- */
  var header = document.querySelector('.site-header');
  var menuBtn = document.getElementById('menu-btn');
  var navLinks = document.getElementById('nav-links');
  function closeMenu() {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  }
  menuBtn.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navLinks.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  /* ---------- Scroll spy ---------- */
  var links = Array.prototype.slice.call(navLinks.querySelectorAll('a'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      ro.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function render(el, n) {
    el.textContent = (el.dataset.prefix || '') + n + (el.dataset.suffix || '');
  }
  function runCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    if (reduceMotion) { render(el, target); return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      render(el, Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(function (c) { render(c, c.dataset.count); });
  }

  /* ---------- Project filter ---------- */
  var filters = document.querySelectorAll('.filter');
  var projects = document.querySelectorAll('.project');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      projects.forEach(function (p) {
        var cats = (p.dataset.cat || '').split(' ');
        p.classList.toggle('hidden', !(f === 'all' || cats.indexOf(f) !== -1));
      });
    });
  });

  /* ---------- Copy e-mail ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  var copyBtn = document.getElementById('copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.dataset.email;
      var done = function () { showToast('E-mail address copied'); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(done, function () { window.location.href = 'mailto:' + email; });
      } else {
        var ta = document.createElement('textarea');
        ta.value = email; ta.setAttribute('readonly', ''); ta.style.position = 'absolute'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { window.location.href = 'mailto:' + email; }
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- Year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Live telemetry console (illustrative, simulated) ---------- */
  var log = document.getElementById('console-log');
  var soilEl = document.querySelector('[data-gauge="soil"]');
  var o2El = document.querySelector('[data-gauge="o2"]');
  var relayEl = document.querySelector('[data-gauge="relay"]');
  var line = document.getElementById('spark-line');
  var area = document.getElementById('spark-area');
  var pondO2 = document.querySelector('[data-pond="o2"]');
  var pondAer = document.querySelector('[data-pond="aer"]');

  var soil = 21.8, o2 = 7.23, relayOn = false, history = [];
  for (var i = 0; i < 40; i++) history.push(soil + Math.sin(i / 4) * 0.8);

  function ts(ago) {
    var d = new Date(Date.now() - (ago || 0));
    return [d.getHours(), d.getMinutes(), d.getSeconds()].map(function (n) { return (n < 10 ? '0' : '') + n; }).join(':');
  }
  function push(html, ago) {
    var li = document.createElement('li');
    li.innerHTML = '<span class="t">' + ts(ago) + '</span> ' + html;
    log.appendChild(li);
    while (log.children.length > 9) log.removeChild(log.firstChild);
  }
  function drawSpark() {
    var min = Math.min.apply(null, history) - 0.5, max = Math.max.apply(null, history) + 0.5;
    var w = 300, h = 60, stepX = w / (history.length - 1);
    var d = history.map(function (v, idx) {
      var x = (idx * stepX).toFixed(1), yv = (h - ((v - min) / (max - min)) * (h - 8) - 4).toFixed(1);
      return (idx ? 'L' : 'M') + x + ' ' + yv;
    }).join(' ');
    line.setAttribute('d', d);
    area.setAttribute('d', d + ' L' + w + ' ' + h + ' L0 ' + h + ' Z');
  }

  function tick(ago) {
    soil = Math.max(14, Math.min(28, soil + (Math.random() - (relayOn ? 0.25 : 0.62)) * 0.9));
    o2 = Math.max(5.6, Math.min(8.4, o2 + (Math.random() - 0.5) * 0.18));
    history.push(soil); history.shift();

    soilEl.innerHTML = soil.toFixed(1) + '<small>%</small>';
    o2El.innerHTML = o2.toFixed(2) + '<small>mg/L</small>';
    if (pondO2) pondO2.textContent = (o2 - 0.4).toFixed(1);
    drawSpark();

    push('<span class="k">smartsense/demo/9C40/Pub</span> {"soilHum":<span class="v">' + soil.toFixed(1) +
         '</span>,"o2":<span class="v">' + o2.toFixed(2) + '</span>}', ago);

    if (!relayOn && soil < 18) {
      relayOn = true;
      push('<span class="w">rule fired</span> soilHum &lt; 18 → CH6 <span class="v">ON</span>', ago);
      push('<span class="k">…/9384/Pub</span> {"cmdName":"Relay_cmd","relay":"<span class="v">00000100</span>"} ✓ ack', ago);
    } else if (relayOn && soil > 24) {
      relayOn = false;
      push('<span class="w">rule fired</span> soilHum &gt; 24 → CH6 <span class="v">OFF</span>', ago);
      push('<span class="k">…/9384/Pub</span> {"cmdName":"Relay_cmd","relay":"<span class="v">00000000</span>"} ✓ ack', ago);
    }
    relayEl.textContent = relayOn ? 'ON' : 'OFF';
    relayEl.classList.toggle('on', relayOn);
    if (pondAer) pondAer.textContent = relayOn ? 'ON' : 'AUTO';
  }

  if (log && soilEl && line) {
    drawSpark();
    // Seed a few back-dated readings so the console is not empty on first paint.
    push('<span class="k">connected</span> broker · persistent session · ACL smartsense/demo/#', 6 * 1800);
    for (var k = 5; k >= 0; k--) tick(k * 1800);
    if (!reduceMotion) {
      var timer = setInterval(function () { tick(0); }, 1800);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { clearInterval(timer); timer = null; }
        else if (!timer) { timer = setInterval(function () { tick(0); }, 1800); }
      });
    }
  }
})();
