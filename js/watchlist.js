/*
  This script is for the Watch & Reading List page.
  It reads items from localStorage and displays them 
*/
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const watchlistContainer = document.getElementById("watchlist-container");
//to load watchlist datat from local storage 
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

function renderWatchlist() {
  watchlistContainer.innerHTML = "";

  if (watchlist.length === 0) {
    watchlistContainer.innerHTML = "<p>Your watchlist is empty.</p>";
    return;
  }

  for (let i = 0; i < watchlist.length; i++) {
    const item = watchlist[i];
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("movie");
    // Set status text depending on watched or not
    let statusText = " Not Watched/Read";
    if (item.watched === true) {
      statusText = " Watched/Read";
    }
   // Show whether it’s a book or movie
    let typeText = " Movie";
    if (item.type === "book") {
      typeText = " Book";
    }

    itemDiv.innerHTML =
      "<h3>" +
      item.title +
      "</h3>" +
      '<img src="' +
      item.posterPath +
      '" alt="' +
      item.title +
      '">' +
      "<p>Type: " +
      typeText +
      "</p>" +
      "<p>Rating: " +
      item.rating +
      "</p>" +
      "<p>Status: " +
      statusText +
      "</p>" +
      "<button onclick=\"toggleWatched('" +
      item.id +
      "')\">" +
      (item.watched ? "Mark Unwatched" : "Mark Watched") +
      "</button>" +
      "<button onclick=\"removeFromWatchlist('" +
      item.id +
      '\')" style="background-color: crimson; color: white; margin-top: 5px;">Remove</button>';

    watchlistContainer.appendChild(itemDiv);
  }
}
// Toggle the watched/read status of an item
function toggleWatched(id) {
  for (let i = 0; i < watchlist.length; i++) {
    if (watchlist[i].id === id) {
      watchlist[i].watched = !watchlist[i].watched;
    }
  }

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchlist();
}

function removeFromWatchlist(id) {
  let newList = [];

  for (let i = 0; i < watchlist.length; i++) {
    if (watchlist[i].id !== id) {
      newList.push(watchlist[i]);
    }
  }

  watchlist = newList;
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
  renderWatchlist();
}

renderWatchlist();
