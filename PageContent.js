// TODO: Change the structure of the project to kinda emulate old php projects

function PopulateModal() {

}

async function LoadData() {
    document.getElementById("mainContent").innerHTML = await GeneratePage();
}

async function GeneratePage() {
    let table = ''
    + '<table class="movieTable">' 
    +   '\n\t<thead>'
    +       '\n\t<tr>'
    +           '\n\t<th>Name</th>'
    +           '\n\t<th>Stock</th>'
    +       '\n\t</tr>'
    +   '\n\t</thead>'
    +   '\n\t<tbody>';
    console.log("fetching movies");
    
    if (sessionStorage.getItem("movieData") === null || "undefined" === sessionStorage.getItem("movieData")) {  
        fetch("https://localhost:5001/api/Film")
        .then((responses) => {
            console.log("got response");

            return responses.json();
        }).then((json) => {
            console.log(json);
            
            if (json.length == 0 || json === null) {
                table = '<p>Ingen data hittades. <a onclick="GeneratePage()" href="#">Försök igen.</a></p>';
            } 
            else {
                table = await InsertMovies(json, table);

                sessionStorage.setItem("movieData", JSON.stringify(json));
            }
        });

        // TODO: Lös faktumet att fetch är asynkront
    }
    else {
        console.log("found existing data");
        
        let data = JSON.parse(sessionStorage.getItem("movieData"));
        table = await InsertMovies(data, table); 
    }
        
        table += ''
        +   '\n\t</tbody>'
        + '\n</table>';

        return table;
}

async function InsertMovies(data, table) {
    for (let i = 0; i < data.length; i++) {
        table +=
            '<tr>'
            +   '\n<td>' + data[i].name + '</td>'
            +   '\n<td>' + data[i].stock + '</td>'
            '\n</tr>';

    }

    return table;
}


