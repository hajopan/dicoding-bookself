// Constants
const STORAGE_KEY = 'BOOKSHELF_APP';
const INCOMPLETE_BOOK_LIST_ID = 'incompleteBookList';
const COMPLETE_BOOK_LIST_ID = 'completeBookList';

// Load books from localStorage
function loadBooks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Save books to localStorage
function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Add new book to bookshelf
function addBook(title, author, year, isComplete) {
  const books = loadBooks();
  const book = {
    id: +new Date(), // unique ID based on current time
    title,
    author,
    year,
    isComplete,
  };
  books.push(book);
  saveBooks(books);
  renderBooks();
}

// Remove book by ID
function removeBook(bookId) {
  const books = loadBooks().filter(book => book.id !== bookId);
  saveBooks(books);
  renderBooks();
}

// Toggle book completion (move between shelves)
function toggleBookCompletion(bookId) {
  const books = loadBooks();
  const book = books.find(book => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks(books);
    renderBooks();
  }
}

// Render books in the respective lists
function renderBooks() {
  const incompleteBookList = document.getElementById(INCOMPLETE_BOOK_LIST_ID);
  const completeBookList = document.getElementById(COMPLETE_BOOK_LIST_ID);

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  const books = loadBooks();

  books.forEach(book => {
    const bookElement = makeBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Create HTML element for a book
function makeBookElement(book) {
  const bookItem = document.createElement('div');
  bookItem.setAttribute('data-bookid', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');

  const titleElement = document.createElement('h3');
  titleElement.setAttribute('data-testid', 'bookItemTitle');
  titleElement.innerText = book.title;

  const authorElement = document.createElement('p');
  authorElement.setAttribute('data-testid', 'bookItemAuthor');
  authorElement.innerText = `Penulis: ${book.author}`;

  const yearElement = document.createElement('p');
  yearElement.setAttribute('data-testid', 'bookItemYear');
  yearElement.innerText = `Tahun: ${ parseInt(book.year)}`;

  const actionContainer = document.createElement('div');

  const toggleButton = document.createElement('button');
  toggleButton.innerText = book.isComplete ? 'Belum Selesai' : 'Selesai Dibaca';
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.addEventListener('click', () => toggleBookCompletion(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus Buku';
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.addEventListener('click', () => removeBook(book.id));

  actionContainer.appendChild(toggleButton);
  actionContainer.appendChild(deleteButton);

  bookItem.appendChild(titleElement);
  bookItem.appendChild(authorElement);
  bookItem.appendChild(yearElement);
  bookItem.appendChild(actionContainer);

  return bookItem;
}

// Event listener for adding a new book
document.getElementById('bookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  try {
    if (!title || !author || !year) {
      throw new Error('Semua field harus diisi!');
    }
    addBook(title, author, year, isComplete);
    this.reset(); // Reset form
  } catch (error) {
    alert(error.message); // Error handling
  }
});

// Event listener for searching books
document.getElementById('searchBook').addEventListener('submit', function (e) {
  e.preventDefault();
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const books = loadBooks();
  const searchResults = books.filter(book => book.title.toLowerCase().includes(searchTitle));

  const incompleteBookList = document.getElementById(INCOMPLETE_BOOK_LIST_ID);
  const completeBookList = document.getElementById(COMPLETE_BOOK_LIST_ID);

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  searchResults.forEach(book => {
    const bookElement = makeBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
});

// Initial render of books when the page loads
document.addEventListener('DOMContentLoaded', function () {
  renderBooks();
});
