function toggleMode(){
  document.body.classList.toggle("dark");
}

function toggleMenu(){
  const menu = document.getElementById("menu");
  const icon = document.getElementById("hamburger");

  menu.classList.toggle("active");

  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-times");
}