/* ================================
   PAGE-2.JS - Login Protection + Logout
   ================================ */

// Prevent cached page showing after logout/back button
window.history.replaceState(null, null, window.location.href);
window.onpageshow = function(event) {
    if (event.persisted) { // page loaded from cache
        window.location.reload(); // trigger login check again
    }
};

/* CHECK LOGIN (PROTECT PAGE) */
const user = localStorage.getItem("user");

// Correct login page path (typo fix)
if(!user){
  window.location.href = "login.html"; // previously "loging.html"
} else {
  // username show
  const text = document.getElementById("welcomeText");
  if(text){
    text.innerText = "Welcome " + user;
  }
}

/* LOGOUT */
function logout(){
  localStorage.removeItem("user");
  window.location.href = "login.html";
}