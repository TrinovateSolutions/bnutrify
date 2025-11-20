// aboutme.js — page-specific scripts (reveal + small timeline toggle)
// Safe, self-contained; respects prefers-reduced-motion.

(function () {
  "use strict";

  // short helper to select
  const $ = (sel, ctx = document) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

  // Respect reduced motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal about-reveal elements with IntersectionObserver (stagger per section)
  function initAboutReveal() {
    const blocks = $$(".about-reveal");
    if (!blocks.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      blocks.forEach(b => b.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const section = entry.target;
        // reveal children with small stagger
        const children = Array.from(section.querySelectorAll(".about-reveal-child"));
        if (children.length) {
          children.forEach((c, i) => {
            c.style.transitionDelay = `${i * 0.12}s`;
            c.classList.add("visible");
          });
        }
        // reveal the section itself if no children flagged
        section.classList.add("visible");
        obs.unobserve(section);
      });
    }, { threshold: 0.12 });

    blocks.forEach(b => observer.observe(b));
  }

  // Enhance grid items inside services to mark children for stagger
  (function markChildren() {
    const serviceSections = $$(".about-services, .about-focus-grid, .journey-steps, .services-grid");
    serviceSections.forEach(sec => {
      sec.classList.add("about-reveal");
      Array.from(sec.children).forEach((ch) => ch.classList.add("about-reveal-child"));
    });
  })();

  // Small interactivity: allow keyboard Enter on .btn-primary to open popup reliably
  (function bindCTA() {
    const ctas = $$(".btn-primary");
    ctas.forEach(btn => {
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });
    });
  })();

  // Initialize on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    initAboutReveal();

    // a tiny accessibility tweak: ensure images have alt; if missing fill with title fallback
    const imgs = $$("img");
    imgs.forEach(img => {
      if (!img.getAttribute("alt")) {
        const fallback = img.getAttribute("title") || "BNutrify image";
        img.setAttribute("alt", fallback);
      }
    });
  });

})();
