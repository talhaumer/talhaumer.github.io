(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  const revealAll = () => {
    observer?.disconnect();
    document.querySelectorAll('.reveal-pending').forEach(node => node.classList.remove('reveal-pending'));
  };
  if (preference.matches || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending');
      entry.target.classList.add('reveal-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.section-heading, .timeline article, .project, .toolkit > div, .about > div, .contact').forEach(node => {
    // Keep initial viewport and deep-linked content visible immediately.
    if (node.getBoundingClientRect().top < innerHeight || node.contains(document.querySelector(':target'))) return;
    node.classList.add('reveal-item', 'reveal-pending');
    observer.observe(node);
  });
  document.addEventListener('focusin', event => {
    event.target.closest('.reveal-pending')?.classList.remove('reveal-pending');
  });
  window.addEventListener('hashchange', revealAll);
  window.addEventListener('beforeprint', revealAll);
  preference.addEventListener('change', revealAll);
})();
