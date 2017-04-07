//Create or modify cookie
function cookieMold(name, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    var expires = "expires="+ date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Read through the user's cookie
function eatCookie(bite) {
  var cookiePiece = bite + "=";
  var cookieCrusher = decodeURIComponent(document.cookie);
  var cookieCrumbs = cookieCrusher.split(';');
  for(var i=0; i<cookieCrumbs.length; i++){
    var cookieDust = cookieCrumbs[i];
    while (cookieDust.charAt(0) == ' '){
      cookieDust = cookieDust.substring(1);
    }
    if(cookieDust.indexOf(cookiePiece) === 0){
      return cookieDust.substring(cookiePiece.length, cookieDust.length);
    }
  }
  return "";
}

// Creates a cookie that prevents the compatibility alert page from showing up
// until the end of the session. After creating the cookie it redirects the user
// to the homepage
function agreePage(ayenay){
  document.cookie = "agreement=" + ayenay;
  window.location.replace("index.html");
}

// Function modifies "visits" cookie to set it if not present
function visitCheck(){
  if(eatCookie("visits") === '' || eatCookie("visits") === null) {
    cookieMold('visits',1,1);
    // cookieMold('legend','hide',9999);
  } else {
    var numVisits = parseInt(eatCookie('visits')) + 1;
    cookieMold('visits',numVisits, 1);
    if (eatCookie('legend') === 'show'){
      document.getElementById("legendSwitch").checked = true;
    }
  }
}

function cookieLegend(){
  var legendStatus = eatCookie('legend').toUpperCase();
  if(eatCookie('legend') !== null)
  {
    switch (legendStatus) {
      case "HIDE":
        cookieMold('legend','show',9999);
        console.log("Now Showing");
        break;
      case "SHOW":
        cookieMold('legend','hide',9999);
        console.log("Now Hiding");
        break;
      default:
        console.log("Done changing");
    }
  }
}

function firstLegend(){
  if(eatCookie("visits") === '' || eatCookie("visits") === null) {
    cookieMold('legend','hide',9999);
  }
}
