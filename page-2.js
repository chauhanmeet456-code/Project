/* CHECK LOGIN (PROTECT PAGE) */
const user = localStorage.getItem("user");

if(!user){
  // જો direct page open કરે → પાછું login
  window.location.href = "loging.html";
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