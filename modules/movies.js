// Lägger in html på sidan för att visa alla filmer.
export function ShowMovieTable() {
    document.getElementById('mainContent').innerHTML = GetMovieTable();
}

// Lägger in html på sidan för att visa en specifik film
export function ShowMovie(movieID) {
    let main = document.getElementById('mainContent');
    main.innerHTML = GetMovieHTML(movieID);
    main.insertAdjacentHTML('afterbegin', '<button onclick="ShowMovieTable()">Return</button>');
}

// Laddar in alla filmer till sessionStorage. 
// Ser även till så att alla de andra funktionerna
// för att ladda in information blir körda.
export function LoadInMovies() {
    console.log('Fetching Movies');
    setTimeout(LoadInMovies, 600000);
    fetch('https://localhost:5001/api/film')
        .then((response) => { return response.json(); })
        .then((json) => { 
            sessionStorage.setItem('movies', JSON.stringify(json)); 
            LoadInTrivias();
        });
}

// Markerar en film som utlånad via en PUT request
export function BorrowMovie(movieID) {
    let movie = JSON.parse(sessionStorage.getItem('movies')).find(x => x.id == movieID);
    let borrower = JSON.parse(localStorage.getItem('loggedIn'));

    if (borrower === null || borrower == 'undefined') {
        alert("Du måste vara inloggad för att få låna filmer!!");
    }
    else if (movie.stock < 1) {
        alert(`${movie.name} finns inte tillgänglig för närvarande.`);
    }
    else {

        let borrowAction = { 
            'filmId': movie.id, 
            'studioId': borrower.id, 
            'returned': false
        };

        fetch('https://localhost:5001/api/rentedFilm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(borrowAction)
        })
        .then((response) => { return response.json(); })
        .then((data) => {
            console.log('Success: ', data);
            alert(`Du har lånat "${movie.name}"!`);
        })
        .catch(
            (error) => { console.log('Error: ', error); }
        );

        LoadInMovies();
        setTimeout(ShowMovieTable, 500);
    }
}

// Markerar en film som återlämnad via en PUT request
export function ReturnMovie(borrowedID) {
    let borrowedMovies = JSON.parse(sessionStorage.getItem('borrowedMovies'));
    let movieToChange = borrowedMovies.find(x => x.id == borrowedID);

    movieToChange.returned = true;
    console.log(JSON.stringify(movieToChange));

    fetch('https://localhost:5001/api/rentedFilm/' + borrowedID, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movieToChange)
    })
    .then((response) => { return response.json(); })
    .then((data) => {
        console.log('Success: ', data);
        alert('Filmen är återlämnad.');
        setTimeout(LoadInMovies, 150);
        setTimeout(ShowAccount, 200);
    })
    .catch((error) => {
        console.log('Error: ', error);
        alert('Filmen är återlämnad.');
        setTimeout(LoadInMovies, 150);
        setTimeout(ShowAccount, 200);
    });
}

// Lägger till en film till apiet via en POST request
export function AddMovie() {
    let title = document.getElementById('movieTitle').value;
    let initialStock = document.getElementById('initialStock').value;    

    let newMovie = { "name": title, "stock": Number(initialStock) };
    console.log(newMovie);

    fetch('https://localhost:5001/api/film', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMovie)
    })
    .then((response) => { return response.json(); })
    .then((json) => {
        console.log('Success: ', json);
        LoadInMovies();
        setTimeout(ShowMovieTable, 300);
    })
    .catch((error) => { 
        console.log('Error: ', error);
        LoadInMovies();
    });
}

// Lägger till ett trivia objekt till en viss film via POST
export function AddTrivia(movieID) {
    let currentUser = JSON.parse(localStorage.getItem('loggedIn'));

    if (currentUser !== null) {
        if (!currentUser.verified) {
            alert('Du måste ha ett verifierat konto för att göra detta.');
        }
        else {
            let triviaContents = prompt("Skriv in trivian.");
    
            if (triviaContents !== null || triviaContents !== "") {
                let trivia = { "filmId": movieID, "trivia": triviaContents };
    
                fetch('https://localhost:5001/api/filmtrivia', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(trivia)
                })
                .then((response) => { return response.json(); })
                .then((data) => {
                    console.log('Success: ', data);
                    LoadInMovies();
                    setTimeout(ShowMovie, 150, movieID);
                })
                .catch((error) => {
                    console.log('Error: ', error);
                });
            }
        }

    }
    else {
        alert('Du måste vara inloggad för att göra detta');
    }
}

// Laddar in alla trivias till deras respektive filmer i sessionstorage
function LoadInTrivias() {
    console.log('Fetching Trivias');
    fetch('https://localhost:5001/api/filmTrivia/')
        .then((response) => { return response.json(); })
        .then((json) => {
            let movies = JSON.parse(sessionStorage.getItem('movies'));
            movies.forEach((movie) => { movie['trivia'] = []; });

            // console.log(json);
            // console.log(movies);

            for (let i = 0; i < json.length; i++) {
                let trivia = json[i];
                // console.log('Added trivia: ');
                // console.log(trivia);
                let movie = movies.find(x => x.id == trivia.filmId);
                movie.trivia.push(trivia.trivia);
                // console.log(movie);
            }
            
            // console.log(movies);
            sessionStorage.setItem('movies', JSON.stringify(movies));

            LoadInBorrowedMovies();
        });
}

// Laddar in alla utlånade filmer till sessionStorage
function LoadInBorrowedMovies() {
    fetch('https://localhost:5001/api/rentedFilm')
    .then((response) => { return response.json(); })
    .then((data) => {
        sessionStorage.setItem('borrowedMovies', JSON.stringify(data));
        
        UpdateStock();
    });
}

// Uppdaterar filmernas stock baserat på hur många
// som är utlånade
function UpdateStock() {
    let movies = JSON.parse(sessionStorage.getItem('movies'));
    let borrowedMovies = JSON.parse(sessionStorage.getItem('borrowedMovies'));

    if (movies === null || borrowedMovies === null) {
        return LoadInMovies();
    }

    borrowedMovies.forEach((borrowed) => {
        if (!borrowed.returned) {
            let movie = movies.find(x => x.id == borrowed.filmId);
            // console.log(movie);
            if (movie != 'undefined' || movie !== null) {
                movie.stock -= 1;
            }
        }
    });

    console.log(movies);
    sessionStorage.setItem('movies', JSON.stringify(movies));
}

// Returnerar HTML för att visa en tabell med alla filmer samt 
// knappar för att se mer om en specifik film
function GetMovieTable() {
    let tableContent = '';
    let movies = JSON.parse(sessionStorage.getItem('movies'));
    
    movies.forEach((movie) => {
        tableContent += `
            <tr>
                <td>${movie.name}</td>
                <td>
                    <button onclick="ShowMovie(${movie.id});">
                        Se mer
                    </button>
                </td>
            </tr>`;
    });

    let movieHTML = `
        <table class="movieTable">
            <thead>
                <tr>
                    <th>Film</th>
                    <th>Se mer</th>
                </tr>
            </thead>
            <tbody>
                ${tableContent}
            </tbody>
        </table>`; 

    return movieHTML;
}

// Returnerar HTML för att visa en specifik film
function GetMovieHTML(movieID) {
    let movies = JSON.parse(sessionStorage.getItem('movies'));
    // console.log(movies);
    let movie = movies.find(x => x.id == movieID);
    let triviaElements = `
        <button onclick="AddTrivia(${movieID})">Lägg till en trivia!</button>
    `;

    let triviaList = `
        <p>
            Ingen trivia tillgänglig.
        </p>
    `;
    
    if (movie.trivia.length !== 0) {
        movie.trivia.forEach((trivia) => {
            triviaElements += `
                <li>
                   ${trivia}
                </li>
            `;
        });
    }

    triviaList = `
        <ul class="triviaList">
            ${triviaElements}
        </ul>
    `;

    let borrowButton;
    if (movie.stock !== null && movie.stock > 0) {
        borrowButton = `
            <button onclick="BorrowMovie(${movie.id})">Låna ${movie.name}</button>
        `;
    }
    else {
        borrowButton = `<div>Tyvärr finns det inga tillgängliga exemplar av den här filmen.</div>`;
    }
    

    let movieHTML = `
        <div class="movieCover" style="background-color: ${GetRandomColour()}">
            <img src="./assets/${movie.id}.jpg" alt="Cover of ${movie.name}">
        </div>
        
        <div class="movieDisplay">
            <h2>${movie.name} - (${movie.stock} exemplar kvar)</h2>
            <div>${borrowButton}</div>
            <div>${triviaList}</div>
        </div>
    `;

    return movieHTML;
}

// Slumpar fram en bakgrundsfärg för att använda som omslag
// ifall det inte finns en bild tillgänglig.
// Bilderna är upp till backend att skaffa fram.
function GetRandomColour() {
    let colours = ["Aliceblue", "Green", "Red", "Yellow"];

    return colours[Math.floor((Math.random() * colours.length))];
}