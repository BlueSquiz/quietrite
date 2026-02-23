const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* ===== Mobile menu (iOS-safe) ===== */
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");

function closeMenu() {
  if (!burger || !mobileNav) return;
  burger.setAttribute("aria-expanded", "false");
  mobileNav.classList.remove("is-open");
  mobileNav.setAttribute("aria-hidden", "true");
}

function toggleMenu() {
  if (!burger || !mobileNav) return;
  const expanded = burger.getAttribute("aria-expanded") === "true";
  burger.setAttribute("aria-expanded", String(!expanded));
  mobileNav.classList.toggle("is-open", !expanded);
  mobileNav.setAttribute("aria-hidden", String(expanded));
}

function onBurger(e) {
  e.preventDefault();
  e.stopPropagation();
  toggleMenu();
}

if (burger && mobileNav) {
  burger.addEventListener("click", onBurger, { passive: false });
  burger.addEventListener("touchend", onBurger, { passive: false });

  mobileNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => closeMenu());
    a.addEventListener("touchend", () => closeMenu(), { passive: true });
  });

  document.addEventListener("click", (e) => {
    if (!mobileNav.classList.contains("is-open")) return;
    if (burger.contains(e.target)) return;
    if (mobileNav.contains(e.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ===== Mailto form ===== */
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const name = encodeURIComponent(data.get("name") || "");
    const email = encodeURIComponent(data.get("email") || "");
    const message = encodeURIComponent(data.get("message") || "");

    const subject = encodeURIComponent(
      `QUIETRITE — Współpraca (${decodeURIComponent(name)})`
    );
    const body = encodeURIComponent(
      `Imię/Marka: ${decodeURIComponent(name)}\n` +
      `E-mail: ${decodeURIComponent(email)}\n\n` +
      `Wiadomość:\n${decodeURIComponent(message)}\n`
    );

    window.location.href = `mailto:kontakt@quietrite.pl?subject=${subject}&body=${body}`;
  });
}

/* ===== Floating tab title (Option 1) ===== */
(function floatingTitle() {
  const base = "QUIETRITE — UGC premium";
  const gap = "   •   ";
  const text = base + gap;

  let i = 0;
  const speedMs = 220; // wolniej: 300–450

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) document.title = base;
  });

  setInterval(() => {
    document.title = text.slice(i) + text.slice(0, i);
    i = (i + 1) % text.length;
  }, speedMs);
})();

/* ===== Animated results ring (SVG) ===== */
(function resultsRing() {
  const card = document.querySelector(".ringcard");
  if (!card) return;

  const views = Number(card.dataset.value || "23650");
  const followersPct = Number(card.dataset.followers || "31.9");
  const nonFollowersPct = Number(card.dataset.nonfollowers || "68.1");

  const viewsEl = document.getElementById("viewsValue");
  const fEl = document.getElementById("followersPct");
  const nfEl = document.getElementById("nonFollowersPct");

  if (viewsEl) viewsEl.textContent = views.toLocaleString("en-US"); // 23,650
  if (fEl) fEl.textContent = followersPct.toFixed(1).replace(".", ",") + "%";
  if (nfEl) nfEl.textContent = nonFollowersPct.toFixed(1).replace(".", ",") + "%";

  const r = 46;
  const C = 2 * Math.PI * r; // ~289

  const segNF = card.querySelector(".ring__seg--nf");
  const segF = card.querySelector(".ring__seg--f");
  if (!segNF || !segF) return;

  const nfLen = C * (nonFollowersPct / 100);
  const fLen = C * (followersPct / 100);

  segNF.style.strokeDasharray = `${nfLen} ${C - nfLen}`;
  segF.style.strokeDasharray = `${fLen} ${C - fLen}`;

  segF.style.transform = `rotate(${(nonFollowersPct / 100) * 360}deg)`;
  segF.style.transformOrigin = "60px 60px";

  segNF.style.strokeDashoffset = `${C}`;
  segF.style.strokeDashoffset = `${C}`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      segNF.style.strokeDashoffset = `${C - nfLen}`;
      segF.style.strokeDashoffset = `${C - fLen}`;
    });
  });

  const ring = card.querySelector(".ring");
  if (ring) ring.classList.add("ring--float");
})();
