const API_KEY = "00f16a0dc41541122c802e844f07e520";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const moviesContainer = document.getElementById("movies-container");
const watchlistContainer = document.getElementById("watchlist-container");

let watchlist = []; 
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query !== "") {
    searchMovies(query);
  }
});

function searchMovies(query) {
  fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      displayMovies(data.results);
    })
    .catch((err) => {
      console.error("Error fetching movies:", err);
      moviesContainer.innerHTML =
        "<p>Error loading movies. Please try again.</p>";
    });
}

function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  if (movies.length === 0) {
    moviesContainer.innerHTML = "<p>No results found.</p>";
    return;
  }

  movies.forEach((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");

    movieDiv.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="${
        movie.poster_path
          ? IMAGE_BASE_URL + movie.poster_path
          : "https://via.placeholder.com/200x300?text=No+Image"
      }" alt="${movie.title}">
      <p>Rating: ${movie.vote_average}</p>
      <button onclick="addToWatchlist(${movie.id}, \`${movie.title.replace(
      /'/g,
      "\\'"
    )}\`, '${movie.poster_path}', ${
      movie.vote_average
    })">Add to Watchlist</button>
    `;

    moviesContainer.appendChild(movieDiv);
  });
}

function addToWatchlist(id, title, posterPath, rating) {
  if (watchlist.some((movie) => movie.id === id)) return;

  watchlist.push({
    id,
    title,
    posterPath,
    rating,
    watched: false,
  });

  renderWatchlist();
}

function toggleWatched(id) {
  watchlist = watchlist.map((movie) => {
    if (movie.id === id) {
      return { ...movie, watched: !movie.watched };
    }
    return movie;
  });

  renderWatchlist();
}

function renderWatchlist() {
  watchlistContainer.innerHTML = "";

  if (watchlist.length === 0) {
    watchlistContainer.innerHTML = "<p>Your watchlist is empty.</p>";
    return;
  }

  watchlist.forEach((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");

    movieDiv.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="${
        movie.posterPath
          ? IMAGE_BASE_URL + movie.posterPath
          : "https://via.placeholder.com/200x300?text=No+Image"
      }" alt="${movie.title}">
      <p>Rating: ${movie.rating}</p>
      <p>Status: ${movie.watched ? "Watched" : "Not Watched"}</p>
      <button onclick="toggleWatched(${movie.id})">${
      movie.watched ? "Mark Unwatched" : "Mark Watched"
    }</button>
    `;

    watchlistContainer.appendChild(movieDiv);
  });
}

renderWatchlist();
