const track = document.querySelector('.events-track');
const previous = document.querySelector('.events-prev');
const next = document.querySelector('.events-next');

function moveEvents(direction) {
  const card = track?.querySelector('article');
  if (!track || !card) return;
  track.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: 'smooth' });
}

previous?.addEventListener('click', () => moveEvents(-1));
next?.addEventListener('click', () => moveEvents(1));
