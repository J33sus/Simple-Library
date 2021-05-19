// Get elements
let searchBook = document.getElementById('l_search-book');
let bookContainer = document.getElementById('container-books');
let loadingBooks = document.getElementById('modal-loading-books');

// My lang info
let langInfo = {
	'es': {
		'title': 'Libreria',
		'animals': 'Animales',
		'fiction': 'Ciencia Ficción',
		'fantasy': 'Fantasía',
		'mystery': 'Misterio',
		'love': 'Romance',
		'suspense': 'Suspenso',
		'search-book': 'Buscar libro...',
		'obtain_books': 'obteniendo lista de libros',
		'footer': 'Libreria ® 2021'
	}
}, langActual_page = 'en';

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

function bookProccessCallback(data) {
	// Hide modal
	loadingBooks.style.display = '';

	if(!data.items) alert('Sin resultados');
	else for (const book of data.items) addBook(book);
}

function bookSearchName(name) {
	// Remove old books and show modal
	bookContainer.innerHTML = '';
	loadingBooks.style.display = 'block';

	// Find book name
	fetch(`https://www.googleapis.com/books/v1/volumes?q=${name.replace(' ', '+')}&langRestrict=${langActual_page}&projection=lite&maxResults=15`)
	.then(response => response.json()).then(data => bookProccessCallback(data));
}

function bookSearchCategory(category) {
	// Remove old books and show modal
	bookContainer.innerHTML = '';
	loadingBooks.style.display = 'block';

	// Find book category
	fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${category.id.substr(2, category.length)}&langRestrict=${langActual_page}&maxResults=15`)
	.then(response => response.json()).then(data => bookProccessCallback(data));
}

// Search book input
searchBook.addEventListener('keydown', function(event) {
	if (event.defaultPrevented) return;

	var key = event.key || event.keyCode;
	if(key === 'Enter' || key === 13 && searchBook.value.length >= 1) {
		event.preventDefault();
		bookSearchName(searchBook.value);
	}
});

function setPageLanguage(lang) {
	// Is saved my default page lang?
	if(langInfo[langActual_page] != lang) {
		// Is available?
		if(langInfo[langActual_page] == undefined) {
			langInfo[langActual_page] = {};

			// Obtain main lenguage from page
			for(const prop  in langInfo['es']) {
				let elem = document.getElementById(`l_${prop}`);

				if(prop == 'search-book') langInfo[langActual_page][prop] = elem.placeholder;
				else langInfo[langActual_page][prop] = elem.innerText;
			}
		}
		// Update page
		for(const prop  in langInfo[lang]) {
			let elem = document.getElementById(`l_${prop}`);

			if(prop == 'search-book') elem.placeholder = langInfo[lang][prop];
			else elem.innerText = langInfo[lang][prop];
		}

		// Hide all flags
		for(const prop  in langInfo) {
			document.getElementById(`header-language-${prop}`).style.display = 'none';
		}

		// Set new lang
		langActual_page = lang;
		localStorage.setItem('language', lang);
		document.getElementById(`header-language-${lang}`).style.display = 'block';
	}
}

window.addEventListener('load', function(event) {
	// Add event on click
	document.getElementById('header-language-en').addEventListener('click', () => {
		setPageLanguage('es');
	});
	document.getElementById('header-language-es').addEventListener('click', () => {
		setPageLanguage('en');
	});

	// Update page lang
	setPageLanguage(localStorage.getItem('language'));
});