// === Popup Controls ===
function openPopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "flex";

  // Always start at the appointment form when popup opens
  document.getElementById("appointmentForm").style.display = "block";
  document.getElementById("paymentSection").style.display = "none";

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
