// Funktion som samlar in data från sidan
// sedan skickar den till en annan funktion för validering av datan.
export function Login() {
    let userName = document.getElementById('userName');
    let password = document.getElementById('password');

    CheckLoginInfo(userName, password);
}

// Funktion som resetar ens status som inloggad.
export function Logout() {
    localStorage.removeItem('loggedIn');
    LoadNavBar();
    ShowMovieTable();

    document.getElementById('mainContent').insertAdjacentHTML(
        'afterbegin',
        `<div id="logoutConfirmation">Du har loggats ut</div>`
    );

    let logoutConfirmation = document.getElementById('logoutConfirmation');
    setTimeout(() => { logoutConfirmation.parentElement.removeChild(logoutConfirmation); }, 4000);
}

// Funktion som samlar in data från sidan och sedan
// POSTar upp det till apiet
export function Register() {
    let userName = document.getElementById('userName');
    let password = document.getElementById('password');

    let data = { "name": userName.value, "password": password.value, "verified": false };

    fetch('https://localhost:5001/api/filmstudio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => { return response.json(); })
    .then((data) => {
        console.log('Success: ', data);
        LoadInPendingUsers();
    })
    .catch(
        (error) => { console.log('Error: ', error); }
    );
    
    userName.value = "";
    password.value = "";

    ShowLogin();
}

// Funktion som samlar in all nödvändig information 
// för att visa en användares konto, och sedan visar det.
export function ShowAccount() {
    LoadInPendingUsers();
    LoadInAllUsers();
    let main = document.getElementById('mainContent');
    main.innerHTML = GetAccountHTML();
}

// Funktion som verifierar en användare och uppdaterar den i apiet
export function VerifyUser(userID) {
    let pendingUsers = JSON.parse(sessionStorage.getItem('pendingUsers'));
    let user = pendingUsers.find(x => x.id == userID && !x.verified);
    user.verified = true;
    // console.log(JSON.stringify(user));

    fetch('https://localhost:5001/api/filmstudio/' + userID, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then((response) => { return response.json(); })
    .then((json) => {
        console.log('Success: ', json);
        SendEmailToVerifiedUser(user);
        LoadInPendingUsers();
    })
    .catch((error) => { 
        console.log('Error: ', error); 
        LoadInPendingUsers();
        SendEmailToVerifiedUser(user);
    });
}

// Samlar in och populerar den HTML som behövs för att 
// visa en användares konto.
function GetAccountHTML() {
    let account = JSON.parse(localStorage.getItem('loggedIn'));
    let accountHTML;

    if (account !== null) {
        let unVerified = (account.verified == false) ? "inte" : "";
        let borrowedMoviesAmount = GetBorrowedMovieAmount(account.id);

        let borrowedMoviesHTML = (borrowedMoviesAmount > 0) 
            ? `<ul style="list-style: none;">
                ${GetBorrowedMovies(account.id)}
            </ul>`
            : "" ;

        let amountPhrase = (borrowedMoviesAmount > 0) 
            ? `Du har lånat ${borrowedMoviesAmount} film(er).`
            : 'Du har inte lånat några filmer.';

        accountHTML = `
            <br>
            <div class="accountPage">
                <div id="accountInfo">
                    <h2>${account.name}</h2>
                    <div>Ditt konto är ${unVerified} verifierat.</div>
                </div>
                <div>
                    <p>
                        ${amountPhrase}
                    </p>
                    <p>
                        Klicka på knappen för att lämna tillbaka filmen.
                    </p>

                    ${borrowedMoviesHTML}
                </div>
            </div>
        `;

        if (IsUserAdmin(account)) {
            
            accountHTML += GetAdminActions();
        }

        return accountHTML;
    }
    else {
        ShowMovieTable();
    }
}

// Enkel funktion som kontrollerar ifall en användare är administratör
// För närvarande kollar den bara ifall användarens namn är 'Uddebo'
// Men detta skulle enkelt kunna uppdateras ifall man lägger till
// Mer information i apiet.
function IsUserAdmin(user) {
    return user.name === 'Uddebo';
}

// Hämtar all information för administratörer. 
// Den är uppdelad i flera funktioner för att kunna ge 
// olika privilegier till olika användare i framtida 
// iterationer av apiet.
function GetAdminActions() {
    let adminActionsHTML = '';

    adminActionsHTML += GetMovieForm();
    adminActionsHTML += GetPendingUsers();
    adminActionsHTML += GetAllBorrowed();

    return adminActionsHTML;
}

// Returnerar HTML för att lägga till en film samt antal licenser
function GetMovieForm() {
    let html = `
        <div class="accountPage">
            <div><h3>Lägg till en ny film i systemet</h3>
            <input id="movieTitle" type="text" placeholder="Filmtitel">
            <br>
            <input id="initialStock" type="number" min="1" value="1">
            <br><br>
            <button onclick="AddMovie()">Lägg till film</button>
        </div>
    `;
    return html;
}

// Laddar in overifierade användare till sessionStorage
// så att de enkelt kan hämtas senare
function LoadInPendingUsers() {
    fetch('https://localhost:5001/api/filmstudio')
    .then((response) => { return response.json(); })
    .then((json) => {
        let pendingUsers = [];

        json.forEach((item) => {
            if (!item.verified) {
                pendingUsers.push(item);
            }
        });

        sessionStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));
    });
}

// Returnerar HTML för att kunna verifiera användare.
function GetPendingUsers() {
    let pendingUsers = JSON.parse(sessionStorage.getItem('pendingUsers'));
    let userList = '';
    console.log(pendingUsers);

    if (pendingUsers === null || pendingUsers.length < 1) {
        userList = 'Det finns inga overifierade användare för närvarande';
    }
    else if (pendingUsers.length === 1) {
        let user = pendingUsers[0];
        userList += `
                <li>
                    <button onclick="VerifyUser(${user.id})">
                        Verifiera ${user.name}
                    </button>
                </li>
            `;
    }
    else {
        pendingUsers.forEach((user) => {
            userList += `
                <li>
                    <button onclick="VerifyUser(${user.id})">
                        Verifiera ${user.name}
                    </button>
                </li>
            `;
        });
    }
    
    let html = `
        <div class="accountPage">
            <h3>Overifierade användare</h3>
            <ul>
                ${userList}
            </ul>
        </div>
    `;
    
    return html;
}

// Laddar in alla användare till sessionStorage
// så att de enkelt kan användas senare
function LoadInAllUsers() {
    fetch('https://localhost:5001/api/filmstudio')
    .then((response) => { return response.json(); })
    .then((data) => {
        sessionStorage.setItem('users', JSON.stringify(data));
    })
}

// Returnerar HTML för att se vilka studior som har lånat vilka filmer
// samt att markera dessa filmer som återlämnade
function GetAllBorrowed() {
    let users = JSON.parse(sessionStorage.getItem('users'));
    let borrowedMoviesList = '';

    users.forEach((user) => {
        let borrowedMovies = `
            <li> 
                Den här användaren har inte hyrt några filmer.
            </li>
        `;

        if (GetBorrowedMovieAmount(user.id) > 0) {
            borrowedMovies = GetBorrowedMovies(user.id);
        }
        
        borrowedMoviesList += `
            <li>
                <h4>${user.name}</h4>
            </li>
            ${borrowedMovies}
        `;
    });

    let html = `
        <h3>Här är alla filmstudior och deras lånade filmer</h3>
        <div>
            Som administratör kan du markera filmerna som återlämnade genom att klicka på knappen.
        </div>
        <ul>
            ${borrowedMoviesList}
        </ul>
    `;

    return html;
}

// Returnerar HTML för att visa alla utlånade filmer från en specifik studio
// med hjälp av en studios ID
function GetBorrowedMovies(accountID) {
    let borrowed = JSON.parse(sessionStorage.getItem('borrowedMovies'));
    let movies = JSON.parse(sessionStorage.getItem('movies'));
    let movieHTML = '';

    borrowed.forEach((borrowedMovie) => {
        if (borrowedMovie.studioId == accountID && !borrowedMovie.returned) {
            let movie = movies.find(x => x.id == borrowedMovie.filmId);
            
            movieHTML += `
                <li>
                    <button onclick="ReturnMovie(${borrowedMovie.id})">
                        ${movie.name}
                    </button>
                </li>
            `;
        }
    });

    return movieHTML;
}

// Returnerar antalet utlånade filmer för en specifik studio 
// med hjälp av en studios ID
function GetBorrowedMovieAmount(accountID) {
    let borrowed = JSON.parse(sessionStorage.getItem('borrowedMovies'));
    let amount = 0;

    borrowed.forEach((movie) => {
        if (movie.studioId == accountID && !movie.returned) {
            amount++;
            console.log(amount);
        }
    });

    return amount;
}

// Verifierar login-info via ett anrop till apiet
function CheckLoginInfo(userName, password) {
    fetch('https://localhost:5001/api/filmstudio')
        .then((response) => { return response.json(); })
        .then((studios) => {
            let loginCallback; 
            
            studios.forEach((item) => {
                // console.log(item);

                if (userName.value === item.name && password.value === item.password) {
                    let verified = (item.verified) ? true : false;
                    
                    let loggedInStudio = { 
                        "name": item.name, 
                        "id": item.id, 
                        "verified": verified 
                    };
                    
                    // console.log(verified);
                    // console.log(loggedInStudio);
                    // console.log(JSON.stringify(loggedInStudio));
                    
                    if (loggedInStudio.verified) {
                        localStorage.setItem('loggedIn', JSON.stringify(loggedInStudio));
                        console.log('Login successful!');
                        loginCallback = loggedInStudio;

                        if (IsUserAdmin(loggedInStudio)) {
                            console.log('Loading pending users...');
                            LoadInPendingUsers();
                        }
                    }
                    else {
                        loginCallback = false;
                    }  
                    // setTimeout(LoadBorrowedMovies, 150, loggedInStudio.id);
                }
            });
            
            userName.value = "";
            password.value = "";

            if (typeof loginCallback !== 'undefined') {
                if (!loginCallback) {
                    alert('Ditt konto är inte verifierat än.\nDu kan inte logga in förän en administratör har godkännt ditt konto.');
                }
                else {
                    document.getElementById('mainContent').insertAdjacentHTML(
                        'afterbegin', 
                        `<div id="loginConfirmation">Välkommen ${loginCallback.name}!</div>`
                    );
                    LoadNavBar();     
                    ShowLogin();
                }
            }
            else {
                document.getElementById('modalBox').insertAdjacentHTML(
                    'afterbegin', 
                    `<div id="loginConfirmation">Fel användarnamn eller lösenord.</div>`
                );
            }

            let loginConfirmation = document.getElementById('loginConfirmation');
            setTimeout(() => { loginConfirmation.parentElement.removeChild(loginConfirmation); }, 5000);
        });
}

// Funktion som skall skicka ett mejl till en studio 
// som berättar att de blivit verifierade av en administratör
// Fungerar för närvarande inte, men kan enkelt byggas ut i nästa 
// iteration av apiet.
function SendEmailToVerifiedUser(user) {
    // TODO: Get backend to send email.

    console.log('Sending Email....');
    setTimeout(console.log, 2000, `Email sent to ${user.name}`);
}