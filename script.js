/* ================= YEAR ================= */
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* ================= MOBILE MENU (naprawione + overlay + zamykanie) ================= */
const burger = document.getElementById("burger") || document.querySelector(".burger, .menu-btn, .nav__burger");
const mobileNav = document.getElementById("mobileNav") || document.querySelector("#mobileNav, .mobile-nav, .nav__mobile");

let overlay = document.querySelector(".navOverlay");
if (!overlay) {
  overlay = document.createElement("div");
  overlay.className = "navOverlay";
  document.body.appendChild(overlay);
}

function openMenu() {
  if (!mobileNav) return;
  mobileNav.classList.add("is-open");
  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  if (!mobileNav) return;
  mobileNav.classList.remove("is-open");
  overlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

function toggleMenu() {
  if (!mobileNav) return;
  mobileNav.classList.contains("is-open") ? closeMenu() : openMenu();
}

if (burger && mobileNav) {
  burger.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  // ESC zamyka
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // klik w link w menu zamyka menu
  mobileNav.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", closeMenu);
  });
}

/* ================= SMOOTH SCROLL (bez przeskoku + offset nav) ================= */
(function () {
  const headerOffset = () => (window.innerWidth < 920 ? 74 : 84);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;

      const el = document.querySelector(id);
      if (!el) return;

      e.preventDefault();

      const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset();
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
})();

/* ================= REVEAL ON SCROLL ================= */
(function () {
  const els = document.querySelectorAll(".section, .hero, .card, .grid, .ringwrap");
  els.forEach(el => el.classList.add("reveal"));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-in");
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* ================= FLOATING TAB TITLE ================= */
(function () {
  const base = "QUIETRITE — UGC PERFORMANCE";
  const gap = "   •   ";
  const text = base + gap;
  let i = 0;

  setInterval(() => {
    document.title = text.slice(i) + text.slice(0, i);
    i = (i + 1) % text.length;
  }, 220);
})();

/* ================= RESULTS RING ANIMATION ================= */
(function () {
  const wrap = document.querySelector(".ringwrap");
  if (!wrap) return;

  const nf = 68.1; // osoby nieobserwujące
  const f = 31.9;  // obserwatorzy

  const r = 46;
  const C = 2 * Math.PI * r;

  const segNF = document.querySelector(".ring__seg--nf");
  const segF = document.querySelector(".ring__seg--f");
  if (!segNF || !segF) return;

  const nfLen = C * (nf / 100);
  const fLen = C * (f / 100);

  requestAnimationFrame(() => {
    segNF.style.strokeDasharray = `${C}`;
    segF.style.strokeDasharray = `${C}`;
    segNF.style.strokeDashoffset = `${C - nfLen}`;
    segF.style.strokeDashoffset = `${C - fLen}`;
  });
})();
