(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const header = $(".header");
  const menuToggle = $("#menuToggle");
  const nav = $("#siteNav");
  const overlay = $("#navOverlay");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ----- YEAR
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ----- MOBILE NAV (działa na iPhone)
  const openNav = () => {
    if (!nav || !menuToggle || !overlay) return;
    nav.dataset.state = "open";
    overlay.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Zamknij menu");
    document.body.classList.add("nav-open");
  };

  const closeNav = () => {
    if (!nav || !menuToggle || !overlay) return;
    nav.dataset.state = "closed";
    overlay.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Otwórz menu");
    document.body.classList.remove("nav-open");
  };

  const toggleNav = () => {
    if (!nav) return;
    const isOpen = nav.dataset.state === "open";
    isOpen ? closeNav() : openNav();
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      toggleNav();
    }, { passive: false });
  }

  if (overlay) {
    overlay.addEventListener("click", () => closeNav());
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    // jak przechodzisz na desktop - zamknij
    if (window.innerWidth > 880) closeNav();
  });

  // ----- SMOOTH SCROLL (bez przeskakiwania + offset na sticky header)
  const smoothScrollTo = (target) => {
    if (!target) return;

    const headerH = header ? header.getBoundingClientRect().height : 0;
    const extra = 14; // oddech
    const y = target.getBoundingClientRect().top + window.pageYOffset - headerH - extra;

    window.scrollTo({
      top: Math.max(0, y),
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  const onAnchorClick = (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    closeNav();
    // mały timeout żeby zamknięcie menu nie “szarpało” scrolla
    window.setTimeout(() => smoothScrollTo(target), 60);
  };

  document.addEventListener("click", onAnchorClick);

  // jeśli wejdziesz z hashem (np. #pakiety) – też ustaw offset
  window.addEventListener("load", () => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const target = document.getElementById(hash.slice(1));
      if (target) window.setTimeout(() => smoothScrollTo(target), 120);
    }
  });

  // ----- REVEAL ANIMATIONS
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // ----- DONUT SETUP + ANIMATION
  const donut = $("#donut");
  if (donut) {
    const segA = $(".donut__seg--a", donut);
    const segB = $(".donut__seg--b", donut);

    const a = parseFloat(donut.dataset.a || "31.9");
    const b = parseFloat(donut.dataset.b || "68.1");

    const r = 46;
    const c = 2 * Math.PI * r;

    // długości łuków
    const aLen = (a / 100) * c;
    const bLen = (b / 100) * c;

    // init: ukryte
    segA.style.strokeDasharray = `0 ${c}`;
    segB.style.strokeDasharray = `0 ${c}`;
    segA.style.strokeDashoffset = "0";
    segB.style.strokeDashoffset = `-${aLen}`;

    const animateDonut = () => {
      // włącz właściwe wartości (CSS transition zrobi animację)
      segA.style.strokeDasharray = `${aLen} ${c - aLen}`;
      segB.style.strokeDasharray = `${bLen} ${c - bLen}`;
      segB.style.strokeDashoffset = `-${aLen}`;
    };

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateDonut();
            io.disconnect();
          }
        });
      }, { threshold: 0.25 });
      io.observe(donut);
    } else {
      animateDonut();
    }
  }

  // ----- “PŁYWAJĄCY” TITLE (opcja 1)
  const baseTitle = "QUIETRITE • UGC PERFORMANCE • HEALTH & SPORT • ";
  let t = baseTitle;
  if (!prefersReducedMotion) {
    window.setInterval(() => {
      t = t.slice(1) + t[0];
      document.title = t.trim();
    }, 180);
  }

})();
