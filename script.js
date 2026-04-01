
function toggleMode(){
  document.body.classList.toggle("dark");

  const themeBtn = document.getElementById("themeBtn");

  if(document.body.classList.contains("dark")){
    themeBtn.innerHTML = "☀️";
  } else {
    themeBtn.innerHTML = "🌙";
  }
}

function toggleMenu(){
  const menu = document.getElementById("menu");
  const icon = document.getElementById("hamburger");

  menu.classList.toggle("active");

  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-times");
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("active");
}

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

window.onload = function () {
  const savedTheme = localStorage.getItem("theme");
  const themeBtn = document.getElementById("themeBtn");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀";
  } else {
    themeBtn.textContent = "🌙";
  }
};