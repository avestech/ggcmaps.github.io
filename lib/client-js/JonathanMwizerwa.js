/**
 * Contributor:     Jonathan Mwizerwa
 * Description:     This javascript file allows for toggling visibility of dining services times on all pages of the web-app.
 *
 * Other changes:   Toggle button added under:
 *                  + index.html
*/

function showDiningTimes() {
  var x = document.getElementById("diningTimes");
  if (x.style.display === "none") {
      x.style.display = "block";
  } else {
      x.style.display = "none";
  }
}