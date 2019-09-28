/**
 * Contributor:     Marcelo Mariduena
 * Description:     This javascript file allows for toggling visibility of fire escape routes in the following files:
 *                  + Building/B/first-floor.html
 * 
 * Other changes:   Toggle button added under:
 *                  + index.html
*/

function showFireRoutes() {
    var x = document.getElementsByClassName("showFireRoutes");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
