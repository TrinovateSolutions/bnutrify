function openPopup() {
  document.getElementById("popup").style.display = "block";
}
function closePopup() {
  document.getElementById("popup").style.display = "none";
}
// Close popup if clicked outside the box
window.onclick = function(event) {
  let popup = document.getElementById("popup");
  if (event.target === popup) {
    popup.style.display = "none";
  }
}

document.getElementById("appointmentForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch("/sendMail.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.text())
  .then(data => {
    if (data === "success") {
      alert("✅ Appointment request sent to Gmail!");
    } else {
      alert("❌ Failed to send request.");
    }
  });
});