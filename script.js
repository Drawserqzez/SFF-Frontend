PopulateNavbar();
var mainContent = document.getElementById("mainContent");

var homeButton = document.getElementById("homeButton");
homeButton.addEventListener("click", PopulatePage);
        
var loginToggle = document.getElementById("loginToggle");
loginToggle.addEventListener("click", ShowLogin);

var loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", Login);

if (mainContent.innerHTML == "") 
    homeButton.click();

function PopulateNavbar() {
    var dropdown = document.getElementById("nav-dropdown");
    var notLoggedIn = localStorage.getItem("loggedIn") === null;
    
    var link = '';
    if (notLoggedIn) {
        link = '<a id="loginToggle" href="#">Logga In</a>';
    }
    else {
        link = '<a id="logout" href="#">Logga Ut</a>';
    }

    dropdown.innerHTML = link;
    // TODO: Fix so that login runs smoothly and doesn't fuck up completely
}

function PopulatePage() {
    console.log("fetching movies");
    
    fetch("https://localhost:5001/api/Film")
        .then((responses) => {
            console.log("got response");
            return responses.json();
        }).then((json) => {
            console.log(json);
            if (json.length == 0 || json === null) {
                mainContent.innerHTML = '<p>Ingen data hittades. <a onclick="PopulatePage()" href="">Försök igen.</a></p>';
            } 
            else {
                mainContent.innerHTML =
                    '<table class="movieTable">' +
                        '\n\t<thead>' + 
                            '\n\t<tr>' +
                                '\n\t<th>Name</th>' +
                                '\n\t<th>Stock</th>' +
                            '\n\t</tr>' +
                        '\n\t</thead>' +
                        '\n\t<tbody id="movieTable">' + 
                        '\n\t</tbody>' +
                    '\n</table>';
                json.forEach(InsertMovies);
            }
    });
}

function InsertMovies(item) {
    var movieTable = document.getElementById("movieTable");

    movieTable.innerHTML += 
        '<tr>' +
            '\n<td>' + item.name + '</td>' + 
            '\n<td>' + item.stock + '</td>' + 
        '\n</tr>';
}

function ShowLogin() {
    // TODO: Make it so that this shows a login box on the page
    if (localStorage.getItem("loggedIn") !== null) {
        localStorage.removeItem("loggedIn");
        PopulateNavbar();
        // PopulatePage();
        mainContent.insertAdjacentHTML("afterbegin", 'Du är nu utloggad');
    }

    document.getElementById("loginBox").style.display = (document.getElementById("loginBox").style.display === "none") ? "block" : "none";
}

function Login() {

    fetch("https://localhost:5001/api/filmstudio") 
    .then((responses) => {
        return responses.json();
    })
    .then((json) => {
        json.forEach(CheckLoginDetails);
    });
}

function CheckLoginDetails(item) {
    var userName = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (userName !== null && password !== null) {
        var nameMatches = item.name === userName;
        var passwordMatches = item.password === password;

        if (nameMatches && passwordMatches) {
            localStorage.setItem("loggedIn", item.name);
            PopulateNavbar();
            document.getElementById("loginBox").insertAdjacentHTML("afterbegin", '<p>Välkommen ' + item.name + '</p>');
        }
    }    
}