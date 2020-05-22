//#region Login

export function ShowLogin() {
    document.getElementById('modalContent').innerHTML = PopulateModal('Login');
    ShowModal();
}

export function ShowRegister() {
    document.getElementById('modalContent').innerHTML = PopulateModal('Register');
}

function ShowModal() {
    let modalBox = document.getElementById("modalBox");
    modalBox.style.display = (modalBox.style.display === "none") ? "block" : "none";
    
    if (modalBox.style.display === 'block') {
        modalBox.insertAdjacentHTML('afterbegin', '<button id="closeModal" style="float: left; margin-left: 0;">&times;</button>');
        document.getElementById('closeModal').addEventListener('click', () => {
            ShowModal();
            modalBox.innerHTML = '<div id="modalContent" class="popout-content"></div>';
        });
    }
    else {
        modalBox.innerHTML = '<div id="modalContent" class="popout-content"></div>';
    }
}

function PopulateModal(modalContentType) {
    let action = (modalContentType !== 'Login') ? 'Registrera dig' : 'Logga in';
    let regButton = (modalContentType === 'Login') ? `Inget konto? <a onclick="ShowRegister('Register')" href="#">Klicka här!</a>` : "";

    let form = `
        <div class="modalForm">
            <input type="text" id="userName" placeholder="Användarnamn">
            <br>
            <input type="password" id="password" placeholder="Lösenord">
            <br><br>
            <button onclick="${modalContentType}()">${action}</button>
            <br><br>
            ${regButton}
        </div>
    `;

    // console.log(form);
    return form;
}

//#endregion Login

//#region nav
export function LoadNavBar() {
    document.getElementsByTagName("nav")[0].innerHTML = GenerateNavbar();
}

function GenerateNavbar() {
    let navString = '<ul class="navContainer">';
    
    navString += GenerateNavItem("SFF Filmbibliotek", () => { ShowMovieTable(); }, "cursor: pointer;");
    navString += GenerateNavItem("Bananan", () => { console.log('Ingen funktionalitet än');});
    let buttons = [];
    let mainBtn = {"Text": "", "Action": ""};

    if (localStorage.getItem("loggedIn") === null) {
        mainBtn.Action = 'ShowLogin();';
        mainBtn.Text = "Logga in";
    }
    else {
        mainBtn.Action = 'Logout();';
        mainBtn.Text = "Logga ut";
        
        let accountInfoBtn = { "Text": "Mitt konto", "Action": "" };
        let user = JSON.parse(localStorage.getItem('loggedIn'));
        accountInfoBtn.Action = `ShowAccount();`;

        buttons.push(accountInfoBtn);
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
        html += '<a onClick="' + buttons[i].Action + '" href="#">' + buttons[i].Text + '</a>';
    }


    html += '</div> <!--Dropdown taken from: https://www.w3schools.com/css/css_dropdowns.asp -->' 
        + '</div></li>';

    return html;
}
//#endregion nav