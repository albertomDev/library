import { APIKey } from "./key.js";
const searchBar = document.querySelector(".search-bar");
const addBookButton = document.querySelector(".add-book-button");
const searchBarForm = document.querySelector("#search-bar-form");
const booksDiv = document.querySelector(".books");
const allBooks = document.querySelectorAll(".books");

const displayBooks = (books) => {
  console.log(books);
  books.forEach((book) => {
    const thumbnail = book.volumeInfo?.imageLinks?.smallThumbnail ?? "";
    console.log(thumbnail);
    if (thumbnail !== "") {
      const cardThumbnail = document.createElement("img");
      const divCard = document.createElement("div");
      cardThumbnail.src = thumbnail;
      divCard.classList.add("book-img");
      divCard.append(cardThumbnail);
      booksDiv.append(divCard);
    }
  });
};

const bookAPI = (term) => {
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${term}&maxResults=21&key=${APIKey}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("API error");
      }
      return res.json();
    })
    .then((data) => {
      while (booksDiv.firstChild) {
        booksDiv.firstChild.remove();
      }
      displayBooks(data.items);
    })
    .catch((error) => {
      console.log(error);
    });
};

const addBookButtonHandler = () => {
  addBookButton.hidden = true;
  searchBar.hidden = false;
  setTimeout(() => {
    searchBar.classList.add("clicked");
    searchBar.focus();
  }, 100);
};


addBookButton.addEventListener("click", addBookButtonHandler);

searchBarForm.addEventListener("submit", (event) => {
  event.preventDefault();
  bookAPI(searchBar.value);
});
