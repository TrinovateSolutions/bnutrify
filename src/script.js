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
