document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('.review-card');

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const card = entry.target;

        // Add stagger delay
        card.style.transitionDelay = (index * 0.15) + "s";

        card.classList.add("reveal", "visible");
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => io.observe(card));
});
