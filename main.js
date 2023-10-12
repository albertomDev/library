import { APIKey } from "./key.js";
const searchBar = document.querySelector(".search-bar");
const addBookButton = document.querySelector(".add-book-button");
const searchBarForm = document.querySelector("#search-bar-form");
const bookImgs = document.querySelector(".books");
const bookModal = document.querySelector(".book-modal");
const bookForm = document.querySelector(".book-modal form");
const closeModal = document.querySelector(".modal-btn-cancel");
const modalImg = document.querySelector(".modal-img");
const modalTitle = document.querySelector(".modal-title");
const modalAuthor = document.querySelector(".modal-author input");
const modalPages = document.querySelector(".modal-pages input");

const showModalBook = (event) => {
  if (modalImg.firstChild) {
    modalImg.firstChild.remove();
  }
  modalTitle.textContent = "";
  modalAuthor.value = "";
  modalPages.value = "";

  const cardThumbnail = document.createElement("img");
  cardThumbnail.src = event.target.getAttribute("src");
  document.querySelector(".modal-img").append(cardThumbnail);
  modalTitle.textContent = event.target.dataset.title;
  modalAuthor.value = event.target.dataset.author;
  modalPages.value = event.target.dataset.pages;
  console.log(event.target);
  bookModal.showModal();
};

const showFetchedBooks = (books) => {
  console.log(books);
  books.forEach((book) => {
    const id = book.id;
    const thumbnail = book.volumeInfo?.imageLinks?.smallThumbnail ?? "";
    const title = book.volumeInfo?.title ?? "unknown";
    const author = book.volumeInfo?.authors?.join(" ") ?? "unknown";
    const pages = book.volumeInfo?.pageCount ?? "0";
    if (thumbnail !== "") {
      const cardThumbnail = document.createElement("img");
      const divCard = document.createElement("div");
      cardThumbnail.src = thumbnail;
      cardThumbnail.dataset.id = id;
      cardThumbnail.dataset.title = title;
      cardThumbnail.dataset.author = author;
      cardThumbnail.dataset.pages = pages;
      divCard.classList.add("book-img");
      divCard.append(cardThumbnail);
      bookImgs.append(divCard);
    }
  });

  bookImgs.childNodes.forEach((node) => {
    node.addEventListener("click", showModalBook);
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
      while (bookImgs.firstChild) {
        bookImgs.firstChild.remove();
      }
      showFetchedBooks(data.items);
    })
    .catch((error) => {
      console.log(error);
    });
};

closeModal.addEventListener("click", () => {
  bookModal.close();
});

bookForm.addEventListener("submit", (event) => {
  console.log(event.currentTarget);
});

// bookImgs.addEventListener("click", showBookInfoHandler);

addBookButton.addEventListener("click", addBookButtonHandler);

searchBarForm.addEventListener("submit", (event) => {
  event.preventDefault();
  bookAPI(searchBar.value);
});
