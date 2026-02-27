(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // YEAR
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // NAV
  const header = $(".header");
  const menuToggle = $("#menuToggle");
  const nav = $("#siteNav");
  const overlay = $("#navOverlay");

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
     // Close mobile nav when any nav link is clicked
if (nav) {
  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) closeNav();
  });
}
  const toggleNav = () => {
    if (!nav) return;
    nav.dataset.state === "open" ? closeNav() : openNav();
  };

  if (menuToggle) menuToggle.addEventListener("click", (e) => {
    e.preventDefault();
    toggleNav();
  }, { passive: false });

  if (overlay) overlay.addEventListener("click", closeNav);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 880) closeNav();
  });

  // Smooth scroll with header offset
  const smoothScrollTo = (target) => {
    if (!target) return;
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const extra = 14;
    const y = target.getBoundingClientRect().top + window.pageYOffset - headerH - extra;

    window.scrollTo({
      top: Math.max(0, y),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    closeNav();
    window.setTimeout(() => smoothScrollTo(target), 60);
  });

  window.addEventListener("load", () => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const target = document.getElementById(hash.slice(1));
      if (target) window.setTimeout(() => smoothScrollTo(target), 120);
    }
  });

  // Reveal
  const revealEls = $$("[data-reveal]");
  if (revealEls.length) {
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
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
  }

  // Donut (safe)
  const donut = $("#donut");
  if (donut) {
    const segA = $(".donut__seg--a", donut);
    const segB = $(".donut__seg--b", donut);

    if (segA && segB) {
      const a = parseFloat(donut.dataset.a || "0");
      const b = parseFloat(donut.dataset.b || "0");

      const r = 46;
      const c = 2 * Math.PI * r;

      const clamp = (v) => Math.max(0, Math.min(100, v));
      const aLen = (clamp(a) / 100) * c;
      const bLen = (clamp(b) / 100) * c;

      segA.style.strokeDasharray = `0 ${c}`;
      segB.style.strokeDasharray = `0 ${c}`;
      segA.style.strokeDashoffset = "0";
      segB.style.strokeDashoffset = `-${aLen}`;

      const animateDonut = () => {
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
  }

  // -------------------------
  // FORM (Formspree)
  // -------------------------
  const briefForm = document.getElementById("briefForm");
const formStatus = document.getElementById("formStatus");

if (briefForm && formStatus) {
  briefForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    formStatus.hidden = false;
    formStatus.textContent = "Wysyłam…";

    const data = new FormData(briefForm);

    try {
      const res = await fetch(briefForm.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        briefForm.reset();
        formStatus.textContent = "✅ Brief wysłany. Odezwę się wkrótce.";
      } else {
        formStatus.textContent = "❌ Coś poszło nie tak. Spróbuj ponownie.";
      }
    } catch {
      formStatus.textContent = "❌ Brak połączenia. Spróbuj ponownie.";
    }
  });
}

  // -------------------------
  // VIDEO MODAL (Portfolio) — HARD FIX
  // -------------------------
  const videoModal = document.getElementById("videoModal");
  const videoModalVideo = document.getElementById("videoModalVideo");
  const modalPanel = videoModal ? videoModal.querySelector(".video-modal__panel") : null;

  let lastActiveEl = null;
  let modalScrollY = 0;

  const forceCloseOnLoad = () => {
    if (!videoModal || !videoModalVideo) return;
    // ZAWSZE startujemy z zamkniętym modalem
    videoModalVideo.pause();
    videoModalVideo.removeAttribute("src");
    videoModalVideo.load();
    videoModal.hidden = true;
    videoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  // odpal natychmiast po załadowaniu JS
  forceCloseOnLoad();

  const openVideoModal = (src) => {
    if (!videoModal || !videoModalVideo || !src) return;

    lastActiveEl = document.activeElement;
    modalScrollY = window.scrollY || 0;
    document.body.style.top = `-${modalScrollY}px`;
    
    videoModalVideo.src = src;
    videoModal.hidden = false;
    videoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (modalPanel) modalPanel.focus({ preventScroll: true });

    // ❗️Nie autoplayujemy, żeby nic nie wyskakiwało na iOS.
    // User sam kliknie Play w modalu.
  };

  const closeVideoModal = () => {
  if (!videoModal || !videoModalVideo) return;

  videoModalVideo.pause();
  videoModalVideo.removeAttribute("src");
  videoModalVideo.load();

  videoModal.hidden = true;
  videoModal.setAttribute("aria-hidden", "true");

  const y = modalScrollY;
  document.body.style.top = "";
  document.body.classList.remove("modal-open");
  window.scrollTo(0, y);

  if (lastActiveEl && typeof lastActiveEl.focus === "function") lastActiveEl.focus();
  lastActiveEl = null;
};
  
  // Otwieramy TYLKO po prawdziwym kliknięciu użytkownika w kartę .work--video
  document.addEventListener("click", (e) => {
    const card = e.target.closest("a.work--video[data-video]");
    if (!card) return;

    // zabezpieczenie przed “dziwnymi” klikami
    if (!e.isTrusted) return;

    const src = card.getAttribute("data-video");
    if (!src) return;

    e.preventDefault();
    openVideoModal(src);
  });

  // Zamknięcie: X / tło
  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target && e.target.closest && e.target.closest("[data-close]")) closeVideoModal();
    });
  }

  // ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVideoModal();
  });

  // open from portfolio card
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-video]");
    if (!a) return;

    const src = a.getAttribute("data-video");
    if (!src) return;

    e.preventDefault();
    openVideoModal(src);
  });

  // close (X / backdrop)
  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target && e.target.closest && e.target.closest("[data-close]")) {
        closeVideoModal();
      }
    });
  }

  // ESC closes modal (and nav already handled above)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVideoModal();
  });

  // -------------------------
  // PORTFOLIO VIDEO PREVIEW (auto play when visible)
  // -------------------------
  if (!prefersReducedMotion) {
    const previewVideos = Array.from(document.querySelectorAll(".work--video .work__video"));

    const loadAndPlay = async (video) => {
      if (!video) return;

      if (!video.src) {
        const src = video.getAttribute("data-src");
        if (!src) return;
        video.src = src;
      }

      try {
        await video.play();
      } catch (_) {}
    };

    const pauseAndUnload = (video) => {
      if (!video) return;
      video.pause();
      video.removeAttribute("src");
      video.load();
    };

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) loadAndPlay(video);
          else pauseAndUnload(video);
        });
      }, { threshold: 0.35 });

      previewVideos.forEach((v) => io.observe(v));
    }
  }

})();
