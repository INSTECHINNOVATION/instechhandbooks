const pages = [...document.querySelectorAll('.page')];
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageCounter = document.getElementById('pageCounter');
const progressBar = document.getElementById('progressBar');
const pageTitle = document.getElementById('pageTitle');
const overlay = document.getElementById('contentsOverlay');
const contentsList = document.getElementById('contentsList');
let current = 0;
function showPage(index) {
  current = Math.max(0, Math.min(pages.length - 1, index));
  pages.forEach((page, i) => {
    page.classList.toggle('active', i === current);
    page.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
  });
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === pages.length - 1;
  pageCounter.textContent = `${String(current + 1).padStart(2,'0')} / ${String(pages.length).padStart(2,'0')}`;
  progressBar.style.width = `${((current + 1) / pages.length) * 100}%`;
  pageTitle.textContent = pages[current].dataset.title || 'Section';
  document.getElementById('book').scrollIntoView({behavior:'smooth',block:'nearest'});
}
prevBtn.addEventListener('click', () => showPage(current - 1));
nextBtn.addEventListener('click', () => showPage(current + 1));
document.querySelectorAll('.next-trigger').forEach(btn => btn.addEventListener('click', () => showPage(1)));
document.getElementById('contentsBtn').addEventListener('click', () => {
  overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false');
});
document.getElementById('closeContents').addEventListener('click', closeContents);
overlay.addEventListener('click', e => { if (e.target === overlay) closeContents(); });
function closeContents(){ overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true'); }
pages.forEach((page, i) => {
  const button = document.createElement('button');
  button.className = 'content-link';
  button.innerHTML = `<span>${String(i+1).padStart(2,'0')}</span>${page.dataset.title || 'Section'}`;
  button.addEventListener('click', () => { showPage(i); closeContents(); });
  contentsList.appendChild(button);
});
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') showPage(current + 1);
  if (e.key === 'ArrowLeft') showPage(current - 1);
  if (e.key === 'Escape') closeContents();
});
let touchStart = 0;
document.getElementById('book').addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; }, {passive:true});
document.getElementById('book').addEventListener('touchend', e => {
  const delta = e.changedTouches[0].clientX - touchStart;
  if (Math.abs(delta) > 65) showPage(current + (delta < 0 ? 1 : -1));
}, {passive:true});
showPage(0);
