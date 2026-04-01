const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const loginType = document.getElementById("loginType").value;

    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    // ===== ADMIN LOGIN =====
    if (loginType === "admin") {
      if (email === adminEmail && password === adminPassword) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("currentUser", JSON.stringify({
          name: "Admin",
          email: adminEmail,
          role: "admin"
        }));

        alert("Admin login successful!");
        window.location.href = "admin.html";
      } else {
        alert("Invalid Admin Email or Password!");
      }
      return;
    }

    // ===== USER LOGIN =====
    let users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const matchedUser = users.find(
      user => user.email === email && user.password === password
    );

    if (!matchedUser) {
      alert("Invalid user email or password!");
      return;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", "false");
    localStorage.setItem("currentUser", JSON.stringify(matchedUser));

    let loginHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];
    loginHistory.push({
      name: matchedUser.name,
      email: matchedUser.email,
      loginAt: new Date().toLocaleString()
    });

    localStorage.setItem("loginHistory", JSON.stringify(loginHistory));

    alert("User login successful!");
    window.location.href = "index.html";
  });
}