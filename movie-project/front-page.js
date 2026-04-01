// MOVIES DATA
const movies = [
  {
    id: 1,
    slug: "dangal",
    title: "Dangal",
    genre: "Drama",
    year: 2016,
    rating: 4.7,
    img: "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg"
  },
  {
    id: 2,
    slug: "interstellar",
    title: "Interstellar",
    genre: "Sci-Fi",
    year: 2014,
    rating: 4.6,
    img: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg"
  },
  {
    id: 3,
    slug: "3idiots",
    title: "3 Idiots",
    genre: "Comedy/Drama",
    year: 2009,
    rating: 4.9,
    img: "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg"
  },
  {
    id: 4,
    slug: "kgf",
    title: "KGF",
    genre: "Action",
    year: 2018,
    rating: 4.4,
    img: "https://upload.wikimedia.org/wikipedia/en/c/cc/K.G.F_Chapter_1_poster.jpg"
  }
];

// USERS DATA
const users = [
  {
    id: 1,
    name: "Hatim",
    email: "hatim@example.com",
    subscription: "Premium",
    img: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Aisha",
    email: "aisha@example.com",
    subscription: "VIP",
    img: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Rahul",
    email: "rahul@example.com",
    subscription: "Free",
    img: "https://randomuser.me/api/portraits/men/12.jpg"
  },
  {
    id: 4,
    name: "Sneha",
    email: "sneha@example.com",
    subscription: "Premium",
    img: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: 5,
    name: "Arjun",
    email: "arjun@example.com",
    subscription: "VIP",
    img: "https://randomuser.me/api/portraits/men/77.jpg"
  }
];

// REVIEWS DATA
const reviews = [
  { user: "Aisha", movie: "Dangal", rating: 4, comment: "Inspirational and emotional." },
  { user: "Sneha", movie: "3 Idiots", rating: 5, comment: "Funny and meaningful." },
  { user: "Rahul", movie: "KGF", rating: 5, comment: "Full action and mass movie!" }
];

// FAVORITES LOAD
let favorites = [];
try {
  const savedFavorites = localStorage.getItem("favorites");
  favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
  if (!Array.isArray(favorites)) favorites = [];
} catch (error) {
  favorites = [];
}

// DOM ELEMENTS
let movieList = null;
let favoriteList = null;
let userList = null;
let reviewList = null;
let searchInput = null;
let genreFilter = null;
let themeToggle = null;

// LOAD GENRES
function loadGenres() {
  if (!genreFilter) return;

  const uniqueGenres = [...new Set(movies.map(movie => movie.genre))];
  const genres = ["All", ...uniqueGenres];

  genreFilter.innerHTML = "";

  genres.forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });
}

// CREATE MOVIE CARD
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const isFavorite = favorites.some(fav => fav.id === movie.id);

  card.innerHTML = `
    <img src="${movie.img}" alt="${movie.title}">
    <h3>${movie.title}</h3>
    <p>${movie.genre} | ${movie.year}</p>
    <p>⭐ ${movie.rating}</p>
    <div class="movie-btns">
      <button class="watch-btn" type="button">▶ Watch</button>
      <button class="fav-btn" type="button">${isFavorite ? "💔 Remove" : "❤️ Favorite"}</button>
    </div>
  `;

  const img = card.querySelector("img");
  if (img) {
    img.onerror = function () {
      this.src = "https://via.placeholder.com/300x450?text=Movie+Image";
    };
  }

  const watchBtn = card.querySelector(".watch-btn");
  const favBtn = card.querySelector(".fav-btn");

  if (watchBtn) {
    watchBtn.addEventListener("click", () => {
      watchMovie(movie);
    });
  }

  if (favBtn) {
    favBtn.addEventListener("click", () => {
      toggleFavorite(movie.id);
    });
  }

  return card;
}

// SHOW MOVIES
function showMovies(filteredMovies = movies) {
  if (!movieList) return;

  movieList.innerHTML = "";

  if (!filteredMovies.length) {
    movieList.innerHTML = `<p style="text-align:center; grid-column:1/-1;">No movies found.</p>`;
    return;
  }

  filteredMovies.forEach(movie => {
    movieList.appendChild(createMovieCard(movie));
  });
}

// SHOW FAVORITES
function showFavorites() {
  if (!favoriteList) return;

  favoriteList.innerHTML = "";

  if (!favorites.length) {
    favoriteList.innerHTML = `<p style="text-align:center; grid-column:1/-1;">No favorite movies yet.</p>`;
    return;
  }

  favorites.forEach(movie => {
    favoriteList.appendChild(createMovieCard(movie));
  });
}

// TOGGLE FAVORITE
function toggleFavorite(movieId) {
  const movie = movies.find(m => m.id === movieId);
  if (!movie) return;

  const exists = favorites.some(fav => fav.id === movieId);

  if (exists) {
    favorites = favorites.filter(fav => fav.id !== movieId);
  } else {
    favorites.push(movie);
  }

  try {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } catch (error) {
    console.log("LocalStorage not available");
  }

  applyFilters();
  showFavorites();
}

// APPLY FILTERS
function applyFilters() {
  const searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const selectedGenre = genreFilter ? genreFilter.value : "All";

  const filteredMovies = movies.filter(movie => {
    const matchTitle = movie.title.toLowerCase().includes(searchText);
    const matchGenre = selectedGenre === "All" || movie.genre === selectedGenre;
    return matchTitle && matchGenre;
  });

  showMovies(filteredMovies);
}

// SHOW USERS
function showUsers() {
  if (!userList) return;

  userList.innerHTML = "";

  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";

    card.innerHTML = `
      <img src="${user.img}" alt="${user.name}">
      <h3>${user.name}</h3>
      <p>Email: ${user.email}</p>
      <p>Subscription: ${user.subscription}</p>
    `;

    const img = card.querySelector("img");
    if (img) {
      img.onerror = function () {
        this.src = "https://via.placeholder.com/300x300?text=User";
      };
    }

    userList.appendChild(card);
  });
}

// SHOW REVIEWS
function showReviews() {
  if (!reviewList) return;

  reviewList.innerHTML = "";

  reviews.forEach(review => {
    const card = document.createElement("div");
    card.className = "review-card";

    card.innerHTML = `
      <h3>${review.user} on ${review.movie}</h3>
      <p>Rating: ⭐ ${review.rating}</p>
      <p>"${review.comment}"</p>
    `;

    reviewList.appendChild(card);
  });
}

// WATCH MOVIE
function watchMovie(movie) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (isLoggedIn !== "true" || !currentUser) {
    alert("Please login first to watch movies!");
    localStorage.setItem("selectedMovie", movie.slug);
    window.location.href = "login.html";
    return;
  }

  let watchHistory = JSON.parse(localStorage.getItem("watchHistory")) || [];

  watchHistory.push({
    name: currentUser.name,
    email: currentUser.email,
    movie: movie.title,
    watchedAt: new Date().toLocaleString()
  });

  localStorage.setItem("watchHistory", JSON.stringify(watchHistory));

  window.location.href = `watch.html?movie=${movie.slug}`;
}

// THEME
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    if (themeToggle) themeToggle.textContent = "☀ Light Mode";
  } else {
    document.body.classList.remove("light-mode");
    if (themeToggle) themeToggle.textContent = "🌙 Dark Mode";
  }
}

function toggleTheme() {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");
    if (themeToggle) themeToggle.textContent = "☀ Light Mode";
  } else {
    localStorage.setItem("theme", "dark");
    if (themeToggle) themeToggle.textContent = "🌙 Dark Mode";
  }
}

// INIT APP
function initApp() {
  movieList = document.getElementById("movie-list");
  favoriteList = document.getElementById("favorite-list");
  userList = document.getElementById("user-list");
  reviewList = document.getElementById("review-list");
  searchInput = document.getElementById("searchInput");
  genreFilter = document.getElementById("genreFilter");
  themeToggle = document.getElementById("theme-toggle");

  const browseBtn = document.getElementById("browse-btn");
  const usersBtn = document.getElementById("users-btn");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");

  loadGenres();
  loadTheme();
  showMovies();
  showFavorites();
  showUsers();
  showReviews();

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (genreFilter) {
    genreFilter.addEventListener("change", applyFilters);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  if (browseBtn) {
    browseBtn.addEventListener("click", () => {
      document.getElementById("movies")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (usersBtn) {
    usersBtn.addEventListener("click", () => {
      document.getElementById("users")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (loginBtn) {
    loginBtn.style.display = isLoggedIn === "true" ? "none" : "inline-block";
  }

  if (logoutBtn) {
    logoutBtn.style.display = isLoggedIn === "true" ? "inline-block" : "none";

    logoutBtn.addEventListener("click", function () {
      try {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("selectedMovie");

        alert("Logged out successfully!");
        window.location.href = "index.html";
      } catch (error) {
        console.error("Logout error:", error);
        alert("Logout failed!");
      }
    });
  }

  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  }
}

document.addEventListener("DOMContentLoaded", initApp);