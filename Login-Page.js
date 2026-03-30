document.addEventListener("DOMContentLoaded", function(){
  
  //   PASSWORD TOGGLE
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("togglePassword");

  if(eyeIcon && passwordInput){
    eyeIcon.addEventListener("click", () => {
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";

      eyeIcon.textContent =
        passwordInput.type === "password" ? "👁" : "🙈";
    });
  }


 
  //  DARK / LIGHT MODE

  const themeBtn = document.getElementById("themeToggle");

  if(themeBtn){
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");

      themeBtn.textContent =
        document.body.classList.contains("light") ? "☀️" : "🌙";
    });
  }



    //  MULTIPLE USERS LOGIN

  const users = [
    { username: "Admin", password: "123" },
    { username: "Ajay", password: "111" },
    { username: "Brijesh", password: "002" },
    { username: "Meet", password: "456"},
    { username: "Sumit", password: "123"},
    { username: "Takshik", password: "123"},
    { username: "Hiten", password: "123"},
    { username: "Yogiraj", password: "123"},
    { username: "Yash", password: "123"},
    { username: "Nirav", password: "123"},    
  ];

  const loginForm = document.getElementById("loginForm");

  if(loginForm){
    loginForm.addEventListener("submit", function(e){
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // check user
      const validUser = users.find(user =>
        user.username === username && user.password === password
      );

      if(validUser){

        // SAVE LOGIN
        localStorage.setItem("user", username);

        // REDIRECT
        window.location.href = "page-2.html";

      } else {
        alert("Wrong Username or Password ❌");
      }
    });
  }

});