/* =========================
   PASSWORD EYE TOGGLE
========================= */
const passwordInput = document.getElementById("password");
const eyeIcon = document.getElementById("togglePassword");

eyeIcon.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.textContent = "🙈";
  } else {
    passwordInput.type = "password";
    eyeIcon.textContent = "👁";
  }
});


/* =========================
   DARK / LIGHT MODE
========================= */
const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeBtn.textContent = "☀️";
  } else {
    themeBtn.textContent = "🌙";
  }
});