const carousel = document.querySelector('.quote-section');

requestAnimationFrame(() => document.body.classList.add('is-ready'));

const revealSections = [...document.querySelectorAll('[data-reveal]')];
const reducedPageMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const serviceHeadlineWord = document.querySelector('.service-headline-word');
const serviceRows = [...document.querySelectorAll('.service[data-feature-target]')];

if (serviceHeadlineWord && serviceRows.length) {
  const defaultServiceHeadline = serviceHeadlineWord.textContent;
  const servicesSection = document.querySelector('.services');
  const serviceFeatures = serviceRows.map((row) => ({
    row,
    feature: document.getElementById(row.dataset.featureTarget),
    toggle: row.querySelector('.service-toggle')
  }));
  let serviceHeadlineTimer;
  let hoveredService = null;
  let focusedService = null;
  let pinnedService = null;
  let activeService = null;
  let serviceScrollFrame;
  let serviceAlignTimer;
  let serviceIsAligning = false;

  const updateServiceHeadline = (nextText) => {
    if (serviceHeadlineWord.textContent === nextText) return;
    window.clearTimeout(serviceHeadlineTimer);
    serviceHeadlineWord.classList.add('is-changing');
    serviceHeadlineTimer = window.setTimeout(() => {
      serviceHeadlineWord.textContent = nextText;
      serviceHeadlineWord.classList.remove('is-changing');
    }, reducedPageMotion ? 0 : 100);
  };

  const setOpenService = (row) => {
    serviceFeatures.forEach((entry) => {
      const open = entry.row === row;
      const wasOpen = entry.feature.classList.contains('is-open');
      entry.feature.classList.toggle('is-open', open);
      entry.feature.setAttribute('aria-hidden', String(!open));
      entry.feature.inert = !open;
      entry.toggle.setAttribute('aria-expanded', String(open));
      if (open !== wasOpen) entry.feature.dispatchEvent(new CustomEvent(open ? 'servicefeatureopen' : 'servicefeatureclose'));
    });
  };

  const alignServiceStage = (row) => {
    window.clearTimeout(serviceAlignTimer);
    serviceIsAligning = true;
    serviceAlignTimer = window.setTimeout(() => {
      if (activeService !== row) {
        serviceIsAligning = false;
        return;
      }
      const headingBottom = servicesSection.querySelector('.section-heading').getBoundingClientRect().bottom;
      const rowTop = row.getBoundingClientRect().top;
      const offset = rowTop - headingBottom;
      if (Math.abs(offset) > 12) window.scrollBy({ top: offset, behavior: reducedPageMotion ? 'auto' : 'smooth' });
      window.setTimeout(() => {
        serviceIsAligning = false;
        requestServiceSync();
      }, reducedPageMotion ? 0 : 340);
    }, reducedPageMotion ? 0 : 460);
  };

  const activateService = (row, options = {}) => {
    const changed = activeService !== row;
    activeService = row;
    serviceRows.forEach((serviceRow) => serviceRow.classList.toggle('is-active', serviceRow === row));
    updateServiceHeadline(row.dataset.hoverHeadline || row.querySelector('h3').textContent);
    setOpenService(row);
    if (changed && options.align) alignServiceStage(row);
  };

  const resetServices = () => {
    activeService = null;
    serviceRows.forEach((row) => row.classList.remove('is-active'));
    updateServiceHeadline(defaultServiceHeadline);
    setOpenService(null);
  };

  const syncServiceToScroll = () => {
    serviceScrollFrame = undefined;
    if (hoveredService || focusedService || pinnedService || serviceIsAligning) return;

    const sectionRect = servicesSection.getBoundingClientRect();
    const headingRect = servicesSection.querySelector('.section-heading').getBoundingClientRect();
    const readingLine = headingRect.bottom + Math.min(150, Math.max(70, (window.innerHeight - headingRect.bottom) * .3));
    const firstRowRect = serviceRows[0].getBoundingClientRect();

    if (sectionRect.top > window.innerHeight * .35 || firstRowRect.top > readingLine || sectionRect.bottom <= headingRect.bottom + 40) {
      resetServices();
      return;
    }

    const nearestRow = serviceRows.reduce((nearest, row) => {
      const rect = row.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - readingLine);
      return !nearest || distance < nearest.distance ? { row, distance } : nearest;
    }, null);

    if (nearestRow) activateService(nearestRow.row, { align: true });
  };

  const requestServiceSync = () => {
    if (serviceScrollFrame) return;
    serviceScrollFrame = window.requestAnimationFrame(syncServiceToScroll);
  };

  serviceFeatures.forEach(({ row, feature, toggle }) => {
    row.addEventListener('mouseenter', () => {
      hoveredService = row;
      activateService(row, { align: true });
    });
    row.addEventListener('mouseleave', (event) => {
      if (feature.contains(event.relatedTarget)) return;
      hoveredService = null;
      requestServiceSync();
    });
    row.addEventListener('focusin', () => {
      focusedService = row;
      activateService(row, { align: true });
    });
    row.addEventListener('focusout', (event) => {
      if (!row.contains(event.relatedTarget) && !feature.contains(event.relatedTarget)) {
        focusedService = null;
        requestServiceSync();
      }
    });
    feature.addEventListener('mouseenter', () => {
      hoveredService = row;
      activateService(row);
    });
    feature.addEventListener('mouseleave', (event) => {
      if (row.contains(event.relatedTarget)) return;
      hoveredService = null;
      requestServiceSync();
    });
    feature.addEventListener('focusin', () => {
      focusedService = row;
      activateService(row);
    });
    feature.addEventListener('focusout', (event) => {
      if (feature.contains(event.relatedTarget) || row.contains(event.relatedTarget)) return;
      focusedService = null;
      requestServiceSync();
    });
    toggle.addEventListener('click', () => {
      pinnedService = pinnedService === row ? null : row;
      if (pinnedService) activateService(row, { align: true });
      else requestServiceSync();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !pinnedService) return;
    const pinnedEntry = serviceFeatures.find((entry) => entry.row === pinnedService);
    pinnedService = null;
    resetServices();
    pinnedEntry.toggle.focus();
  });

  window.addEventListener('scroll', requestServiceSync, { passive: true });
  window.addEventListener('resize', requestServiceSync);
  requestServiceSync();
}

if (carousel) {
  const slides = [...carousel.querySelectorAll('.testimonial-slide')];
  const dots = [...carousel.querySelectorAll('.testimonial-dots button')];
  const previous = carousel.querySelector('.testimonial-prev');
  const next = carousel.querySelector('.testimonial-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer;

  const show = (index) => {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === current;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    if (!reducedMotion) timer = window.setInterval(() => show(current + 1), 6500);
  };

  previous.addEventListener('click', () => { show(current - 1); start(); });
  next.addEventListener('click', () => { show(current + 1); start(); });
  dots.forEach((dot, index) => dot.addEventListener('click', () => { show(index); start(); }));
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);

  start();
}

const photoCarousel = document.querySelector('.photo-carousel');

if (photoCarousel) {
  const photographyFeature = photoCarousel.closest('.service-feature');
  const photoSlides = [...photoCarousel.querySelectorAll('.photo-slide')];
  const photoDots = [...photoCarousel.querySelectorAll('.photo-dots button')];
  const photoPrevious = photoCarousel.querySelector('.photo-prev');
  const photoNext = photoCarousel.querySelector('.photo-next');
  const photoCurrent = photoCarousel.querySelector('.photo-current');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentPhoto = 0;
  let photoTimer;

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

  const stopPhotos = () => window.clearInterval(photoTimer);
  const startPhotos = () => {
    stopPhotos();
    if (!reducedMotion) photoTimer = window.setInterval(() => showPhoto(currentPhoto + 1), 7000);
  };

  photoPrevious.addEventListener('click', () => { showPhoto(currentPhoto - 1); startPhotos(); });
  photoNext.addEventListener('click', () => { showPhoto(currentPhoto + 1); startPhotos(); });
  photoDots.forEach((dot, index) => dot.addEventListener('click', () => { showPhoto(index); startPhotos(); }));
  photoCarousel.addEventListener('mouseenter', stopPhotos);
  photoCarousel.addEventListener('mouseleave', startPhotos);
  photoCarousel.addEventListener('focusin', stopPhotos);
  photoCarousel.addEventListener('focusout', startPhotos);

  if (photographyFeature) {
    photographyFeature.addEventListener('servicefeatureopen', () => { showPhoto(0); startPhotos(); });
    photographyFeature.addEventListener('servicefeatureclose', stopPhotos);
    if (photographyFeature.classList.contains('is-open')) startPhotos();
  } else {
    startPhotos();
  }
}
