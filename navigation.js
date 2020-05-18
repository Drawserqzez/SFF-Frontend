PopulateNavbar();
PopulatePage();

let nav = new Navbar(JSON.parse())

function ShowLogin() {
    // TODO: Make it so that this shows a login box on the page
    let loginBox = document.getElementById("loginBox");
    loginBox.style.display = (loginBox.style.display === "none") ? "block" : "none";
}