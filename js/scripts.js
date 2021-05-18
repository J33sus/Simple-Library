let searchBook = document.getElementById('search-book');
let bookContainer = document.getElementById('container-books');

function addBook(book) {
	// Main container
	let myBook = document.createElement('div');
	myBook.className = 'book';

	// Image container (left)
	let bookImage = document.createElement('img');
	if(!book.volumeInfo.imageLinks) {
		bookImage.src = './images/unknown.png';
	}
	else bookImage.src = book.volumeInfo.imageLinks.thumbnail;

	let bookImgContainer = document.createElement('div');
	bookImgContainer.className = 'book-image';
	bookImgContainer.appendChild(bookImage);
	myBook.appendChild(bookImgContainer);

	// Title book
	let bookTitle = document.createElement('h2');
	bookTitle.innerText = book.volumeInfo.title;
	bookTitle.className = 'book-info--title';

	// Prepare description
	if(!book.volumeInfo.description) {
		book.volumeInfo.description = 'Sin descripción.';
	}
	let bookDescription = document.createElement('p');
	if(book.volumeInfo.description.length > 600) {
		book.volumeInfo.description = book.volumeInfo.description.slice(0, 600);
		book.volumeInfo.description += '...';
	}
	bookDescription.innerText = book.volumeInfo.description;
	bookDescription.className = 'book-info--description';

	// Subcontainer btn preview
	let bookPreviewBox = document.createElement('div');
	bookPreviewBox.className = 'book-info--preview-box';

	let bookPreviewBtn = document.createElement('a');
	bookPreviewBtn.href = book.volumeInfo.previewLink;
	bookPreviewBtn.innerText = 'Ver libro';
	bookPreviewBtn.target = '_blank';
	bookPreviewBtn.className = 'book-info--preview';

	bookPreviewBox.appendChild(bookPreviewBtn);

	// Info container
	let bookInfoContainer = document.createElement('div');
	bookInfoContainer.className = 'book-info';
	bookInfoContainer.appendChild(bookTitle);
	bookInfoContainer.appendChild(bookDescription);
	bookInfoContainer.appendChild(bookPreviewBox);
	myBook.appendChild(bookInfoContainer);

	bookContainer.appendChild(myBook);
}

function bookSearch(name) {
	// Find book name
	fetch(`https://www.googleapis.com/books/v1/volumes?q=${name.replace(' ', '+')}&langRestrict=es&projection=lite&maxResults=15`)
	.then(response => response.json()).then(data => {	
		// Remove old books
		bookContainer.innerHTML = "";

		if(!data.items) alert('Sin resultados');
		else for (const book of data.items) addBook(book);
	});
}

function bookSearchCategory(category) {
	// Find book category
	fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${category.replace(' ', '+')}&langRestrict=es&maxResults=15`)
	.then(response => response.json()).then(data => {	
		// Remove old books
		bookContainer.innerHTML = "";

		if(!data.items) alert('Sin resultados');
		else for (const book of data.items) addBook(book);
	});
}

searchBook.addEventListener('keydown', function(event) {
	if (event.defaultPrevented) return;

	var key = event.key || event.keyCode;
	if(key === 'Enter' || key === 13 && searchBook.value.length >= 1) {
		event.preventDefault();
		bookSearch(searchBook.value);
	}
});