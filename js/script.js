const API_KEY = "00f16a0dc41541122c802e844f07e520";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const moviesContainer = document.getElementById("movies-container");
const booksContainer = document.getElementById("books-container");
searchBtn.addEventListener("click", function () {
  const query = searchInput.value.trim();
  if (query !== "") {
    searchMovies(query);
    searchBooks(query);
  }
});

// movies

function searchMovies(query) {
  const url =
    BASE_URL +
    "/search/movie?api_key=" +
    API_KEY +
    "&query=" +
    encodeURIComponent(query);

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.results) {
        showMovies(data.results);
      } else {
        moviesContainer.innerHTML = "<p>No movies found.</p>";
      }
    })
    .catch(function (error) {
      console.log("Error fetching movies:", error);
      moviesContainer.innerHTML = "<p>Failed to load movies.</p>";
    });
}

function showMovies(movies) {
  moviesContainer.innerHTML = "";

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const movieDiv = document.createElement("div");
    movieDiv.classList.add("movie");

    let title = movie.title;
    let rating = movie.vote_average;
    let image = "https://via.placeholder.com/200x300?text=No+Image";

    if (movie.poster_path) {
      image = IMAGE_BASE_URL + movie.poster_path;
    }

    movieDiv.innerHTML =
      "<h3>" +
      title +
      "</h3>" +
      '<img src="' +
      image +
      '" alt="' +
      title +
      '">' +
      "<p>Rating: " +
      rating +
      "</p>" +
      "<button onclick=\"addToWatchlist('" +
      movie.id +
      "', '" +
      title.replace(/'/g, "\\'") +
      "', '" +
      image +
      "', '" +
      rating +
      "', 'movie')\">Add to Watchlist</button>";

    moviesContainer.appendChild(movieDiv);
  }
}

// book

function searchBooks(query) {
  const url =
    "https://www.googleapis.com/books/v1/volumes?q=" +
    encodeURIComponent(query);

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("Google Books API response:", data); // 👈 check what you're getting
      if (data.items && data.items.length > 0) {
        showBooks(data.items);
      } else {
        booksContainer.innerHTML = "<p>No books found.</p>";
      }
    })
    .catch(function (error) {
      console.log("Error fetching books:", error);
      booksContainer.innerHTML = "<p>Failed to load books.</p>";
    });
}

function showBooks(books) {
  booksContainer.innerHTML = "";

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const info = book.volumeInfo;

    const bookDiv = document.createElement("div");
    bookDiv.classList.add("movie");

    let title = "No Title";
    if (info.title) {
      title = info.title;
    }

    let authors = "Unknown";
    if (info.authors && info.authors.length > 0) {
      authors = info.authors.join(", ");
    }

    let rating = "N/A";
    if (info.averageRating) {
      rating = info.averageRating;
    }

    let image = "https://via.placeholder.com/200x300?text=No+Image";
    if (info.imageLinks && info.imageLinks.thumbnail) {
      image = info.imageLinks.thumbnail;
    }

    bookDiv.innerHTML =
      "<h3>" +
      title +
      "</h3>" +
      '<img src="' +
      image +
      '" alt="' +
      title +
      '">' +
      "<p>Author: " +
      authors +
      "</p>" +
      "<p>Rating: " +
      rating +
      "</p>" +
      "<button onclick=\"addToWatchlist('" +
      book.id +
      "', '" +
      title.replace(/'/g, "\\'") +
      "', '" +
      image +
      "', '" +
      rating +
      "', 'book')\">Add to Reading List</button>";

    booksContainer.appendChild(bookDiv);
  }
}

// I used AI (copilot) to help with this part because I wasn’t sure how to make the watchlist
// stay saved when switching pages or refreshing. It suggested using localStorage to store the data,
// which worked well for what I needed.

function addToWatchlist(id, title, image, rating, type) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  let alreadyExists = false;
  for (let i = 0; i < watchlist.length; i++) {
    if (watchlist[i].id === id) {
      alreadyExists = true;
    }
  }

  if (!alreadyExists) {
    const item = {
      id: id,
      title: title,
      posterPath: image,
      rating: rating,
      type: type,
      watched: false,
    };

    watchlist.push(item);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    if (type === "book") {
      alert("Book added to Reading List!");
    } else {
      alert("Movie added to Watchlist!");
    }
  }
}
