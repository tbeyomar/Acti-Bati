// Couche commune aux plaquettes Acti Bati
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;
  var tel = body.getAttribute('data-tel');
  var mail = body.getAttribute('data-mail');
  var subject = body.getAttribute('data-subject') || 'Demande d\'information';

  // Barre de progression
  var bar = document.createElement('div');
  bar.className = 'pq-progress';
  body.appendChild(bar);

  // Barre d'appel mobile
  var cta = null;
  if (tel && mail) {
    cta = document.createElement('div');
    cta.className = 'pq-cta-bar';
    cta.innerHTML =
      '<a class="call" href="tel:' + tel + '">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Appeler</a>' +
      '<a class="mail" href="mailto:' + mail + '?subject=' + encodeURIComponent(subject) + '">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>Écrire</a>';
    body.appendChild(cta);
  }

  var hero = document.getElementById('hero');
  var contact = document.getElementById('contact');
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
    if (cta) {
      var pastHero = hero ? scrollY > hero.offsetHeight * 0.6 : scrollY > 400;
      var atContact = contact ? contact.getBoundingClientRect().top < innerHeight * 0.8 : false;
      cta.classList.toggle('show', pastHero && !atContact);
    }
    // Filet de sécurité : tout afficher en bas de page
    if (max - scrollY < 200) {
      document.querySelectorAll('.rv:not(.visible)').forEach(function (el) { el.classList.add('visible'); });
    }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();


  // Bouton PDF (nav + menu mobile) et bloc « version en ligne » pour l'impression
  var pdf = body.getAttribute('data-pdf');
  var pageUrl = body.getAttribute('data-url');
  var DL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>';
  if (pdf) {
    var right = document.querySelector('.pq-nav-right');
    if (right) {
      var b = document.createElement('a');
      b.className = 'pq-home pq-pdf';
      b.href = pdf;
      b.setAttribute('download', '');
      b.setAttribute('aria-label', 'Télécharger la plaquette en PDF');
      b.innerHTML = DL + '<span>PDF</span>';
      right.insertBefore(b, right.firstChild);
    }
    var m = document.getElementById('mobMenu');
    if (m) {
      var mb = document.createElement('a');
      mb.href = pdf; mb.setAttribute('download', ''); mb.className = 'pq-home-m';
      mb.textContent = '↓ Télécharger le PDF';
      m.insertBefore(mb, m.children[1] || null);
    }
  }
  if (contact && pageUrl) {
    var po = document.createElement('div');
    po.className = 'pq-print-only';
    po.innerHTML = 'Plaquette en ligne, plans zoomables et mises à jour : <strong>' + pageUrl + '</strong>';
    contact.appendChild(po);
  }

  // Images : précharger après l'ouverture pour une impression complète
  function eager() { document.querySelectorAll('img[loading="lazy"]').forEach(function (i) { i.loading = 'eager'; }); }
  addEventListener('load', function () { setTimeout(eager, 2500); });
  addEventListener('beforeprint', eager);

  // Lien actif dans le menu
  var links = Array.prototype.slice.call(document.querySelectorAll('.nlinks a[href^="#"]'));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window && links.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a, i) { a.classList.toggle('active', targets[i] === e.target); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { if (t) spy.observe(t); });
  }

  // Burger animé
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobMenu');
  if (burger && menu) {
    new MutationObserver(function () { burger.classList.toggle('open', menu.classList.contains('open')); })
      .observe(menu, { attributes: true, attributeFilter: ['class'] });
  }

  // Visionneuse : fermer en cliquant à côté de l'image
  var lbScroll = document.getElementById('lb-scroll');
  if (lbScroll && typeof closeLightbox === 'function') {
    var moved = false;
    lbScroll.addEventListener('mousedown', function () { moved = false; });
    lbScroll.addEventListener('mousemove', function () { moved = true; });
    lbScroll.addEventListener('click', function (e) { if (e.target === lbScroll && !moved) closeLightbox(); });
  }

  // Chiffres clés animés dans le hero
  if (!reduce) {
    document.querySelectorAll('.hstat .v').forEach(function (el) {
      var node = el.firstChild;
      if (!node || node.nodeType !== 3) return;
      var raw = node.textContent.trim();
      if (!/^[\d\s ,]+$/.test(raw) || /^20\d\d$/.test(raw)) return;
      var decimals = raw.indexOf(',') > -1 ? raw.split(',')[1].length : 0;
      var target = parseFloat(raw.replace(/[\s ]/g, '').replace(',', '.'));
      if (!isFinite(target) || target < 2) return;
      var fmt = function (v) {
        return v.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).replace(/ /g, ' ');
      };
      var start = null, dur = 1600;
      node.textContent = fmt(0);
      function step(t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = p < 1 ? fmt(target * eased) : raw;
        if (p < 1) requestAnimationFrame(step);
      }
      setTimeout(function () { requestAnimationFrame(step); }, 450);
    });
  }
})();
