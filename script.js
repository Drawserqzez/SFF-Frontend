import { 
    ShowLogin, ShowRegister, LoadNavBar 
} from "./modules/navigation.js";

import { 
    LoadInMovies, ShowMovieTable, 
    ShowMovie, BorrowMovie, 
    ReturnMovie, AddTrivia,
    AddMovie
} from "./modules/movies.js";

import { 
    Login, Logout, 
    Register, ShowAccount,
    VerifyUser
} from "./modules/login.js";

LoadNavBar();
LoadInMovies();

setTimeout(ShowMovieTable, 100);

// Gör så att vissa metoder kan kallas globalt.
// Visserligen motverkar detta en av idéerna med att använda moduler
// Men jag visste inte hur jag annars skulle lösa det.
window.ShowMovie = ShowMovie;
window.ShowMovieTable = ShowMovieTable;
window.BorrowMovie = BorrowMovie;
window.ReturnMovie = ReturnMovie;
window.AddTrivia = AddTrivia;
window.AddMovie = AddMovie;

window.ShowLogin = ShowLogin;
window.Login = Login;
window.Logout = Logout;
window.Register = Register;
window.VerifyUser = VerifyUser;

window.LoadNavBar = LoadNavBar;

window.ShowRegister = ShowRegister;
window.ShowAccount = ShowAccount;