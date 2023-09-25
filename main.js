import { APIKey } from "./key.js";
const searchBar = document.querySelector(".search-bar");
const addBookButton = document.querySelector(".add-book-button");
const searchBarForm = document.querySelector("#search-bar-form");

const bookAPI = (term) => {
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${term}&maxResults=20&key=${APIKey}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("API error");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data.items);
    })
    .catch((error) => {
      console.log(error);
    });
};

addBookButton.addEventListener("click", () => {
  addBookButton.hidden = true;
  searchBar.hidden = false;
  console.log("hello");
  setTimeout(() => {
    searchBar.classList.add("clicked");
    searchBar.focus();
  }, 100);
});

searchBarForm.addEventListener("submit", (event) => {
  event.preventDefault();
  bookAPI(searchBar.value);
});
