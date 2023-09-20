const searchBook = document.querySelector(".search-book");
const addBookButton = document.querySelector(".add-book-button");

addBookButton.addEventListener("click", () => {
  addBookButton.hidden = true;
  searchBook.hidden = false;
  setTimeout(() => {
    searchBook.classList.add("clicked");
    searchBook.focus();
  }, 100);
});
