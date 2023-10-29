import { APIKey } from "./key.js";
const searchBar = document.querySelector(".search-bar");
const addBookButton = document.querySelector(".add-book-button");
const bookImgs = document.querySelector(".books");
const bookModal = document.querySelector(".book-modal");
const modalImg = document.querySelector(".modal-img");
const modalTitle = document.querySelector(".modal-title");
const modalAuthor = document.querySelector(".modal-author input");
const modalPages = document.querySelector(".modal-pages input");
const editModalImg = document.querySelector(".edit-modal-img");
const editBookTitle = document.querySelector(".edit-modal-title");
const editBookAuthor = document.querySelector(".edit-modal-author input");
const editBookPages = document.querySelector(".edit-modal-pages input");
const confirmedBooks = document.querySelector(".confirmed-books");
const editBookRating = document.querySelector(".edit-modal-rating");
const storedBooks = [];

const buttonStyler = (state) => {
  if (state === "To read") {
    return "#3d3d3d";
  } else if (state === "Finished") {
    return "#40916c";
  } else if (state === "Reading") {
    return "#0096c7";
  }
};
// opens search if there was no setTimeout
// there would not animation.
const addBookButtonHandler = () => {
  addBookButton.hidden = true;
  searchBar.hidden = false;
  setTimeout(() => {
    searchBar.classList.add("clicked");
    searchBar.focus();
  }, 100);
};

// display book description when clicked
const showModalBook = (event) => {
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

// it needs to be emptied otherwise the data
// from previous modal will persist
const cleanModalBook = () => {
  if (modalImg.firstChild) {
    modalImg.firstChild.remove();
  }
  modalTitle.textContent = "";
  modalTitle.style.color = "#3d3d3d";
  modalPages.style.color = "#3d3d3d";
  modalAuthor.value = "";
  modalPages.value = "";

  while (document.querySelector(".modal-rating").firstChild) {
    document.querySelector(".modal-rating").firstChild.remove();
  }

  document.querySelectorAll(".book-state-btns button").forEach((button) => {
    button.classList.remove("active");
  });
  document
    .querySelectorAll(".book-state-btns button")[0]
    .classList.add("active");
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

// Each time it fetches, it must empty the screen,
// otherwise the previous fetch would be seen.
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

// cleans up the the page, back to the start
const cleanUpAfterSubmission = () => {
  while (bookImgs.firstChild) {
    bookImgs.firstChild.remove();
  }
  searchBar.value = "";
  addBookButton.hidden = false;
  searchBar.hidden = true;
};

// because I didn't want iterate through all the books to display them,
// I had to iterate through the dom/containers/books
const deleteBook = (delBookID) => {
  const containers = document.querySelectorAll(".confirmed-book-container");
  for (let i = 0; i < containers.length; i++) {
    if (containers[i].querySelector(".editTitle").dataset.id === delBookID) {
      containers[i].parentNode.removeChild(containers[i]);
    }
  }

  const delIndex = storedBooks.findIndex((book) => {
    return book.id === delBookID;
  });
  if (delIndex !== -1) {
    storedBooks.splice(delIndex, 1);
  }
};

// displays the edited book
const updateDomBook = (book) => {
  document
    .querySelectorAll(".confirmed-book-container")
    .forEach((container) => {
      let editTitle = container.querySelector(".editTitle");
      let editAuthor = container.querySelector(".editAuthor");
      let editPages = container.querySelector(".editPages");
      let editBtn = container.querySelector(".editBtn");
      let editStars = container.querySelectorAll(".editStars i");

      if (editTitle.dataset.id === book.id) {
        if (book.author.length > 18) {
          editAuthor.textContent = `${book.author.slice(0, 19)}...`;
        } else {
          editAuthor.textContent = book.author;
        }
        editPages.textContent = book.pages;
        editBtn.textContent = book.state;
        editBtn.style.backgroundColor = buttonStyler(book.state);
        for (let i = 0; i < editStars.length; i++) {
          editStars[i].setAttribute("class", `${book.rating[i]}`);
        }
      }
    });
};


// before a book is edited, the editStoredBook empty
// otherwise it will append old values 
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

// updates the array with edited book
// and does form validation -> must a valid positive number
const submitEditedBook = (event) => {
  event.preventDefault();
  storedBooks.forEach((book) => {
    if (book.id === editBookTitle.dataset.id) {
      const validPages = Number(editBookPages.value);
      const isNumber = !isNaN(validPages);
      const isPositive = validPages > 0;
      if (!isNumber || !isPositive) {
        editBookPages.value = "enter a positive number";
        editBookPages.style.color = "red";
      } else {
        book.id = editBookTitle.dataset.id;
        book.img = event.target.querySelector(".edit-modal-img img").src;
        book.title = editBookTitle.textContent;
        book.author = editBookAuthor.value;
        book.pages = editBookPages.value;
        book.state = event.target.querySelector(
          ".edit-book-state-btns .active"
        ).textContent;
        book.rating = [];
        event.target
          .querySelectorAll(".edit-modal-rating i")
          .forEach((star) => {
            book.rating.push(star.className);
          });
        updateDomBook(book);
        document.querySelector(".edit-book-modal").close();
      }
    }
  });
};

// opens a modal with clicked book to be edited
const editStoredBook = (book) => {
  document.querySelector(".edit-book-modal").showModal();
  const cardThumbnail = document.createElement("img");
  cardThumbnail.src = book.img;
  editModalImg.append(cardThumbnail);
  editBookTitle.textContent = book.title;
  editBookTitle.dataset.id = book.id;
  document.querySelector(".delete-btn").dataset.id = book.id;
  document.querySelector(".delete-btn");
  editBookAuthor.value = book.author;
  editBookPages.value = book.pages;
  editBookPages.style.color = "#3d3d3d";
  book.rating.forEach((star) => {
    const eachStar = document.createElement("i");
    eachStar.className = star;
    editBookRating.append(eachStar);
  });

  document
    .querySelectorAll(".edit-book-state-btns button")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        document
          .querySelector(".edit-book-state-btns .active")
          .classList.remove("active");
        event.currentTarget.classList.add("active");
        book.state = event.currentTarget.textContent;
      });
    });

  document.querySelectorAll(".edit-modal-rating i").forEach((star) => {
    star.addEventListener("click", (event) => {
      event.currentTarget.classList.toggle("fa-regular");
      event.currentTarget.classList.toggle("fa-solid");
    });
  });
};

// display the book to screen once it passes
// all the checks
const showSubmittedBook = (book) => {
  //console.log(book);
  cleanUpAfterSubmission();
  const confirmedBookContainer = document.createElement("div");
  confirmedBookContainer.classList.add("confirmed-book-container");

  const confirmedImg = document.createElement("img");
  confirmedImg.src = book[0].img;
  confirmedBookContainer.append(confirmedImg);

  const confirmedBookInfo = document.createElement("div");
  confirmedBookInfo.classList.add("confirmed-book-info");
  const confirmedBookTitle = document.createElement("p");
  confirmedBookTitle.className = "editTitle";
  confirmedBookTitle.dataset.id = book[0].id;
  if (book[0].title.length > 15) {
    confirmedBookTitle.textContent = `${book[0].title.slice(0, 15)}...`;
  } else {
    confirmedBookTitle.textContent = book[0].title;
  }
  confirmedBookInfo.append(confirmedBookTitle);

  const confirmedBookAuthor = document.createElement("p");
  confirmedBookAuthor.className = "editAuthor";
  if (book[0].author.length > 18) {
    confirmedBookAuthor.textContent = `${book[0].author.slice(0, 18)}...`;
  } else {
    confirmedBookAuthor.textContent = book[0].author;
  }
  confirmedBookInfo.append(confirmedBookAuthor);

  const confirmedBookPages = document.createElement("p");
  confirmedBookPages.className = "editPages";
  confirmedBookPages.textContent = `${book[0].pages} 📖`;
  confirmedBookInfo.append(confirmedBookPages);

  const confirmedBookState = document.createElement("button");
  confirmedBookState.style.backgroundColor = buttonStyler(book[0].state);
  confirmedBookState.className = "editBtn";
  confirmedBookState.textContent = book[0].state;
  confirmedBookInfo.append(confirmedBookState);

  const starsEditBox = document.createElement("div");
  starsEditBox.classList.add("stars-edit-box");
  const rateStars = document.createElement("div");
  rateStars.className = "editStars";
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

// stores in array the book submitted from showModalBook
// but before, it does form validation -> must a valid positive number
// and makes sure it's not a repeated book
const storeSubmittedBook = (event) => {
  event.preventDefault();
  const validPages = Number(modalPages.value);
  const isNumber = !isNaN(validPages);
  const isPositive = validPages > 0;
  if (storedBooks.some((book) => book.id === modalTitle.dataset.id)) {
    modalTitle.textContent = "This book already exists in your library!";
    modalTitle.style.color = "red";
  } else if (!isNumber || !isPositive) {
    modalPages.value = "enter a positive number";
    modalPages.style.color = "red";
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
    //console.log(storedBooks);
    bookModal.close();
    document.querySelector(".confirmed-book-hide").hidden = false;
  }
};

document.querySelector(".modal-btn-cancel").addEventListener("click", () => {
  bookModal.close();
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

document
  .querySelector(".edit-book-modal form")
  .addEventListener("submit", submitEditedBook);

document
  .querySelector(".edit-modal-btn-cancel")
  .addEventListener("click", () => {
    document.querySelector(".edit-book-modal").close();
  });

document.querySelector(".delete-btn").addEventListener("click", (event) => {
  deleteBook(event.target.dataset.id);
  document.querySelector(".edit-book-modal").close();
});

document.querySelector('.logo').addEventListener('click', () => {
  document.querySelector(".confirmed-book-hide").hidden = false;
  cleanUpAfterSubmission()
})