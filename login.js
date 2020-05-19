function Login() {
    fetch("https://localhost:5001/api/filmstudio") 
    .then((responses) => {
        return responses.json();
    })
    .then((json) => {
        json.forEach(CheckLoginDetails);

        document.getElementById("userName").value = "";
    });
}

function Logout() {
    if (localStorage.getItem("loggedIn") !== null) {
        localStorage.removeItem("loggedIn");
        mainContent.insertAdjacentText("beforeend", "Du har loggats ut");
        PopulateNavbar();

        setTimeout(GeneratePage, 2000);
    }
}

function CheckLoginDetails(item) {
    let userName = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (userName !== null && password !== null) {
        let nameMatches = item.name === userName;
        let passwordMatches = item.password === password;

        if (nameMatches && passwordMatches) {
            localStorage.setItem("loggedIn", item.name);
            PopulateNavbar();
            document.getElementById("loginBox").insertAdjacentHTML("beforeend", '<p>Välkommen ' + item.name + '</p>');
            document.getElementById("loginToggle").addEventListener("click", ShowLogin);

            setTimeout(() => {
                userName = "";
            }, 100);
        }
    }    
}