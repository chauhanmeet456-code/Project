function toggleMode() {
  document.body.classList.toggle("dark");

  const themeBtn = document.getElementById("themeBtn");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    themeBtn.textContent = "☀";
  } else {
    localStorage.setItem("theme", "light");
    themeBtn.textContent = "🌙";
  }
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  const icon = document.getElementById("hamburger");

  menu.classList.toggle("active");

  if (menu.classList.contains("active")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  } else {
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
}

window.onload = function () {
  const savedTheme = localStorage.getItem("theme");
  const themeBtn = document.getElementById("themeBtn");
  const menuLinks = document.querySelectorAll("#menu a");
  const menu = document.getElementById("menu");
  const icon = document.getElementById("hamburger");

  // Theme load
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀";
  } else {
    themeBtn.textContent = "🌙";
  }

  // Auto close menu after clicking link
  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    });
  });
};