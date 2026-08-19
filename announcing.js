const track = document.querySelector('.events-track');
const previous = document.querySelector('.events-prev');
const next = document.querySelector('.events-next');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function moveEvents(direction) {
  const card = track?.querySelector('article');
  if (!track || !card) return;
  track.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: reducedMotion ? 'auto' : 'smooth' });
}

previous?.addEventListener('click', () => moveEvents(-1));
next?.addEventListener('click', () => moveEvents(1));
track?.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  moveEvents(event.key === 'ArrowLeft' ? -1 : 1);
});
