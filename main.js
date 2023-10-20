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
const storedBooks = [];

const addBookButtonHandler = () => {
  addBookButton.hidden = true;
  searchBar.hidden = false;
  setTimeout(() => {
    searchBar.classList.add("clicked");
    searchBar.focus();
  }, 100);
};

const showModalBook = (event) => {
  bookModal.showModal();
  console.log(event.target);
  const cardThumbnail = document.createElement("img");
  cardThumbnail.src = event.target.getAttribute("src");
  document.querySelector(".modal-img").append(cardThumbnail);
  modalTitle.textContent = event.target.dataset.title;
  modalTitle.setAttribute("id", event.target.dataset.id);
  modalAuthor.value = event.target.dataset.author;
  modalPages.value = event.target.dataset.pages;
  bookModal.showModal();

  document.querySelectorAll(".book-state-btns button").forEach((button) => {
    button.addEventListener("click", (event) => {
      document
        .querySelector(".book-state-btns .active")
        .classList.remove("active");
      event.currentTarget.classList.add("active");
    });
  });

  document.querySelectorAll(".modal-rating i").forEach((star) => {
    star.addEventListener("click", (event) => {
      event.target.classList.remove("fa-regular");
      event.target.classList.add("fa-solid");
    });
  });
};

// it needs to click each modal book otherwise,
// the edited data will persist
const cleanModalBook = (event) => {
  if (modalImg.firstChild) {
    modalImg.firstChild.remove();
  }
  modalTitle.textContent = "";
  modalAuthor.value = "";
  modalPages.value = "";

  while (document.querySelector(".modal-rating").firstChild) {
    document.querySelector(".modal-rating").firstChild.remove();
  }

  for (let i = 0; i < 5; i++) {
    const starFont = document.createElement("i");
    starFont.classList.add("fa-regular");
    starFont.classList.add("fa-star");
    document.querySelector(".modal-rating").append(starFont);
  }
  showModalBook(event);
};

// It needs to check if there's thumbnail otherwise it will
// show empty space instead of the book cover.
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
    node.addEventListener("click", cleanModalBook);
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
      while (bookImgs.firstChild) {
        bookImgs.firstChild.remove();
      }
      showFetchedBooks(data.items);
    })
    .catch((error) => {
      console.log(error);
    });
};

const displayConfirmedBook = (book) => {
  console.log(book);
  const confirmedBookContainer = document.createElement("div");
  confirmedBookContainer.classList.add("confirmed-book-container");

  const confirmedImg = document.createElement("img");
  confirmedImg.src = book[0].img;
  confirmedBookContainer.append(confirmedImg);

  const confirmedBookInfo = document.createElement("div");
  const confirmedBookTitle = document.createElement("p");
  confirmedBookTitle.textContent = book[0].title;
  confirmedBookTitle.setAttribute("id", book[0].id);
  confirmedBookInfo.append(confirmedBookTitle);

  const confirmedBookAuthor = document.createElement("p");
  confirmedBookAuthor.textContent = book[0].author;
  confirmedBookInfo.append(confirmedBookAuthor);

  const confirmedBookPages = document.createElement("p");
  confirmedBookPages.textContent = book[0].pages;
  confirmedBookInfo.append(confirmedBookPages);

  const confirmedBookState = document.createElement("p");
  confirmedBookState.textContent = book[0].state;
  confirmedBookInfo.append(confirmedBookState);

  const confirmedBookRating = document.createElement("div");
  book[0].rating.forEach((star) => {
    confirmedBookRating.append(star);
  });
  confirmedBookInfo.append(confirmedBookRating);

  confirmedBookContainer.append(confirmedBookInfo);
  document.querySelector(".confirmed-books").append(confirmedBookContainer);
};

const storeConfirmedBook = (event) => {
  event.preventDefault();

  if (storedBooks.some((book) => book.id === modalTitle.getAttribute("id"))) {
    console.log("hello");
  } else {
    console.log(event.target.querySelector(".book-state-btns .active"));
    const confirmedBooks = {
      id: modalTitle.getAttribute("id"),
      img: modalImg.childNodes[0].src,
      title: modalTitle.textContent,
      author: modalAuthor.value,
      pages: modalPages.value,
      state: event.target.querySelector(".book-state-btns .active").textContent,
      rating: event.target.querySelectorAll(".modal-rating i"),
    };
    // console.log(confirmedBooks);
    storedBooks.push(confirmedBooks);
    displayConfirmedBook(storedBooks.slice(-1));
    bookModal.close();
  }
};

closeModal.addEventListener("click", () => {
  bookModal.close();
});

bookForm.addEventListener("submit", storeConfirmedBook);

addBookButton.addEventListener("click", addBookButtonHandler);

searchBarForm.addEventListener("submit", (event) => {
  event.preventDefault();
  bookAPI(searchBar.value);
});
