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

// Generic reveal for all .reveal elements (services, about me, etc.)
(function revealSections(){
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('visible'));
  }
})();


// feedback.js — client-side validation + AJAX submit
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const statusEl = document.getElementById('fb-status');
  const submitBtn = document.getElementById('fb-submit');

  // Stars UI: make rating clickable and reflect value
  const starInputs = Array.from(document.querySelectorAll('.stars input'));
  const starLabels = Array.from(document.querySelectorAll('.stars label'));

  // helper to set highlighted stars by value
  function highlightStars(val) {
    starLabels.forEach((lab, idx) => {
      const inputVal = parseInt(starInputs[idx].value, 10);
      if (inputVal <= val) lab.style.color = '#f0c419'; else lab.style.color = '#d7d7d7';
    });
  }

  // initialize behaviour
  starInputs.forEach((input, idx) => {
    input.addEventListener('change', () => {
      const v = parseInt(input.value, 10);
      highlightStars(v);
    });
    // clicking label also triggers focus/change via input
    starLabels[idx].addEventListener('click', () => {
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  // form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';

    // basic validation
    const name = document.getElementById('fb-name').value.trim();
    const email = document.getElementById('fb-email').value.trim();
    const message = document.getElementById('fb-message').value.trim();
    const ratingInput = document.querySelector('.stars input:checked');
    const rating = ratingInput ? ratingInput.value : '';

    if (!name || !email || !message || !rating) {
      statusEl.textContent = 'Please fill all fields and give a rating.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const payload = new FormData();
      payload.append('name', name);
      payload.append('email', email);
      payload.append('rating', rating);
      payload.append('message', message);

      const resp = await fetch('src/feedback_mail.php', {
        method: 'POST',
        body: payload
      });

      const data = await resp.json().catch(() => ({ status: 'error', message: 'Invalid server response' }));
      if (data.status === 'success') {
        statusEl.textContent = 'Thanks! Your feedback was submitted.';
        // optionally show a small animation and clear form
        form.reset();
        highlightStars(0);
        // short delay then optionally scroll to top or show something
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Feedback';
        }, 900);
      } else {
        statusEl.textContent = data.message || 'Submission failed. Please try again later.';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Feedback';
      }
    } catch (err) {
      console.error('Feedback submit error', err);
      statusEl.textContent = 'Network error. Please try again later.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Feedback';
    }
  });
});
