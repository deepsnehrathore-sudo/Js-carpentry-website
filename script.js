const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const reveals = document.querySelectorAll('.reveal');
const year = document.querySelector('#year');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox?.querySelector('img');
const quoteForm = document.querySelector('#quoteForm');
const chatToggle = document.querySelector('.chat-toggle');
const chatBox = document.querySelector('.chat-box');
const chatClose = document.querySelector('.chat-close');

year.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 35));
    const timer = setInterval(() => {
      current = Math.min(target, current + step);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 30);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.8 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

document.querySelectorAll('.project').forEach(project => {
  project.addEventListener('click', () => {
    lightboxImage.src = project.dataset.image;
    lightbox.showModal();
  });
});

lightbox?.querySelector('button')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

quoteForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(quoteForm);
  const subject = encodeURIComponent(`Website enquiry — ${form.get('service')}`);
  const body = encodeURIComponent(
`Name: ${form.get('name')}
Phone: ${form.get('phone')}
Email: ${form.get('email')}
Service: ${form.get('service')}
Location: ${form.get('location') || 'Not provided'}

Project details:
${form.get('details')}`
  );
  window.location.href = `mailto:jscarpentrypvtltd@gmail.com?subject=${subject}&body=${body}`;
});

chatToggle.addEventListener('click', () => {
  chatBox.hidden = !chatBox.hidden;
});
chatClose.addEventListener('click', () => {
  chatBox.hidden = true;
});
