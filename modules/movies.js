export function ShowMovieTable() {
    document.getElementById('mainContent').innerHTML = GetMovieTable();
}

export function ShowMovie(movieID) {
    let main = document.getElementById('mainContent');
    main.innerHTML = GetMovieHTML(movieID);
    main.insertAdjacentHTML('afterbegin', '<button onclick="ShowMovieTable()">Return</button>');
}

export function LoadInMovies() {
    fetch('https://localhost:5001/api/film')
        .then((response) => { return response.json(); })
        .then((json) => { sessionStorage.setItem('movies', JSON.stringify(json)); });

    setTimeout(LoadInTrivias, 150);
}

function LoadInTrivias() {
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
        });
}

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

function GetMovieHTML(movieID) {
    let movies = JSON.parse(sessionStorage.getItem('movies'));
    // console.log(movies);
    let movie = movies.find(x => x.id == movieID);
    let triviaElements = '';
    let triviaList = '<p>No trivias available</p>';
    
    if (movie.trivia.length !== 0) {
        movie.trivia.forEach((trivia) => {
            triviaElements += `
                <li>
                   ${trivia}
                </li>
            `;
        });
        triviaList = `
            <ul>
                ${triviaElements}
            </ul>
        `;
    }
    

    let movieHTML = `
        <div class="movieCover" style="background-color: ${GetRandomColour()}">
            <img src="./assets/${movie.id}.jpg" alt="Cover of ${movie.name}">
        </div>
        <h2>${movie.name}</h2>
        ${triviaList}
    `;

    return movieHTML;
}

function GetRandomColour() {
    let colours = ["Aliceblue", "Green", "Red", "Yellow"];

    return colours[Math.floor((Math.random() * colours.length))];
}