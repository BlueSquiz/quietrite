const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    mobileNav.hidden = expanded;
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    });
  });
}

// mailto form (bez backendu)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const name = encodeURIComponent(data.get('name') || '');
    const email = encodeURIComponent(data.get('email') || '');
    const message = encodeURIComponent(data.get('message') || '');

    const subject = encodeURIComponent(`QUIETRITE — Współpraca (${decodeURIComponent(name)})`);
    const body = encodeURIComponent(
      `Imię/Marka: ${decodeURIComponent(name)}\n` +
      `E-mail: ${decodeURIComponent(email)}\n\n` +
      `Wiadomość:\n${decodeURIComponent(message)}\n`
    );

    window.location.href = `mailto:kontakt@quietrite.pl?subject=${subject}&body=${body}`;
  });
}
