requestAnimationFrame(() => document.body.classList.add('is-ready'));

const revealSections = [...document.querySelectorAll('[data-reveal]')];
const reducedPageMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const serviceLinks = document.querySelector('.hero-service-links');
const currentService = serviceLinks?.querySelector('[aria-current="page"]');

if (serviceLinks && currentService) {
  requestAnimationFrame(() => {
    const centeredPosition = currentService.offsetLeft - ((serviceLinks.clientWidth - currentService.offsetWidth) / 2);
    serviceLinks.scrollLeft = Math.max(0, centeredPosition);
  });
}

if (reducedPageMotion || !('IntersectionObserver' in window)) {
  revealSections.forEach((section) => section.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  revealSections.forEach((section) => revealObserver.observe(section));
}

const photoCarousel = document.querySelector('.photo-carousel');

if (photoCarousel) {
  const photoSlides = [...photoCarousel.querySelectorAll('.photo-slide')];
  const photoDots = [...photoCarousel.querySelectorAll('.photo-dots button')];
  const photoPrevious = photoCarousel.querySelector('.photo-prev');
  const photoNext = photoCarousel.querySelector('.photo-next');
  const photoCurrent = photoCarousel.querySelector('.photo-current');
  let currentPhoto = 0;

  const showPhoto = (index) => {
    currentPhoto = (index + photoSlides.length) % photoSlides.length;
    photoCurrent.textContent = String(currentPhoto + 1).padStart(2, '0');

    photoSlides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentPhoto;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    photoDots.forEach((dot, dotIndex) => {
      const active = dotIndex === currentPhoto;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  if (photoSlides.length && photoDots.length === photoSlides.length && photoPrevious && photoNext && photoCurrent) {
    photoPrevious.addEventListener('click', () => showPhoto(currentPhoto - 1));
    photoNext.addEventListener('click', () => showPhoto(currentPhoto + 1));
    photoDots.forEach((dot, index) => dot.addEventListener('click', () => showPhoto(index)));
    showPhoto(0);
  }
}
