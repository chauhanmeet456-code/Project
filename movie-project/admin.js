// ===== ADMIN ACCESS CHECK =====
document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const isAdmin = localStorage.getItem("isAdmin");

  if (isLoggedIn !== "true" || isAdmin !== "true") {
    alert("Access Denied! Admin login required.");
    window.location.href = "login.html";
    return;
  }

  loadAdminData();
  setupButtons();
});

// ===== DISPLAY DATA FUNCTION =====
function displayData(containerId, data, type) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  if (!data.length) {
    container.innerHTML = `<p class="empty-msg">No data available.</p>`;
    return;
  }

  data.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "admin-card";

    if (type === "register") {
      card.innerHTML = `
        <p><strong>Name:</strong> ${item.name}</p>
        <p><strong>Email:</strong> ${item.email}</p>
        <p><strong>Mobile:</strong> ${item.mobile}</p>
        <p><strong>Gender:</strong> ${item.gender}</p>
        <p><strong>Registered At:</strong> ${item.registeredAt}</p>
        <button class="delete-btn" onclick="deleteUser(${index})">Delete User</button>
      `;
    }

    if (type === "login") {
      card.innerHTML = `
        <p><strong>Name:</strong> ${item.name}</p>
        <p><strong>Email:</strong> ${item.email}</p>
        <p><strong>Login At:</strong> ${item.loginAt}</p>
      `;
    }

    if (type === "watch") {
      card.innerHTML = `
        <p><strong>Name:</strong> ${item.name}</p>
        <p><strong>Email:</strong> ${item.email}</p>
        <p><strong>Movie:</strong> ${item.movie}</p>
        <p><strong>Watched At:</strong> ${item.watchedAt}</p>
      `;
    }

    container.appendChild(card);
  });
}

// ===== LOAD ALL DATA =====
function loadAdminData() {
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  const loginHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];
  const watchHistory = JSON.parse(localStorage.getItem("watchHistory")) || [];

  displayData("registered-users", registeredUsers, "register");
  displayData("login-history", loginHistory, "login");
  displayData("watch-history", watchHistory, "watch");

  document.getElementById("total-users").textContent = registeredUsers.length;
  document.getElementById("total-logins").textContent = loginHistory.length;
  document.getElementById("total-watches").textContent = watchHistory.length;
}

// ===== DELETE USER =====
function deleteUser(index) {
  let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

  const confirmDelete = confirm("Are you sure you want to delete this user?");
  if (!confirmDelete) return;

  registeredUsers.splice(index, 1);
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  alert("User deleted successfully!");
  loadAdminData();
}

// ===== BUTTON EVENTS =====
function setupButtons() {
  const logoutBtn = document.getElementById("logoutBtn");
  const clearLoginHistory = document.getElementById("clearLoginHistory");
  const clearWatchHistory = document.getElementById("clearWatchHistory");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("currentUser");

      alert("Admin logged out successfully!");
      window.location.href = "login.html";
    });
  }

  if (clearLoginHistory) {
    clearLoginHistory.addEventListener("click", () => {
      const confirmClear = confirm("Clear all login history?");
      if (!confirmClear) return;

      localStorage.removeItem("loginHistory");
      loadAdminData();
    });
  }

  if (clearWatchHistory) {
    clearWatchHistory.addEventListener("click", () => {
      const confirmClear = confirm("Clear all watch history?");
      if (!confirmClear) return;

      localStorage.removeItem("watchHistory");
      loadAdminData();
    });
  }
}