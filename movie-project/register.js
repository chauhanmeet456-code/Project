const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const password = document.getElementById("password").value.trim();
    const gender = document.getElementById("gender").value;

    if (!name || !email || !mobile || !password || !gender) {
      alert("Please fill all fields!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const alreadyExists = users.some(user => user.email === email);

    if (alreadyExists) {
      alert("User already registered! Please login.");
      window.location.href = "login.html";
      return;
    }

    const newUser = {
      name,
      email,
      mobile,
      password,
      gender,
      registeredAt: new Date().toLocaleString()
    };

    users.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    alert("Registration successful! Please login now.");
    window.location.href = "login.html";
  });
}