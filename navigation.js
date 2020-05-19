LoadPage();

async function LoadPage() {
    await LoadData();
    LoadNavBar();
}



function ShowLogin() {
    let loginBox = document.getElementById("loginBox");
    loginBox.style.display = (loginBox.style.display === "none") ? "block" : "none";
}

function LoadNavBar() {
    document.getElementsByTagName("nav")[0].innerHTML = GenerateNavbar();
}

function GenerateNavbar() {
    let navString = '<ul class="navContainer">';
    
    navString += GenerateNavItem("SFF Filmbibliotek", () => { console.log('Ingen funktionalitet än :)'); }, "cursor: pointer;");
    navString += GenerateNavItem("Bananan", () => { console.log('Ingen funktionalitet än');});
    let buttons = [];
    let mainBtn = {"Text": "", "Action": ""};

    if (localStorage.getItem("loggedIn") === null) {
        mainBtn.Action = () => { Login(); };
        mainBtn.Text = "Logga in";
    }
    else {
        mainBtn.Action = () => { Logout() };
        mainBtn.Text = "Logga ut";
    }
    buttons.push(mainBtn);
    navString += GenerateDropdown("Kontoalternativ", buttons);
    
    navString += '</ul>';

    return navString;
}

function GenerateNavItem(text, onClick, style) {
    style = (typeof style === 'undefined') ? '' : ' style="' + style + '"';
    onClick = ' onClick="(' + onClick + ')();"';
    let html = '<li class="navItem"';

    html += onClick + style + '>' + text;

    html += '</li>';

    return html;
}

function GenerateDropdown(header, buttons) {
    let html = '<li class="navItem">'
        + '<div class="dropdown">'
        +   '<div class="dropdown-btn">' + header + '</div>'
        +   '<div class="dropdown-content">';

    for (let i = 0; i < buttons.length; i++) {
        html += '<a onClick="(' + buttons[i].Action + ')();" href="#">' + buttons[i].Text + '</a>';
    }


    html += '</div> <!--Dropdown taken from: https://www.w3schools.com/css/css_dropdowns.asp -->' 
        + '</div></li>';

    return html;
}
