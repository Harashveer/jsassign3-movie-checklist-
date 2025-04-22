const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const watchlistContainer = document.getElementById("watchlist-container");

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

// I used AI (copilot) to help with this part because I was stuggling with how to make the watchlist
// stay saved when switching pages or refreshing. It suggested using localStorage to store the data,
// which worked well for what I needed.

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
      <p>Status: ${movie.watched ? "✅ Watched" : "⏳ Not Watched"}</p>
      <button onclick="toggleWatched(${movie.id})">
        ${movie.watched ? "Mark Unwatched" : "Mark Watched"}
      </button>
      <button onclick="removeFromWatchlist(${
        movie.id
      })" style="margin-top: 5px; background-color: crimson; color: white;">
        Remove
      </button>
    `;

    watchlistContainer.appendChild(movieDiv);
  });
}

function toggleWatched(id) {
  watchlist = watchlist.map((movie) => {
    if (movie.id === id) {
      return { ...movie, watched: !movie.watched };
    }
    return movie;
  });

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchlist();
}

function removeFromWatchlist(id) {
  watchlist = watchlist.filter((movie) => movie.id !== id);
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchlist();
}

renderWatchlist();
