//  Login Protection + Logout + Back Button Fix


// Prevent cached page showing after logout/back button
window.history.replaceState(null, null, window.location.href);
window.onpageshow = function(event) {
    if(event.persisted || window.performance.navigation.type === 2){
        // Reload page if loaded from cache or back button
        window.location.reload();
    }
}

// CHECK LOGIN (PROTECT PAGE)

const user = localStorage.getItem("user");

if(!user){
    // User not logged in → redirect to login page
    window.location.href = "login.html";
} else {
    // Display username
    const text = document.getElementById("welcomeText");
    if(text){
        text.innerText = "Welcome " + user;
        text.style.color = "#000";      // Black color visible on mobile/desktop
        text.style.fontWeight = "bold";
        text.style.fontSize = "18px";
    }
}

// LOGOUT FUNCTION

function logout(){
    localStorage.removeItem("user");      // Clear user session
    window.location.href = "login.html";  // Redirect to login
}

