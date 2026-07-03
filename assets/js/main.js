/* Poli-Praxis — dynamic layer: navigation, reveals, counters, live status */
(function () {
  'use strict';

  // Marker class: reveal styles only apply when JS runs (content never hides without it)
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Mobile navigation toggle
     ------------------------------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     Sticky header: elevate after scrolling
     ------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');
  var onScrollHeader = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ------------------------------------------------------------------
     Scroll-reveal: sections and cards rise in as they enter the viewport
     ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll(
    '.section-head, .office-card, .feature-card, .doctor-card, .info-card, .cta-band, .map-embed'
  );

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 3) * 70 + 'ms'; // stagger within grid rows
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     Animated counters (hero stats)
     ------------------------------------------------------------------ */
  var counters = document.querySelectorAll('[data-count]');

  var animateCount = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion || isNaN(target)) {
      el.textContent = target + suffix;
      return;
    }
    var start = null;
    var duration = 1200;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countObserver.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ------------------------------------------------------------------
     Live opening status per office
     Keys: 0 = Sunday … 6 = Saturday. Windows are [open, close] in hours.
     ------------------------------------------------------------------ */
  var OFFICE_HOURS = {
    'muenchen-mitte': {
      1: [[9, 12], [14, 18]], 2: [[9, 12], [14, 18]], 3: [[9, 12], [14, 17]],
      4: [[9, 12], [14, 18]], 5: [[9, 12], [14, 18]]
    },
    'muenchen-nord': {
      1: [[8, 12], [13, 17]], 2: [[8, 12], [13, 17]], 3: [[8, 12]],
      4: [[8, 12], [13, 17]], 5: [[8, 12], [13, 17]]
    },
    'augsburg': {
      1: [[9, 12], [14, 17]], 2: [[9, 12], [14, 17]], 3: [[9, 12]],
      4: [[9, 12], [14, 18]], 5: [[9, 14]]
    }
  };
  var DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  var formatHour = function (h) {
    var whole = Math.floor(h);
    var minutes = Math.round((h - whole) * 60);
    return whole + ':' + (minutes < 10 ? '0' : '') + minutes;
  };

  var statusFor = function (slug) {
    var hours = OFFICE_HOURS[slug];
    if (!hours) return null;
    var now = new Date();
    var day = now.getDay();
    var t = now.getHours() + now.getMinutes() / 60;
    var today = hours[day] || [];

    for (var i = 0; i < today.length; i++) {
      var win = today[i];
      if (t >= win[0] && t < win[1]) {
        return { open: true, text: 'Jetzt geöffnet · bis ' + formatHour(win[1]) + ' Uhr' };
      }
      if (t < win[0]) {
        return { open: false, text: 'Geschlossen · öffnet heute um ' + formatHour(win[0]) + ' Uhr' };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nextDay = (day + d) % 7;
      var windows = hours[nextDay];
      if (windows && windows.length) {
        var label = d === 1 ? 'morgen' : 'am ' + DAY_NAMES[nextDay];
        return { open: false, text: 'Geschlossen · öffnet ' + label + ' um ' + formatHour(windows[0][0]) + ' Uhr' };
      }
    }
    return { open: false, text: 'Geschlossen' };
  };

  document.querySelectorAll('[data-open-status]').forEach(function (el) {
    var status = statusFor(el.getAttribute('data-open-status'));
    if (!status) return;
    el.hidden = false;
    el.classList.add(status.open ? 'status-badge--open' : 'status-badge--closed');
    el.innerHTML = '<span class="status-badge__dot" aria-hidden="true"></span>' + status.text;
  });

  /* ------------------------------------------------------------------
     Office filters on the homepage: city (München/Augsburg) + open now
     ------------------------------------------------------------------ */
  var officeCards = document.querySelectorAll('[data-office-card]');
  if (officeCards.length) {
    var cityBar = document.querySelector('[data-city-filter]');
    var statusBar = document.querySelector('[data-status-filter]');
    var officeCount = document.querySelector('[data-office-count]');
    var activeCity = 'alle';
    var activeStatus = 'alle';

    var applyOfficeFilter = function () {
      var visible = 0;
      officeCards.forEach(function (card) {
        var cityOk = activeCity === 'alle' || card.getAttribute('data-city') === activeCity;
        var statusOk = true;
        if (activeStatus === 'offen') {
          var status = statusFor(card.getAttribute('data-slug'));
          statusOk = !!(status && status.open);
        }
        var show = cityOk && statusOk;
        card.hidden = !show;
        if (show) {
          visible++;
          if (!reduceMotion) {
            card.classList.remove('card-pop');
            void card.offsetWidth;
            card.classList.add('card-pop');
          }
        }
      });
      if (officeCount) {
        officeCount.textContent = visible === 0
          ? 'Kein Standort entspricht der Auswahl — derzeit ist keine Praxis geöffnet.'
          : visible + (visible === 1 ? ' Standort' : ' Standorte');
      }
    };

    var wireFilterBar = function (bar, attr, setValue) {
      if (!bar) return;
      var btns = bar.querySelectorAll('.filter-btn');
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          btns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
          btn.setAttribute('aria-pressed', 'true');
          setValue(btn.getAttribute(attr));
          applyOfficeFilter();
        });
      });
    };
    wireFilterBar(cityBar, 'data-city', function (v) { activeCity = v; });
    wireFilterBar(statusBar, 'data-status', function (v) { activeStatus = v; });
    applyOfficeFilter();
  }

  /* ------------------------------------------------------------------
     Doctor filter by office (aerzte.html) — with pop-in transition
     ------------------------------------------------------------------ */
  var filterBar = document.querySelector('[data-filter-bar]');
  if (filterBar) {
    var buttons = filterBar.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('[data-offices]');
    var countEl = document.querySelector('[data-filter-count]');

    var applyFilter = function (office) {
      var visible = 0;
      cards.forEach(function (card) {
        var offices = card.getAttribute('data-offices').split(' ');
        var show = office === 'alle' || offices.indexOf(office) !== -1;
        card.hidden = !show;
        if (show) {
          visible++;
          if (!reduceMotion) {
            card.classList.remove('card-pop');
            void card.offsetWidth; // restart animation
            card.classList.add('card-pop');
          }
        }
      });
      if (countEl) {
        countEl.textContent = visible + (visible === 1 ? ' Ärztin/Arzt' : ' Ärztinnen und Ärzte');
      }
    };

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        applyFilter(btn.getAttribute('data-office'));
      });
    });

    // Allow deep-linking: aerzte.html#standort=augsburg
    var match = window.location.hash.match(/standort=([a-z-]+)/);
    if (match) {
      var target = filterBar.querySelector('[data-office="' + match[1] + '"]');
      if (target) target.click();
    }
  }

  /* ------------------------------------------------------------------
     Google Maps: embed loads automatically (placeholder is no-JS fallback)
     ------------------------------------------------------------------ */
  document.querySelectorAll('.map-embed[data-map-query]').forEach(function (wrap) {
    var query = encodeURIComponent(wrap.getAttribute('data-map-query') || '');
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.google.com/maps?q=' + query + '&hl=de&z=16&output=embed';
    iframe.title = wrap.getAttribute('data-map-title') || 'Google Maps';
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    wrap.innerHTML = '';
    wrap.appendChild(iframe);
  });

  /* ------------------------------------------------------------------
     Back-to-top button (injected, appears after 600px)
     ------------------------------------------------------------------ */
  var topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'back-to-top';
  topBtn.setAttribute('aria-label', 'Nach oben scrollen');
  topBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
  document.body.appendChild(topBtn);

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  var onScrollTopBtn = function () {
    topBtn.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScrollTopBtn, { passive: true });
  onScrollTopBtn();
})();
