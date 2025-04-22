const API_KEY = "00f16a0dc41541122c802e844f07e520";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const moviesContainer = document.getElementById("movies-container");

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
    )}\`, '${movie.poster_path}', ${movie.vote_average})">
        Add to Watchlist
      </button>
    `;

    moviesContainer.appendChild(movieDiv);
  });
}

// I used AI (copilot) to help with this part because I was struglling with how to make the watchlist
// stay saved when switching pages or refreshing. It suggested using localStorage to store the data,
// which worked well for what I needed.

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

function addToWatchlist(id, title, posterPath, rating) {
  if (watchlist.some((movie) => movie.id === id)) return;

  watchlist.push({
    id,
    title,
    posterPath,
    rating,
    watched: false,
  });

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  alert("Added to watchlist!");
}


function searchBooks(query) {
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      displayBooks(data.items);
    })
    .catch(err => {
      console.error("Error fetching books:", err);
      moviesContainer.innerHTML = "<p>Failed to load books. Try again later.</p>";
    });
}

function displayBooks(books) {
  moviesContainer.innerHTML = ""; // Reusing same container

  if (!books || books.length === 0) {
    moviesContainer.innerHTML = "<p>No books found.</p>";
    return;
  }

  books.forEach(book => {
    const info = book.volumeInfo;

    const bookDiv = document.createElement("div");
    bookDiv.classList.add("movie"); // reuse movie card style

    bookDiv.innerHTML = `
      <h3>${info.title}</h3>
      <img src="${info.imageLinks?.thumbnail || 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${info.title}">
      <p>Author: ${info.authors ? info.authors.join(', ') : 'Unknown'}</p>
      <p>Rating: ${info.averageRating || 'N/A'}</p>
      <button onclick="addToReadingList('${book.id}', \`${info.title.replace(/'/g, "\\'")}\`, '${info.imageLinks?.thumbnail}', '${info.authors ? info.authors.join(', ') : ''}', ${info.averageRating || 0})">
        Add to Reading List
      </button>
    `;

    moviesContainer.appendChild(bookDiv);
  });
}