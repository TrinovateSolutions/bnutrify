  const menuBtn = document.querySelector(".menu-btn");
  const closeBtn = document.querySelector(".close-btn");
  const navBar = document.querySelector(".nav-bar");

  menuBtn.addEventListener("click", () => {
    navBar.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    navBar.classList.remove("active");
  });