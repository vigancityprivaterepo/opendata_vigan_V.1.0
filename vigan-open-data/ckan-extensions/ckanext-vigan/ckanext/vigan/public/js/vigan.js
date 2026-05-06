/**
 * vigan.js — Vigan City Open Data Portal
 * Client-side enhancements for the CKAN admin UI + homepage
 */

(function () {
  'use strict';

  /* ── DOM ready helper ─────────────────────────────────────────────────── */
  function ready(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  /* ══════════════════════════════════════════════════════════════════════
     1. MOBILE NAVIGATION TOGGLE
     ══════════════════════════════════════════════════════════════════════ */
  ready(function () {
    var toggle = document.getElementById('vigan-nav-toggle');
    var menu   = document.getElementById('vigan-mobile-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        menu.hidden = true;
      } else {
        menu.hidden = false;
      }
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });


  /* ══════════════════════════════════════════════════════════════════════
     2. ANIMATED STATS COUNTER (Intersection Observer)
     ══════════════════════════════════════════════════════════════════════ */
  ready(function () {
    var counters = document.querySelectorAll('.js-counter');
    if (!counters.length) return;

    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function animateCounter(el) {
      var target  = parseInt(el.dataset.target, 10) || 0;
      var suffix  = el.dataset.suffix || '';
      var duration = 1800; // ms
      var start   = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var elapsed  = timestamp - start;
        var progress = Math.min(elapsed / duration, 1);
        var value    = Math.floor(easeOutQuart(progress) * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) { requestAnimationFrame(step); }
        else { el.textContent = target.toLocaleString() + suffix; }
      }

      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      counters.forEach(function (el) { observer.observe(el); });
    } else {
      /* Fallback: just set the value immediately */
      counters.forEach(function (el) {
        var target = parseInt(el.dataset.target, 10) || 0;
        var suffix = el.dataset.suffix || '';
        el.textContent = target.toLocaleString() + suffix;
      });
    }
  });


  /* ══════════════════════════════════════════════════════════════════════
     3. CODE BLOCK COPY BUTTON
     ══════════════════════════════════════════════════════════════════════ */
  ready(function () {
    document.querySelectorAll('.vigan-code-block__copy').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.dataset.target;
        var codeEl   = document.getElementById(targetId);
        if (!codeEl) return;

        var text = codeEl.textContent || codeEl.innerText;
        navigator.clipboard.writeText(text.trim()).then(function () {
          var original = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.color = '#10B981';
          setTimeout(function () {
            btn.textContent = original;
            btn.style.color = '';
          }, 2000);
        }).catch(function () {
          /* Fallback for older browsers */
          var ta = document.createElement('textarea');
          ta.value = text.trim();
          ta.style.position = 'fixed';
          ta.style.opacity  = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        });
      });
    });
  });


  /* ══════════════════════════════════════════════════════════════════════
     4. NAVBAR SCROLL SHADOW
     ══════════════════════════════════════════════════════════════════════ */
  ready(function () {
    var navbar = document.querySelector('.vigan-navbar');
    if (!navbar) return;

    function updateShadow() {
      if (window.scrollY > 8) {
        navbar.style.boxShadow = '0 4px 24px rgba(6,95,70,0.4)';
      } else {
        navbar.style.boxShadow = '0 2px 12px rgba(6,95,70,0.3)';
      }
    }

    window.addEventListener('scroll', updateShadow, { passive: true });
    updateShadow();
  });


  /* ══════════════════════════════════════════════════════════════════════
     5. AUTO-DISMISS FLASH MESSAGES
     ══════════════════════════════════════════════════════════════════════ */
  ready(function () {
    var alerts = document.querySelectorAll('.alert:not(.alert-error):not(.alert-danger)');
    alerts.forEach(function (alert) {
      setTimeout(function () {
        alert.style.transition = 'opacity 0.5s ease, max-height 0.5s ease';
        alert.style.opacity    = '0';
        alert.style.maxHeight  = '0';
        alert.style.overflow   = 'hidden';
        setTimeout(function () { alert.remove(); }, 500);
      }, 5000);
    });
  });


  /* ══════════════════════════════════════════════════════════════════════
     6. DATASET SEARCH — hero search form enhancement
     ══════════════════════════════════════════════════════════════════════ */
  ready(function () {
    var heroSearch = document.getElementById('hero-search');
    if (!heroSearch) return;

    /* Focus the input when "/" key is pressed (developer UX) */
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        heroSearch.focus();
      }
    });
  });

})();
