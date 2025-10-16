// === Popup Controls ===
function openPopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "flex";

  // Always start at the appointment form when popup opens
  document.getElementById("appointmentForm").style.display = "block";
  document.getElementById("paymentSection").style.display = "none";
  // === ✅ Set date input min to tomorrow every time popup opens ===
  const dateInput = document.getElementById("date");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const dd = String(tomorrow.getDate()).padStart(2, "0");
  dateInput.min = `${yyyy}-${mm}-${dd}`;
  dateInput.value = ""; // clear old selection if popup reopened

  // Call function to populate time slots when popup opens
  fillTimeSlots();
}

function closePopup() {
  document.getElementById("popup").style.display = "none";

  // Reset to default view (form)
  document.getElementById("appointmentForm").style.display = "block";
  document.getElementById("paymentSection").style.display = "none";
}

// === Time Slot Generator ===
function fillTimeSlots() {
  const timeSelect = document.getElementById("time");

  if (!timeSelect) {
    console.error("❌ Element with id='time' not found in DOM!");
    return;
  }

  // Avoid adding duplicate options if popup opens multiple times
  if (timeSelect.options.length > 0) {
    console.log("⏱️ Time options already added — skipping.");
    return;
  }

  const start = 9 * 60; // 9 AM in minutes
  const end = 18 * 60; // 6 PM
  const interval = 45; // minutes

  for (let mins = start; mins < end; mins += interval) {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    const timeLabel = new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const option = document.createElement("option");
    option.value = timeLabel;
    option.textContent = timeLabel;
    timeSelect.appendChild(option);
  }

  console.log(`✅ Time options added: ${timeSelect.options.length}`);
}

// === Debug Confirmation ===
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ popup1.js loaded successfully");
});


// === Enable "Proceed to Payment" only when all fields are valid ===
function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  const proceedBtn = document.getElementById("proceedBtn");

  // Basic validation checks
  const isValid =
    name !== "" &&
    email !== "" &&
    phone !== "" &&
    date !== "" &&
    time !== "";

  proceedBtn.disabled = !isValid; // enable/disable button
}

function submitAppointment() {
  const formData = new FormData();

  // Collect form data
  formData.append("name", document.getElementById("name").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("phone", document.getElementById("phone").value);
  formData.append("date", document.getElementById("date").value);
  formData.append("time", document.getElementById("time").value);

  const paymentProof = document.getElementById("paymentProof").files[0];
  if (!paymentProof) {
    alert("⚠️ Please upload your payment screenshot before submitting.");
    return;
  }
  formData.append("paymentProof", paymentProof);

  // Send to PHP via AJAX
  fetch("/src/send_mail.php", {
    method: "POST",
    body: formData
  })
    .then((response) => response.text())
    .then((data) => {
      console.log("✅ Server Response:", data);
      alert(data);
      closePopup();
    })
    .catch((error) => {
      console.error("❌ Error:", error);
      alert("Something went wrong while sending the email.");
    });
}
