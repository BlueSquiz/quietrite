(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------------------------
  // 1) Logo fallback (quietrite-logo.png)
  // ---------------------------
  function fixLogoIfMissing() {
    const candidates = [
      'img[alt*="QUIETRITE" i]',
      'img[alt*="Quietrite" i]',
      '.brand img',
      '.logo img',
      'header img',
      '.site-header img'
    ];

    for (const sel of candidates) {
      const img = $(sel);
      if (!img) continue;

      // jeśli nie ma src albo jest "broken", podstaw prawidłowy plik z root repo
      const hasSrc = img.getAttribute("src") && img.getAttribute("src").trim().length > 0;
      const isBroken = img.complete && img.naturalWidth === 0;

      if (!hasSrc || isBroken) {
        img.src = "./quietrite-logo.png?v=1";
      }

      // wymuś bezpieczne dopasowanie
      img.loading = img.loading || "eager";
      img.decoding = img.decoding || "async";
      img.style.objectFit = "contain";
      img.style.display = "block";
      break;
    }
  }

  // ---------------------------
  // 2) Burger/menu toggle (fallback dla różnych nazw)
  // ---------------------------
  function setupMenu() {
    const btn =
      $('#menuBtn') ||
      $('#menuToggle') ||
      $('#burger') ||
      $('.menu-btn') ||
      $('.menu-toggle') ||
      $('button[aria-label*="menu" i]') ||
      $('button[aria-controls]');

    const panel =
      $('#menuPanel') ||
      $('#mobileMenu') ||
      $('#mobileNav') ||
      $('.menu-panel') ||
      $('.mobile-menu') ||
      $('nav');

    if (!btn || !panel) return;

    // ARIA
    if (!btn.hasAttribute("aria-expanded")) btn.setAttribute("aria-expanded", "false");
    if (!btn.getAttribute("aria-controls")) {
      // jeśli panel ma id, podepnij
      if (panel.id) btn.setAttribute("aria-controls", panel.id);
    }

    const OPEN_CLASS = "is-open";

    const open = () => {
      panel.classList.add(OPEN_CLASS);
      btn.classList.add(OPEN_CLASS);
      btn.setAttribute("aria-expanded", "true");
      document.documentElement.classList.add("menu-open");
      document.body.classList.add("menu-open");
    };

    const close = () => {
      panel.classList.remove(OPEN_CLASS);
      btn.classList.remove(OPEN_CLASS);
      btn.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
    };

    const toggle = () => {
      const isOpen = panel.classList.contains(OPEN_CLASS);
      isOpen ? close() : open();
    };

    // klik na przycisk
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });

    // klik poza menu -> zamknij
    document.addEventListener("click", (e) => {
      const isOpen = panel.classList.contains(OPEN_CLASS);
      if (!isOpen) return;
      const target = e.target;
      if (panel.contains(target) || btn.contains(target)) return;
      close();
    });

    // ESC -> zamknij
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    // klik w link w menu -> zamknij (na mobile)
    $$('#' + panel.id + ' a[href^="#"], .menu-panel a[href^="#"], .mobile-menu a[href^="#"], nav a[href^="#"]')
      .forEach((a) => a.addEventListener("click", () => close()));
  }

  // ---------------------------
  // 3) Smooth scroll z offsetem pod sticky header
  // ---------------------------
  function setupSmoothScroll() {
    const getOffset = () => {
      // spróbuj znaleźć header
      const header = $('header') || $('.site-header') || $('.topbar');
      if (header && header.offsetHeight) return header.offsetHeight + 12;
      return window.innerWidth < 920 ? 74 : 84;
    };

    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href.length < 2) return;

        const el = document.querySelector(href);
        if (!el) return;

        e.preventDefault();

        const y = el.getBoundingClientRect().top + window.pageYOffset - getOffset();
        window.scrollTo({ top: y, behavior: "smooth" });

        // zaktualizuj hash po scrollu (żeby działał back)
        history.pushState(null, "", href);
      });
    });
  }

  // ---------------------------
  // Init
  // ---------------------------
  document.addEventListener("DOMContentLoaded", () => {
    fixLogoIfMissing();
    setupMenu();
    setupSmoothScroll();
  });

  // logo może się wczytać później
  window.addEventListener("load", fixLogoIfMissing);
})();
