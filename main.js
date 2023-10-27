import { APIKey } from "./key.js";
const searchBar = document.querySelector(".search-bar");
const addBookButton = document.querySelector(".add-book-button");
const bookImgs = document.querySelector(".books");
const bookModal = document.querySelector(".book-modal");
const modalImg = document.querySelector(".modal-img");
const modalTitle = document.querySelector(".modal-title");
const modalAuthor = document.querySelector(".modal-author input");
const modalPages = document.querySelector(".modal-pages input");
const confirmedBooks = document.querySelector(".confirmed-books");
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
  console.log(event.target);
  const cardThumbnail = document.createElement("img");
  cardThumbnail.src = event.target.getAttribute("src");
  modalImg.append(cardThumbnail);
  modalTitle.textContent = event.target.dataset.title;
  modalTitle.dataset.id = event.target.dataset.id;
  modalAuthor.value = event.target.dataset.author;
  modalPages.value = event.target.dataset.pages;

  document.querySelectorAll(".book-state-btns button").forEach((button) => {
    button.addEventListener("click", (event) => {
      document
        .querySelector(".book-state-btns .active")
        .classList.remove("active");
      event.currentTarget.classList.add("active");
    });
  });

  for (let i = 0; i < 5; i++) {
    const starFont = document.createElement("i");
    starFont.className = "fa-regular fa-star";
    document.querySelector(".modal-rating").append(starFont);
  }

  document.querySelectorAll(".modal-rating i").forEach((star) => {
    star.addEventListener("click", (event) => {
      event.currentTarget.classList.toggle("fa-regular");
      event.currentTarget.classList.toggle("fa-solid");
    });
  });
  bookModal.showModal();
};

// it needs to click each modal book otherwise,
// the edited data will persist
const cleanModalBook = () => {
  if (modalImg.firstChild) {
    modalImg.firstChild.remove();
  }
  modalTitle.textContent = "";
  modalAuthor.value = "";
  modalPages.value = "";

  while (document.querySelector(".modal-rating").firstChild) {
    document.querySelector(".modal-rating").firstChild.remove();
  }
};

// It needs to check if there's thumbnail otherwise it will
// show empty space instead of the book cover.
const showFetchedBooks = (books) => {
  if (confirmedBooks) {
    document.querySelector(".confirmed-book-hide").hidden = true;
  }
  console.log(books);
  books.forEach((book) => {
    const id = book.id;
    const thumbnail = book.volumeInfo?.imageLinks?.smallThumbnail ?? "";
    const title = book.volumeInfo?.title ?? "unknown";
    const author = book.volumeInfo?.authors?.[0] ?? "unknown";
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
    node.addEventListener("click", (event) => {
      cleanModalBook();
      showModalBook(event);
    });
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

const cleanUpAfterSubmission = () => {
  while (bookImgs.firstChild) {
    bookImgs.firstChild.remove();
  }
  searchBar.value = "";
  addBookButton.hidden = false;
  searchBar.hidden = true;
};

const cleanUpEditBook = () => {
  if (document.querySelector(".edit-modal-img").firstChild) {
    document.querySelector(".edit-modal-img").firstChild.remove();
    document.querySelector(".edit-modal-title").textContent = "";
    document.querySelector(".edit-modal-title").dataset.id = "";
    document.querySelector(".edit-modal-author input").value = "";
    document.querySelector(".edit-modal-pages input").value = "";
    while (document.querySelector(".edit-modal-rating").firstChild) {
      document.querySelector(".edit-modal-rating").firstChild.remove();
    }
  }
};

const editStoredBook = (book) => {
  console.log(book.rating[0]);
  document.querySelector(".edit-book-modal").showModal();

  const cardThumbnail = document.createElement("img");
  cardThumbnail.src = book.img;
  document.querySelector(".edit-modal-img").append(cardThumbnail);
  document.querySelector(".edit-modal-title").textContent = book.title;
  document.querySelector(".edit-modal-title").dataset.id = book.id;
  document.querySelector(".edit-modal-author input").value = book.author;
  document.querySelector(".edit-modal-pages input").value = book.pages;
  book.rating.forEach((star) => {
    const eachStar = document.createElement("i");
    eachStar.className = star;
    document.querySelector(".edit-modal-rating").append(eachStar);
  });

  document.querySelectorAll(".edit-modal-rating i").forEach((star) => {
    star.addEventListener("click", (event) => {
      console.log(event.currentTarget);
      event.currentTarget.classList.toggle("fa-regular");
      event.currentTarget.classList.toggle("fa-solid");
    });
  });
};

const showSubmittedBook = (book) => {
  console.log(book);
  cleanUpAfterSubmission();
  const confirmedBookContainer = document.createElement("div");
  confirmedBookContainer.classList.add("confirmed-book-container");

  const confirmedImg = document.createElement("img");
  confirmedImg.src = book[0].img;
  confirmedBookContainer.append(confirmedImg);

  const confirmedBookInfo = document.createElement("div");
  confirmedBookInfo.classList.add("confirmed-book-info");
  const confirmedBookTitle = document.createElement("p");
  if (book[0].title.length > 15) {
    confirmedBookTitle.textContent = `${book[0].title.slice(0, 15)}...`;
    confirmedBookInfo.append(confirmedBookTitle);
  } else {
    confirmedBookTitle.textContent = book[0].title;
    confirmedBookInfo.append(confirmedBookTitle);
  }

  const confirmedBookAuthor = document.createElement("p");
  confirmedBookAuthor.textContent = book[0].author;
  confirmedBookInfo.append(confirmedBookAuthor);

  const confirmedBookPages = document.createElement("p");
  confirmedBookPages.textContent = `${book[0].pages} 📖`;
  confirmedBookInfo.append(confirmedBookPages);

  const confirmedBookState = document.createElement("button");
  if (book[0].state === "To read") {
    confirmedBookState.style.backgroundColor = "#3d3d3d";
  } else if (book[0].state === "Finished") {
    confirmedBookState.style.backgroundColor = "#40916c";
  } else if (book[0].state === "Reading") {
    confirmedBookState.style.backgroundColor = "#0096c7";
  }
  confirmedBookState.textContent = book[0].state;
  confirmedBookInfo.append(confirmedBookState);

  const starsEditBox = document.createElement("div");
  starsEditBox.classList.add("stars-edit-box");
  const rateStars = document.createElement("div");
  rateStars.classList.add("confirmed-book-rating");
  book[0].rating.forEach((star) => {
    const eachStar = document.createElement("i");
    eachStar.className = star;
    rateStars.append(eachStar);
  });
  starsEditBox.append(rateStars);

  const editBox = document.createElement("div");
  const editIcon = document.createElement("i");
  editIcon.className = "fa-solid fa-pen-to-square edit-icon";
  editBox.append(editIcon);
  starsEditBox.append(editBox);
  confirmedBookInfo.append(starsEditBox);

  confirmedBookContainer.append(confirmedBookInfo);
  confirmedBooks.append(confirmedBookContainer);

  editIcon.addEventListener("click", () => {
    cleanUpEditBook();
    editStoredBook(book[0]);
  });
};

const storeSubmittedBook = (event) => {
  event.preventDefault();
  console.log(event.target);
  if (storedBooks.some((book) => book.id === modalTitle.dataset.id)) {
    //do something
    console.log("hello");
  } else {
    const confirmedBooks = {
      id: modalTitle.dataset.id,
      img: event.target.querySelector(".modal-img img").src,
      title: modalTitle.textContent,
      author: modalAuthor.value,
      pages: modalPages.value,
      state: event.target.querySelector(".book-state-btns .active").textContent,
      rating: [],
    };
    event.target.querySelectorAll(".modal-rating i").forEach((star) => {
      confirmedBooks.rating.push(star.className);
    });
    storedBooks.push(confirmedBooks);
    showSubmittedBook(storedBooks.slice(-1));
    bookModal.close();
    document.querySelector(".confirmed-book-hide").hidden = false;
  }
};

document.querySelector(".modal-btn-cancel").addEventListener("click", () => {
  bookModal.close();
});

document
  .querySelector(".edit-modal-btn-cancel")
  .addEventListener("click", () => {
    document.querySelector(".edit-book-modal").close();
  });

document
  .querySelector(".book-modal form")
  .addEventListener("submit", storeSubmittedBook);

addBookButton.addEventListener("click", addBookButtonHandler);

document
  .querySelector("#search-bar-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    bookAPI(searchBar.value);
  });
