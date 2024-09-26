// Constants for localStorage key and shelf IDs
const STORAGE_KEY = 'BOOKSHELF_APPS';
const INCOMPLETE_BOOK_LIST_ID = 'incompleteBookList';
const COMPLETE_BOOK_LIST_ID = 'completeBookList';

// Load books from localStorage
let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Function to save books to localStorage
function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Function to generate a unique ID
function generateId() {
  return +new Date();
}

// Function to create a book object
function createBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  };
}

// Function to render a book item
function createBookElement(book) {
  const bookItem = document.createElement('div');
  bookItem.classList.add('book_item');
  bookItem.dataset.bookid = book.id;
  bookItem.dataset.testid = 'bookItem';

  const title = document.createElement('h3');
  title.textContent = book.title;
  title.dataset.testid = 'bookItemTitle';

  const author = document.createElement('p');
  author.textContent = `Penulis: ${book.author}`;
  author.dataset.testid = 'bookItemAuthor';

  const year = document.createElement('p');
  year.textContent = `Tahun: ${book.year}`;
  year.dataset.testid = 'bookItemYear';

  const actionButtons = document.createElement('div');

  const toggleButton = document.createElement('button');
  toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.dataset.testid = 'bookItemIsCompleteButton';
  toggleButton.addEventListener('click', () => toggleBookStatus(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Hapus Buku';
  deleteButton.dataset.testid = 'bookItemDeleteButton';
  deleteButton.addEventListener('click', () => removeBook(book.id));

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit Buku';
  editButton.dataset.testid = 'bookItemEditButton';
  editButton.addEventListener('click', () => editBook(book.id));

  actionButtons.append(toggleButton, deleteButton, editButton);
  bookItem.append(title, author, year, actionButtons);

  return bookItem;
}

// Function to add a book
function addBook() {
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const id = generateId();
  const newBook = createBook(id, title, author, year, isComplete);
  books.push(newBook);

  const bookList = document.getElementById(isComplete ? COMPLETE_BOOK_LIST_ID : INCOMPLETE_BOOK_LIST_ID);
  bookList.append(createBookElement(newBook));

  saveBooks();
  document.getElementById('bookForm').reset();
}

// Function to toggle book status
function toggleBookStatus(id) {
  const bookIndex = books.findIndex(book => book.id === id);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    const book = books[bookIndex];
    const oldList = document.getElementById(book.isComplete ? INCOMPLETE_BOOK_LIST_ID : COMPLETE_BOOK_LIST_ID);
    const newList = document.getElementById(book.isComplete ? COMPLETE_BOOK_LIST_ID : INCOMPLETE_BOOK_LIST_ID);
    
    const bookElement = document.querySelector(`[data-bookid="${id}"]`);
    oldList.removeChild(bookElement);
    newList.append(createBookElement(book));

    saveBooks();
  }
}

// Function to remove a book
function removeBook(id) {
  const bookIndex = books.findIndex(book => book.id === id);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    const bookElement = document.querySelector(`[data-bookid="${id}"]`);
    bookElement.remove();
    saveBooks();
  }
}

// Function to edit a book
function editBook(id) {
  const book = books.find(book => book.id === id);
  if (book) {
    document.getElementById('bookFormTitle').value = book.title;
    document.getElementById('bookFormAuthor').value = book.author;
    document.getElementById('bookFormYear').value = book.year;
    document.getElementById('bookFormIsComplete').checked = book.isComplete;

    const submitButton = document.getElementById('bookFormSubmit');
    submitButton.textContent = 'Edit Buku';
    submitButton.onclick = function(e) {
      e.preventDefault();
      book.title = document.getElementById('bookFormTitle').value;
      book.author = document.getElementById('bookFormAuthor').value;
      book.year = parseInt(document.getElementById('bookFormYear').value);
      book.isComplete = document.getElementById('bookFormIsComplete').checked;

      const bookElement = document.querySelector(`[data-bookid="${id}"]`);
      bookElement.replaceWith(createBookElement(book));

      saveBooks();
      document.getElementById('bookForm').reset();
      submitButton.textContent = 'Masukkan Buku ke rak';
      submitButton.onclick = addBook;
    };
  }
}

// Function to search books
function searchBooks() {
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const allBooks = document.querySelectorAll('[data-testid="bookItem"]');

  allBooks.forEach(bookItem => {
    const title = bookItem.querySelector('[data-testid="bookItemTitle"]').textContent.toLowerCase();
    if (title.includes(searchTitle)) {
      bookItem.style.display = 'block';
    } else {
      bookItem.style.display = 'none';
    }
  });
}

// Function to render all books
function renderBooks() {
  const incompleteList = document.getElementById(INCOMPLETE_BOOK_LIST_ID);
  const completeList = document.getElementById(COMPLETE_BOOK_LIST_ID);

  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  books.forEach(book => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeList.append(bookElement);
    } else {
      incompleteList.append(bookElement);
    }
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  renderBooks();

  const bookForm = document.getElementById('bookForm');
  bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById('searchBook');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchBooks();
  });
});