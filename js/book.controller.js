'use strict'

function onInit() {
  renderFilterByQueryStringParams()
  renderBooks()
  loadFromStorage(STORAGE_KEY)
  renderButtons()
  markPage()
}

function onSetFilterBy(name, elFilter) {
  if (name === 'min-price') {
    document.querySelector('.min-price').innerHTML = elFilter
    setBookFilter({ price: elFilter })
  } else if (name === 'min-rate') {
    document.querySelector('.min-rate').innerHTML = elFilter
    setBookFilter({ rate: elFilter })
  } else if (name === 'search-box') {
    setBookFilter({ searchBox: elFilter })
  }
  renderBooks()
}

function onNextPage() {
  nextPage()
  markPage()
  renderBooks()
}

function onPrevPage() {
  prevPage()
  markPage()
  renderBooks()
}

function onSetSortBy(name) {
  var sortBy = {}
  var key = document.querySelector('.sort-by').value
  if (!name) {
    sortBy = {
      [key]: 1,
    }
  } else {
    sortBy = {
      [name]: 1,
    }
  }
  setBookSort(sortBy)
  renderBooks()
}

function onSetRate(elBtn) {
  setRate(elBtn)
  document.querySelector('.curr-rate').innerHTML = gCurrBook.rate
  renderBooks()
}

function OnReadBook(bookId) {
  const book = getBookById(bookId)
  var gCurrBook = book
  document.querySelector('.desc').innerHTML = book.description
  document.querySelector('.curr-rate').innerHTML = gCurrBook.rate
  document.querySelector('.modal').classList.remove('hide')
}

function onCloseModal() {
  document.querySelector('.modal').classList.add('hide')
}

function onUpdateBook(bookId) {
  var bookPrice = +prompt('What is your current Price for this book?')
  if (!bookPrice) return
  updateBook(bookId, bookPrice)
  renderBooks()
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
}

function OnAddBook() {
  addBook()
  renderBooks()
}

function renderBooks() {
  var books = getBooksForDisplay()
  const strHTML = books.map(
    (book) => `<tr><td class="id">${book.id}</td>
    <td class="title">${book.title}</td>
    <td class="rate-tag">${book.rate}</td>
    <td class="price-tag">$${book.price}</td>
    <td>
    <button class="read-button " onclick="OnReadBook('${book.id}')">Read</button>
    <button class="update-button " onclick="onUpdateBook('${book.id}')">Update</button>
    <button class="remove-button " onclick="onRemoveBook('${book.id}')">Delete</button>
    </td>
    </tr>`
  )
  document.querySelector('.book-desc').innerHTML = strHTML.join('')
}

function renderFilterByQueryStringParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const filterBy = {
    price: queryStringParams.get('price') || 0,
    rate: queryStringParams.get('rate') || 0,
    searchBox: queryStringParams.get('searchBox') || ''
  }

  if (!filterBy.price && !filterBy.rate && !filterBy.searchBox) return

  document.querySelector('[name="min-price"]').value = filterBy.price
  document.querySelector('.min-price').innerHTML = filterBy.price
  document.querySelector('[name="min-rate"]').value = filterBy.rate
  document.querySelector('.min-rate').innerHTML = filterBy.rate
  document.querySelector('[name="search-box"]').innerHTML = filterBy.searchBox
  document.querySelector('.search').innerHTML = filterBy.searchBox

  setBookFilter(filterBy)
}

function renderButtons() {
  var elDiv = document.querySelector('.page-div')
  var strsHTML = `<button class="prev-page btn" onclick="onPrevPage()" disabled>
  &#171;
</button><div class="page-numbers">`
  for (var i = 0; i < Math.floor(gBooks.length / PAGE_SIZE); i++) {
    strsHTML += `<div class="page-number div-${i + 1}" onclick="onClickDiv(this)">${i + 1}</div>`
  }
  strsHTML += `</div><button class="next-page btn" onclick="onNextPage()">&#187;</button>`
  elDiv.innerHTML = strsHTML
}

function unMarkPage() {
  document.querySelector(`.div-${prevMark}`).classList.remove('curr-page')
}

function markPage() {
  var currClicked = document.querySelector(`.div-${gPageIdx}`)
  currClicked.classList.add('curr-page')


}

function onClickDiv(elDiv) {
  clickDiv(elDiv.innerHTML)
  renderBooks()
  markPage()
}
