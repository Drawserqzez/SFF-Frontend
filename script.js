import { ShowLogin, LoadNavBar } from "./modules/navigation.js";
import { LoadInMovies, ShowMovieTable, ShowMovie } from "./modules/movies.js";

LoadNavBar();
LoadInMovies();

setTimeout(ShowMovieTable, 100);

window.ShowMovie = ShowMovie;
window.ShowMovieTable = ShowMovieTable;
window.ShowLogin = ShowLogin;