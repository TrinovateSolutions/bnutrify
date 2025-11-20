  const menuBtn = document.querySelector(".menu-btn");
  const closeBtn = document.querySelector(".close-btn");
  const navBar = document.querySelector(".nav-bar");

  menuBtn.addEventListener("click", () => {
    navBar.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    navBar.classList.remove("active");
  });


  /* =========================
   LOAD POPUP HTML
========================= */
fetch("/src/popup1.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("popup-container").innerHTML = data;
  });

  // === Switch between steps ===
function showPayment() {
  const form = document.getElementById("appointmentForm");
  const payment = document.getElementById("paymentSection");

  if (!form || !payment) return;

  form.style.display = "none";
  payment.style.display = "block";
}

function showAppointment() {
  const form = document.getElementById("appointmentForm");
  const payment = document.getElementById("paymentSection");

  if (!form || !payment) return;

  payment.style.display = "none";
  form.style.display = "block";
}

// Reveal home small preview cards with a stagger (call this after DOMContentLoaded)
(function revealHomePreview(){
  const homeCards = document.querySelectorAll('.home-review-card');
  if (!homeCards.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const all = Array.from(homeCards);
          all.forEach((card, idx) => {
            // small stagger while preserving order
            card.style.transitionDelay = (idx * 0.12) + 's';
            card.classList.add('reveal','visible');
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.12 });
    io.observe(homeCards[0]);
  } else {
    homeCards.forEach((c,i) => { c.style.transitionDelay = (i*0.12)+'s'; c.classList.add('reveal','visible'); });
  }
})();
