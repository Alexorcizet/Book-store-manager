'use strict'

const STORAGE_KEY = 'booksDB'
const PAGE_SIZE = 5

var gBooks
var gPageIdx = 1
var prevMark = 1
var gFilterBy = {
    price: 0,
    rate: 0,
    searchBox: '',
}

var randomNames = ['Harry Potter 1', 'Harry Potter 2', 'Harry Potter 3',
    'Harry Potter 4', 'Harry Potter 5', 'Harry Potter 6', 'Harry Potter 7', 'LOTR 1', 'LOTR 2', 'LOTR 3',
    'World of Warcraft 1', 'World of Warcraft 2', 'World of Warcraft 3', 'World of Warcraft 4',
    'World of Warcraft 5', 'World of Warcraft 6', 'World of Warcraft 7', 'World of Warcraft 8',]


_creatbooks(64)

function clickDiv(input) {
    gPageIdx = +input
    unMarkPage()
    prevMark = gPageIdx
    setPage()
}

function setPage() {
    markPage()
    if (gPageIdx > 1) {
        document.querySelector('.prev-page').disabled = false
    } else {
        document.querySelector('.prev-page').disabled = true
    }

    if (gPageIdx === Math.floor(gBooks.length / PAGE_SIZE)) {
        document.querySelector('.next-page').disabled = true
    } else {
        document.querySelector('.next-page').disabled = false
    }
}

function nextPage() {
    gPageIdx++
    setPage()
    unMarkPage()
    prevMark = gPageIdx

}

function prevPage() {
    gPageIdx--
    setPage()
    unMarkPage()
    prevMark = gPageIdx
}

function setNameAtt() {
    return 'search-box'
}

function getInput(ev) {
    ev.preventDefault()
    var input = document.querySelector('[name=search-box]')
    return input.value
}

function getBooksForDisplay() {
    var books = gBooks.filter(book => (+book.price >= +gFilterBy.price) &&
        (+book.rate >= +gFilterBy.rate) && (book.title.includes(gFilterBy.searchBox)))
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function setBookFilter(filterBy) {
    if (filterBy.price !== undefined) gFilterBy.price = +filterBy.price
    if (filterBy.rate !== undefined) gFilterBy.rate = +filterBy.rate
    if (filterBy.searchBox !== undefined) gFilterBy.searchBox = filterBy.searchBox

    const queryStringParams = `?price=${gFilterBy.price}&rate=${gFilterBy.rate}&searchBox=${gFilterBy.searchBox}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

    return gFilterBy
}

function setBookSort(sortBy = {}) {
    if (sortBy.maxPrice !== undefined) {
        gBooks.sort((book1, book2) => (book2.price - book1.price))

    } else if (sortBy.maxRate !== undefined) {
        gBooks.sort((book1, book2) => (book2.rate - book1.rate))
    }

}

function setRate(elBtn) {
    var book = getBookById(gCurrBook.id)
    if (elBtn.innerText === '-') {
        if (!book.rate) return
        book.rate--
    }
    else {
        if (book.rate === 10) return
        book.rate++
    }
    _saveBooksToStorage()
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, bookPrice) {
    var bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks[bookIdx].price = bookPrice
    _saveBooksToStorage()
}

function addBook() {
    var getBookName = prompt("Enter a book name")
    var getPrice = prompt("Enter the book\'s price")
    if (!getBookName || !getPrice) {
        alert('Not all required filleds were filled')
        return
    }
    gBooks.push(_creatbook(getBookName, getPrice))
    _saveBooksToStorage()

}

function _creatbooks(length) {
    var books = loadFromStorage(STORAGE_KEY)
    if (!books || !books.length) {
        books = []
        for (var i = 0; i < length; i++) {
            books.push(_creatbook())
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function _creatbook(name = drawNum(randomNames), price = getRandomIntInclusiveFloat(5, 100)) {
    return {
        id: makeId(length = 5),
        title: name,
        price: price,
        rate: getRandomIntInclusive(0, 10),
        description: makeLorem(150),
    }
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}
/////////////////////////////////////////Future i18n books////////////////////////////////////
//var gHeBooks
// _creatHeBooks(64)
    // var currLangBooks
    // if (gCurrLang === 'en') currLangBooks === 
    // else currLangBooks = gHeBooks
// var randomHeNames = ['מוטי המלך', 'שמוליק החמור', 'יובל המבולבל', 'דויד המגדויד', 'הראל המחבל']
// function _creatHeBooks(length) {
//     // var heBooks = loadFromStorage(STORAGE_KEY)
//     if (!gHeBooks || !gHeBooks.length) {
//         gHeBooks = []
//         for (var i = 0; i < length; i++) {
//             gHeBooks.push(_creatbook(name = drawNum(randomHeNames)))
//         }
//     }
//     gHeBooks
//     console.log('heBooks:', gHeBooks)
//     // _saveBooksToStorage()
// }