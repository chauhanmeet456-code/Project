// ================================
// PAGE-2.JS - Login Protection + Logout + Back Button Fix
// ================================

// Prevent cached page showing after logout/back button
window.history.replaceState(null, null, window.location.href);
window.onpageshow = function(event) {
    if (event.persisted) { // page loaded from cache
        window.location.reload(); // trigger login check again
    }
}

/* CHECK LOGIN (PROTECT PAGE) */
const user = localStorage.getItem("user");
if(!user){
  window.location.href = "login.html"; // redirect if not logged in
} else {
  // username show
  const text = document.getElementById("welcomeText");
  if(text){
    text.innerText = "Welcome " + user;
    text.style.color = "white"; // username color white
    text.style.fontWeight = "bold";
    text.style.fontSize = "18px";
  }
}

/* LOGOUT */
function logout(){
  localStorage.removeItem("user");
  // redirect to login and prevent back
  window.location.href = "login.html";
}