// TODO: Change the structure of the project to kinda emulate old php projects

function PopulateModal() {

}

function PopulatePage() {
    
    if (sessionStorage.getItem("movieData") === null || "undefined" === sessionStorage.getItem("movieData")) {       
        console.log("fetching movies");
         
        fetch("https://localhost:5001/api/Film")
        .then((responses) => {
            console.log("got response");

            return responses.json();
        }).then((json) => {
            console.log(json);
            
            if (json.length == 0 || json === null) {
                mainContent.innerHTML = '<p>Ingen data hittades. <a onclick="PopulatePage()" href="#">Försök igen.</a></p>';
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

                sessionStorage.setItem("movieData", JSON.stringify(json));
            }
        });
    }
    else {
        console.log("found existing data");
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

        let data = JSON.parse(sessionStorage.getItem("movieData"));
        data.forEach(InsertMovies);
    }
}

function InsertMovies(item) {
    let movieTable = document.getElementById("movieTable");

    movieTable.innerHTML += 
        '<tr>' +
            '\n<td>' + item.name + '</td>' + 
            '\n<td>' + item.stock + '</td>' + 
        '\n</tr>';
}


// function PopulateNavbar() {
//     let dropdown = document.getElementById("nav-dropdown");
//     let notLoggedIn = localStorage.getItem("loggedIn") === null;
    
//     let link = '';
//     if (notLoggedIn) {
//         link = '<a id="loginToggle" href="#">Logga In</a>';
//         dropdown.innerHTML = link;
//         let loginToggle = document.getElementById("loginToggle");
//         loginToggle.addEventListener("click", ShowLogin);
//     }
//     else {
//         link = '<a id="logoutButton" href="#">Logga Ut</a>';
//         dropdown.innerHTML = link;
//         let logoutButton = document.getElementById("logoutButton");
//         logoutButton.addEventListener("click", Logout);
//     }
// }

