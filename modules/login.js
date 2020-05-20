export function Login() {
    let userName = document.getElementById('userName');
    let password = document.getElementById('password');

    // TODO: Lös så att användaren får en bekräftelse att de loggats in.
}

function CheckLoginInfo(userName, password) {
    fetch('https://localhost:5001/api/filmstudio')
        .then((response) => { return response.json(); })
        .then((studios) => {
            studios.forEach((item) => {
                if (userName.value === item.name && password.value === item.password) {
                    let loggedInStudio = { "Name": item.name, "ID": item.id, "Verified": true };
                    localStorage.setItem('loggedIn', loggedInStudio);
                    
                    userName.value = "";
                    password.value = "";

                    return loggedInStudio;
                }
            });
        });
}