/* ===== BuckAI Observatory — main.js ===== */

/* ---- Active nav link ---- */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ---- Mobile hamburger ---- */
const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---- Image error → initials fallback ---- */
function initPhotoFallbacks() {
  document.querySelectorAll('img[data-initials]').forEach(img => {
    function applyFallback() {
      const initials = img.dataset.initials || '?';
      const size = img.width || parseInt(img.style.width) || 60;
      const placeholder = document.createElement('div');
      placeholder.className = 'photo-init';
      placeholder.style.width  = size + 'px';
      placeholder.style.height = size + 'px';
      placeholder.style.fontSize = Math.round(size * 0.35) + 'px';
      placeholder.textContent = initials;
      img.parentNode.replaceChild(placeholder, img);
    }
    if (img.complete && img.naturalWidth === 0) {
      applyFallback();
    } else {
      img.addEventListener('error', applyFallback, { once: true });
    }
  });
}
document.addEventListener('DOMContentLoaded', initPhotoFallbacks);

/* ---- News loader ---- */
async function loadNews(containerId, limit, renderFn) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const resp  = await fetch('data/news.json');
    const items = await resp.json();
    const show  = limit ? items.slice(0, limit) : items;
    container.innerHTML = show.map(renderFn).join('');
    initPhotoFallbacks();
  } catch (e) {
    container.innerHTML = '<p style="color:var(--muted);padding:1rem 0">News could not be loaded.</p>';
  }
}

function catClass(c) {
  return c === 'Paper' ? 'cat-paper' : c === 'Funding' ? 'cat-funding' : '';
}

/* Cards (index.html) */
function renderNewsCard(item) {
  const link = item.url
    ? `<a class="news-link" href="${item.url}" target="_blank" rel="noopener">Read more →</a>` : '';
  return `<div class="news-card">
    <div class="news-meta">
      <span class="news-date">${item.date}</span>
      <span class="news-category ${catClass(item.category)}">${item.category}</span>
    </div>
    <div class="news-headline">${item.headline}</div>
    <div class="news-body">${item.body}</div>
    ${link}
  </div>`;
}

/* Rows (news.html) */
function renderNewsRow(item) {
  const link = item.url
    ? ` <a href="${item.url}" target="_blank" rel="noopener" style="color:var(--teal)">→</a>` : '';
  return `<div class="news-row">
    <div class="news-row-date">${item.date}</div>
    <div>
      <div class="news-row-headline">${item.headline}${link}</div>
      <div class="news-row-body">${item.body}</div>
      <span class="news-category ${catClass(item.category)}" style="margin-top:0.45rem;display:inline-block">${item.category}</span>
    </div>
  </div>`;
}
