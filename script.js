/* ================= YEAR ================= */
const year = document.getElementById("year");
if(year) year.textContent = new Date().getFullYear();

/* ================= MOBILE MENU ================= */

const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");

if(burger && mobileNav){
  burger.addEventListener("click", () => {
    mobileNav.classList.toggle("is-open");
  });
}

/* ================= SMOOTH SCROLL (OFFSET FIX) ================= */

(function(){
  const headerOffset = () => window.innerWidth < 920 ? 74 : 84;

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener("click", e=>{
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if(!el) return;
      e.preventDefault();

      const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset();
      window.scrollTo({top:y,behavior:"smooth"});
    });
  });
})();

/* ================= REVEAL ON SCROLL ================= */

(function(){
  const els = document.querySelectorAll(".section, .hero, .card");
  els.forEach(el=>el.classList.add("reveal"));

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-in");
      }
    });
  },{threshold:.15});

  els.forEach(el=>io.observe(el));
})();

/* ================= FLOATING TAB TITLE ================= */

(function(){
  const base="QUIETRITE — UGC Performance";
  const gap="   •   ";
  const text=base+gap;
  let i=0;

  setInterval(()=>{
    document.title=text.slice(i)+text.slice(0,i);
    i=(i+1)%text.length;
  },220);
})();

/* ================= RESULTS RING ANIMATION ================= */

(function(){
  const card=document.querySelector(".ringwrap");
  if(!card) return;

  const nf=68.1;
  const f=31.9;

  const r=46;
  const C=2*Math.PI*r;

  const segNF=document.querySelector(".ring__seg--nf");
  const segF=document.querySelector(".ring__seg--f");

  const nfLen=C*(nf/100);
  const fLen=C*(f/100);

  requestAnimationFrame(()=>{
    segNF.style.strokeDashoffset=C-nfLen;
    segF.style.strokeDashoffset=C-fLen;
  });
})();
