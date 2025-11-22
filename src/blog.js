/* blog.js — assign alternating directions and reveal image+content simultaneously on scroll
   - even index (0,2,4...) -> image from left, content from right
   - odd index (1,3,5...)  -> image from right, content from left
   - triggers .visible on item when in view; respects prefers-reduced-motion
*/
(function () {
  "use strict";

  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupAlternatingClasses() {
    const items = $$(".blog-list-item");
    items.forEach((item, idx) => {
      // ensure both directional classes are present for clarity
      if (idx % 2 === 0) {
        // even: image left, content right
        item.classList.add("img-from-left", "content-from-right");
      } else {
        // odd: image right, content left
        item.classList.add("img-from-right", "content-from-left");
      }
      // ensure child elements exist
      const media = item.querySelector(".hero-media");
      const content = item.querySelector(".hero-content");
      if (media) media.setAttribute("aria-hidden", "true");
      if (content) content.setAttribute("tabindex", "-1");
    });
  }

  function initRevealObserver() {
    const items = $$(".blog-list-item");
    if (!items.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      // reveal all immediately
      items.forEach(it => it.classList.add("visible"));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const item = entry.target;
        // Add 'visible' so both image and content animate simultaneously
        item.classList.add("visible");
        obs.unobserve(item);
      });
    }, { threshold: 0.12 });

    items.forEach(it => io.observe(it));
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupAlternatingClasses();
    initRevealObserver();
  });
})();
