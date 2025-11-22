/* blog.js — simple helpers for blog pages
   - Reveal hero and callouts
   - Smooth scroll to article sections if needed
   - Respect prefers-reduced-motion
*/
(function(){
  "use strict";
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, ctx=document) => ctx.querySelector(s);
  const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

  function revealTargets() {
    const targets = $$('.reveal');
    if (!targets.length) return;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach(t => t.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add('visible');
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(t => io.observe(t));
  }

  document.addEventListener('DOMContentLoaded', () => {
    revealTargets();

    // simple share handler for future (delegated)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-share]');
      if (!btn) return;
      const url = btn.datasetShare || window.location.href;
      // navigator.share if available
      if (navigator.share) {
        navigator.share({ title: document.title, text: document.querySelector('meta[name="description"]')?.content || '', url })
          .catch(()=>{});
      } else {
        // fallback: copy to clipboard
        navigator.clipboard?.writeText(url).then(()=> {
          btn.textContent = 'Link copied';
          setTimeout(()=> btn.textContent = 'Share', 1400);
        }).catch(()=>{});
      }
    });
  });
})();
