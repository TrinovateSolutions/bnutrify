/* ============================
   STAGGER REVEAL ANIMATION
============================ */
document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.review-card');

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const card = entry.target;

        // Stagger delay
        card.style.transitionDelay = (index * 0.15) + "s";

        card.classList.add("reveal", "visible");
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => io.observe(card));

  initVideoButtons();
});


/* ============================
   VIDEO TESTIMONIAL HANDLER
============================ */
function initVideoButtons() {
  const cards = document.querySelectorAll(".review-card");

  cards.forEach(card => {
    const videoUrl = card.dataset.video;
    if (!videoUrl) return;

    // create actions container if not present
    let actions = card.querySelector(".review-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "review-actions";
      card.querySelector(".review-content").appendChild(actions);
    }

    // create button
    const btn = document.createElement("button");
    btn.className = "btn-video";
    btn.textContent = "View Video";
    btn.type = "button";

    actions.appendChild(btn);

    btn.addEventListener("click", () => openVideoModal(videoUrl));
  });
}


/* ============================
   VIDEO MODAL CREATION
============================ */
function createVideoModal() {
  let overlay = document.getElementById("videoOverlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = "videoOverlay";
  overlay.className = "video-overlay";
  overlay.style.display = "none";

  overlay.innerHTML = `
    <div class="video-modal">
      <button class="video-close" aria-label="Close video">&times;</button>
      <video controls playsinline></video>
    </div>
  `;

  document.body.appendChild(overlay);

  // close actions
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeVideoModal();
  });

  overlay.querySelector(".video-close").addEventListener("click", closeVideoModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVideoModal();
  });

  return overlay;
}


/* ============================
   OPEN VIDEO MODAL
============================ */
function openVideoModal(src) {
  const overlay = createVideoModal();
  const video = overlay.querySelector("video");

  overlay.style.display = "flex";

  requestAnimationFrame(() => overlay.classList.add("open"));

  video.src = src;
  video.load();
  video.play().catch(() => { /* autoplay blocked—user will tap */ });
}


/* ============================
   CLOSE VIDEO MODAL
============================ */
function closeVideoModal() {
  const overlay = document.getElementById("videoOverlay");
  if (!overlay) return;

  const video = overlay.querySelector("video");
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  overlay.classList.remove("open");

  setTimeout(() => {
    overlay.style.display = "none";
  }, 250);
}


// document.addEventListener('click', (e) => {
//   const img = e.target.closest('.review-media img');
//   if (!img) return;

//   e.preventDefault();

//   const card = img.closest('.review-card');
//   if (!card) return;

//   const videoUrl = card.dataset.video;
//   if (videoUrl) openVideoModal(videoUrl);
// });

document.addEventListener("click", function (e) {
  const media = e.target.closest(".video-thumb");
  if (!media) return; // clicked non-video image

  const card = media.closest(".review-card");
  const videoUrl = card.dataset.video;

  if (videoUrl) {
    openVideoModal(videoUrl);
  }
});
