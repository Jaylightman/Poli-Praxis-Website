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
      4: [[9, 12], [14, 18]], 5: [[9, 12]]
    },
    'muenchen-nord': {
      1: [[8, 12], [13, 16]], 2: [[8, 12], [13, 17]], 3: [[8, 12]],
      4: [[8, 12], [13, 17]], 5: [[8, 12]]
    },
    'augsburg': {
      1: [[9, 12], [14, 17]], 2: [[9, 12], [14, 17]], 3: [[9, 12]],
      4: [[9, 14], [15.5, 18]], 5: [[9, 14]]
    },
    'augsburg-zentrum': {
      1: [[8, 12]], 2: [[8, 12], [13, 17]], 3: [[8, 12], [13, 17]],
      4: [[8, 14]], 5: [[8, 14]]
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
     Office filter bars (doctors page + specialties section)
     Cards carry data-offices; specialty cards derive it from their
     location chips so the visible tags stay the single source of truth.
     ------------------------------------------------------------------ */
  var CITY_SLUGS = { 'München Mitte': 'muenchen-mitte', 'München Nord': 'muenchen-nord', 'Augsburg Pfersee': 'augsburg', 'Augsburg Zentrum': 'augsburg-zentrum' };
  document.querySelectorAll('.feature-card__tags').forEach(function (tags) {
    var slugs = [];
    tags.querySelectorAll('.chip').forEach(function (chip) {
      var slug = CITY_SLUGS[chip.textContent.trim()];
      if (slug) slugs.push(slug);
    });
    var card = tags.closest('.feature-card');
    if (card && slugs.length) card.setAttribute('data-offices', slugs.join(' '));
  });

  document.querySelectorAll('[data-filter-bar]').forEach(function (filterBar) {
    var scope = filterBar.closest('section') || document;
    var buttons = filterBar.querySelectorAll('.filter-btn');
    var cards = scope.querySelectorAll('[data-offices]');
    var countEl = scope.querySelector('[data-filter-count]');

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
        var label = visible === 1
          ? (countEl.getAttribute('data-singular') || '')
          : (countEl.getAttribute('data-plural') || '');
        countEl.textContent = visible + ' ' + label;
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
  });

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

  /* ------------------------------------------------------------------
     Kontakt: nav link opens a location picker, then jumps to that
     office's "Kontakt & Anschrift" section
     ------------------------------------------------------------------ */
  var kontaktTriggers = document.querySelectorAll('[data-kontakt-trigger]');
  if (kontaktTriggers.length) {
    var KONTAKT_OFFICES = [
      { name: 'München Mitte', addr: 'Herzog-Wilhelm-Str. 17, München', href: 'standort-muenchen-mitte.html#kontakt-anschrift' },
      { name: 'München Nord', addr: 'Wundtstr. 15, München', href: 'standort-muenchen-nord.html#kontakt-anschrift' },
      { name: 'Augsburg Pfersee', addr: 'Kurhausstr. 1, Augsburg', href: 'standort-augsburg-pfersee.html#kontakt-anschrift' },
      { name: 'Augsburg Zentrum', addr: 'Ludwigstraße 7, Augsburg', href: 'standort-augsburg-zentrum.html#kontakt-anschrift' }
    ];
    var pinSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>';
    var arrowSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

    var overlay = document.createElement('div');
    overlay.className = 'kontakt-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'kontakt-modal-title');
    overlay.hidden = true;

    var optionsHtml = KONTAKT_OFFICES.map(function (o) {
      return '<a class="kontakt-modal__option" href="' + o.href + '">' +
        pinSvg +
        '<span class="kontakt-modal__option-text">' +
          '<span class="kontakt-modal__option-name">' + o.name + '</span>' +
          '<span class="kontakt-modal__option-addr">' + o.addr + '</span>' +
        '</span>' + arrowSvg +
      '</a>';
    }).join('');

    overlay.innerHTML =
      '<div class="kontakt-modal__dialog">' +
        '<div class="kontakt-modal__head">' +
          '<h2 id="kontakt-modal-title">Welchen Standort möchten Sie kontaktieren?</h2>' +
          '<button type="button" class="kontakt-modal__close" aria-label="Schließen">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
          '</button>' +
        '</div>' +
        '<p class="kontakt-modal__intro">Wählen Sie eine Praxis — Sie gelangen direkt zu Adresse und Kontaktdaten.</p>' +
        '<div class="kontakt-modal__options">' + optionsHtml + '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var closeBtn = overlay.querySelector('.kontakt-modal__close');
    var focusable = overlay.querySelectorAll('a.kontakt-modal__option, button');
    var lastFocused = null;

    var openModal = function (trigger) {
      lastFocused = trigger || document.activeElement;
      overlay.hidden = false;
      // next frame so the transition runs from the hidden state
      requestAnimationFrame(function () { overlay.classList.add('is-open'); });
      if (focusable.length) focusable[0].focus();
    };

    var closeModal = function () {
      overlay.classList.remove('is-open');
      var finish = function () {
        overlay.hidden = true;
        overlay.removeEventListener('transitionend', finish);
      };
      if (reduceMotion) finish();
      else overlay.addEventListener('transitionend', finish);
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    };

    kontaktTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        if (nav && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }
        openModal(trigger);
      });
    });

    // Any option click closes the modal (navigation/scroll proceeds)
    overlay.querySelectorAll('.kontakt-modal__option').forEach(function (opt) {
      opt.addEventListener('click', function () { closeModal(); });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (overlay.hidden) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'Tab' && focusable.length) {
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
  }
})();
