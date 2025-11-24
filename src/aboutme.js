/* aboutme.js — page-specific JS
   - Reveal sections with IntersectionObserver (staggered by section)
   - Respect prefers-reduced-motion
   - Basic accessibility improvements
*/

(function () {
  "use strict";

  const $ = (s, ctx = document) => (ctx || document).querySelector(s);
  const $$ = (s, ctx = document) => Array.from((ctx || document).querySelectorAll(s));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealSections() {
    const sections = $$(".reveal");
    if (!sections.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      sections.forEach(s => s.classList.add("visible"));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // add visible
        el.classList.add("visible");
        obs.unobserve(el);
      });
    }, { threshold: 0.12 });

    sections.forEach(s => io.observe(s));
  }

  // small accessibility: ensure images have alt text
  function ensureAlts() {
    $$("img").forEach(img => {
      if (!img.getAttribute("alt")) {
        img.setAttribute("alt", "BNutrify image");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureAlts();
    revealSections();

    // keyboard accessibility for CTA buttons
    $$(".btn-primary, .btn-ghost").forEach(btn => {
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });
    });
  });

})();




/* aboutme-certificates.js
   - Handles the horizontal slider "View certificate" modal
   - Shows image or embeds PDF in modal
   - Uses data-src (encoded path) from each card
*/

(function(){
  "use strict";
  const $ = (s, ctx=document) => ctx.querySelector(s);
  const $$ = (s, ctx=document) => Array.from((ctx || document).querySelectorAll(s));

  function safeEncode(path) {
    // If path already encoded, leave it; otherwise encode spaces and parentheses
    return encodeURI(path);
  }

  function openModal(type, src) {
    const modal = $("#certModal");
    const content = $("#certModalContent");
    if (!modal || !content) return;

    // Clear
    content.innerHTML = "";

    // Decide renderer
    if (type === "pdf") {
      // Use an <iframe> to embed the PDF (browser will show the PDF viewer)
      const iframe = document.createElement("iframe");
      iframe.src = safeEncode(src);
      iframe.setAttribute("title","Certificate PDF");
      iframe.setAttribute("aria-label","Certificate PDF");
      content.appendChild(iframe);
    } else {
      // image
      const img = document.createElement("img");
      img.src = safeEncode(src);
      img.alt = "Certificate image";
      content.appendChild(img);
    }

    // show modal
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    // focus close button
    const close = modal.querySelector(".cert-modal-close");
    if (close) close.focus();
  }

  function closeModal() {
    const modal = $("#certModal");
    const content = $("#certModalContent");
    if (!modal || !content) return;
    // remove iframe/src to free memory for PDFs
    const iframe = content.querySelector("iframe");
    if (iframe) {
      try { iframe.src = ""; } catch(e) {}
    }
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    // hide after transition (optional)
    const hideAfter = 280;
    setTimeout(()=> {
      // cleanup content
      content.innerHTML = "";
    }, hideAfter);
  }

  function bindCards() {
    const cards = $$(".cert-card");
    cards.forEach(card => {
      const btn = card.querySelector(".btn-view");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const src = card.getAttribute("data-src");
        const type = (card.getAttribute("data-type") || "image").toLowerCase();
        if (!src) return;
        openModal(type, src);
      });
    });
  }

  function initModalControls() {
    const modal = document.getElementById("certModal");
    if (!modal) return;
    // close by backdrop
    modal.querySelector("[data-close]")?.addEventListener("click", closeModal);
    // close by close btn
    modal.querySelector(".cert-modal-close")?.addEventListener("click", closeModal);
    // esc key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  // optional: allow swipe to scroll on mobile (native handles it well)
  document.addEventListener("DOMContentLoaded", () => {
    bindCards();
    initModalControls();

    // accessibility: make cards keyboard navigable
    $$(".cert-card").forEach(card => {
      card.setAttribute("tabindex","0");
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const btn = card.querySelector(".btn-view");
          if (btn) btn.click();
        }
      });
    });
  });

})();
