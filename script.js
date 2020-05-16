PopulateNavbar();
var mainContent = document.getElementById("mainContent");
PopulatePage();
        
var loginButton = document.getElementById("login");
loginButton.addEventListener("click", () => ShowLogin);

function PopulateNavbar() {
    var dropdown = document.getElementById("nav-dropdown");
    var notLoggedIn = localStorage.getItem("loggedIn") === null;

    var action = (notLoggedIn) ? "Logga in" : "Logga ut";
    var link = '<a id="login" href="#Login">' + action + '</a>';

    dropdown.insertAdjacentHTML("beforeend", link);
}

function PopulatePage() {
    mainContent.innerHTML =
    '<table>' +
        '\n\t<thead>' + 
            '\n\t<tr>' +
                '\n\t<th>Name</th>' +
                '\n\t<th>Stock</th>' +
            '\n\t</tr>' +
        '\n\t</thead>' +
        '\n\t<tbody id="movieTable">' + 
        '\n\t</tbody>' +
    '\n</table>';
    
            
            
fetch("https://localhost:5001/api/Film")
    .then(function(responses) {
        console.log("got response");
        return responses.json();
    }).then(function(json) {
        console.log(json);
        json.forEach(InsertMovies);
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
}