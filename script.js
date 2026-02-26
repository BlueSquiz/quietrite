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
  // FORM (Formspree) — no redirect + UI messages
  // -------------------------
  const briefForm = document.getElementById("briefForm");
  if (briefForm) {
    const successMessage = document.getElementById("formSuccess");
    const errorMessage = document.getElementById("formError");
    const submitBtn = briefForm.querySelector('button[type="submit"]');

    const setBtn = (loading) => {
      if (!submitBtn) return;
      if (!submitBtn.dataset.defaultText) submitBtn.dataset.defaultText = submitBtn.textContent.trim();
      if (loading) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Wysyłam…";
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.defaultText;
      }
    };

    briefForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (successMessage) successMessage.hidden = true;
      if (errorMessage) errorMessage.hidden = true;

      setBtn(true);

      const endpoint = briefForm.getAttribute("action")?.trim() || "https://formspree.io/f/xdalywzz";
      const data = new FormData(briefForm);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          briefForm.reset();
          if (successMessage) {
            successMessage.hidden = false;
            successMessage.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "nearest",
            });
          }
        } else {
          if (errorMessage) errorMessage.hidden = false;
        }
      } catch (err) {
        if (errorMessage) errorMessage.hidden = false;
      } finally {
        setBtn(false);
      }
    });
  }

  // -------------------------
  // VIDEO MODAL (Portfolio)
  // -------------------------
  const videoModal = document.getElementById("videoModal");
  const videoModalVideo = document.getElementById("videoModalVideo");
  const modalPanel = videoModal ? videoModal.querySelector(".video-modal__panel") : null;

  let lastActiveEl = null;

  const openVideoModal = (src) => {
    if (!videoModal || !videoModalVideo || !src) return;

    lastActiveEl = document.activeElement;

    videoModalVideo.src = src;
    videoModal.hidden = false;
    videoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (modalPanel) modalPanel.focus({ preventScroll: true });

    const p = videoModalVideo.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  const closeVideoModal = () => {
    if (!videoModal || !videoModalVideo) return;

    videoModalVideo.pause();
    videoModalVideo.removeAttribute("src");
    videoModalVideo.load();

    videoModal.hidden = true;
    videoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastActiveEl && typeof lastActiveEl.focus === "function") lastActiveEl.focus();
    lastActiveEl = null;
  };

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
