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


// Version 4 gallery filters
document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.gallery-v4 .project').forEach(project => {
      project.classList.toggle('is-hidden', filter !== 'all' && project.dataset.category !== filter);
    });
  });
});

// Version 4 instant estimator
const estimatorForm = document.querySelector('#estimatorForm');
const estimateResult = document.querySelector('#estimateResult');

const estimatorRates = {
  standard: { low: 28, high: 40, label: 'standard residential framing' },
  prefab: { low: 20, high: 40, label: 'prefabricated frame installation' },
  highend: { low: 40, high: 80, label: 'high-end stick framing' },
  lockup: { low: 10, high: 15, label: 'lock-up carpentry' }
};

estimatorForm?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(estimatorForm);
  const area = Number(data.get('area'));
  if (!Number.isFinite(area) || area < 20) return;

  const rate = estimatorRates[data.get('projectType')];
  const multiplier = Number(data.get('storeys')) * Number(data.get('complexity')) * Number(data.get('access')) * Number(data.get('urgency'));
  const low = Math.round((area * rate.low * multiplier) / 500) * 500;
  const high = Math.round((area * rate.high * multiplier) / 500) * 500;
  const format = value => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);

  estimateResult.innerHTML = `
    <p class="eyebrow">Indicative estimate</p>
    <span class="estimate-range">${format(low)}–${format(high)}</span>
    <h3>Rough budget for ${rate.label}</h3>
    <ul>
      <li>Based on approximately ${area} sq</li>
      <li>Excludes GST unless confirmed in a formal quote</li>
      <li>Subject to plans, engineering, materials, access and site conditions</li>
    </ul>
    <a class="button primary" href="#quote">Request a detailed quote</a>
    <p class="estimate-disclaimer">This automated range is a preliminary guide only and is not an offer, quotation or fixed price. JS Carpentry must review project documents before confirming pricing.</p>
  `;
});

// Version 4 smart website assistant (local FAQ assistant; no external API key required)
const chatForm = document.querySelector('#chatForm');
const chatInput = document.querySelector('#chatInput');
const chatMessages = document.querySelector('#chatMessages');

const faqAnswers = [
  {
    terms: ['service', 'offer', 'do you do', 'framing'],
    answer: 'JS Carpentry specialises in timber framing, lock-up carpentry, prefabricated wall and roof frame installation, and high-end stick framing.'
  },
  {
    terms: ['estimate', 'price', 'cost', 'how much', 'quote'],
    answer: 'Use the Instant Estimator on this page for a rough range. For an accurate quote, send the plans, engineering, site address and preferred start date.'
  },
  {
    terms: ['area', 'suburb', 'location', 'where', 'melbourne'],
    answer: 'JS Carpentry services Melbourne and surrounding areas, including Tarneit, Truganina, Werribee, Point Cook, Hoppers Crossing, Wyndham Vale, Melton and Caroline Springs.'
  },
  {
    terms: ['plan', 'drawing', 'pdf', 'send'],
    answer: 'Email plans and engineering to jscarpentrypvtltd@gmail.com. Include your name, phone number, site address, scope and preferred start date.'
  },
  {
    terms: ['phone', 'call', 'contact', 'number'],
    answer: 'Call JS Carpentry on 0420 170 199 or email jscarpentrypvtltd@gmail.com.'
  },
  {
    terms: ['start', 'available', 'availability', 'when'],
    answer: 'Availability depends on project size and current scheduling. Send your preferred start date with the plans so JS Carpentry can confirm timing.'
  },
  {
    terms: ['commercial', 'residential', 'builder', 'developer'],
    answer: 'The current focus is residential, builder and developer work, including premium and architecturally detailed projects. Contact JS Carpentry to confirm suitability for your scope.'
  }
];

function addChatMessage(text, type) {
  const message = document.createElement('div');
  message.className = `message ${type}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function answerQuestion(question) {
  const normalised = question.toLowerCase();
  const match = faqAnswers
    .map(item => ({ ...item, score: item.terms.filter(term => normalised.includes(term)).length }))
    .sort((a, b) => b.score - a.score)[0];

  return match && match.score > 0
    ? match.answer
    : 'I can help with services, rough estimates, service areas, sending plans and contact details. For a project-specific answer, call 0420 170 199 or email the plans to jscarpentrypvtltd@gmail.com.';
}

function submitChatQuestion(question) {
  const clean = question.trim();
  if (!clean) return;
  addChatMessage(clean, 'user');
  window.setTimeout(() => addChatMessage(answerQuestion(clean), 'bot'), 220);
}

chatForm?.addEventListener('submit', event => {
  event.preventDefault();
  submitChatQuestion(chatInput.value);
  chatInput.value = '';
});

document.querySelectorAll('.quick-prompts button').forEach(button => {
  button.addEventListener('click', () => submitChatQuestion(button.dataset.question));
});
