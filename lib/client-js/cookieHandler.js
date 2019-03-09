//Create or modify cookie
function cookieMold(name, value, days) {
    debug.group("Cookie Mold");
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    debug.end();
}

// Read through the user's cookie
function eatCookie(bite) {
    debug.group("Eat Cookie");
    var cookiePiece = bite + "=";
    var cookieCrusher = decodeURIComponent(document.cookie);
    var cookieCrumbs = cookieCrusher.split(';');
    for (var i = 0; i < cookieCrumbs.length; i++) {
        var cookieDust = cookieCrumbs[i];
        while (cookieDust.charAt(0) == ' ') {
            cookieDust = cookieDust.substring(1);
        }
        if (cookieDust.indexOf(cookiePiece) === 0) {
            return cookieDust.substring(cookiePiece.length, cookieDust.length);
        }
    }
    debug.end();
    return "";
}

// Creates a cookie that prevents the compatibility alert page from showing up
// until the end of the session. After creating the cookie it redirects the user
// to the homepage
function agreePage(ayenay) {
    debug.group("Agree Page");
    document.cookie = "agreement=" + ayenay;
    window.location.replace("index.html");
    debug.end();
}

// Function modifies "visits" cookie to set it if not present
function visitCheck() {
    debug.group("Visit Check");
    if (eatCookie("visits") === '' || eatCookie("visits") === null) {
        cookieMold('visits', 2, 7);
        cookieMold('legend', 'hide', 9999);
        cookieMold('mode', 'hide', 9999);
    } else {
        var numVisits = parseInt(eatCookie('visits')) + 1;
        cookieMold('visits', numVisits, 1);
        if (eatCookie('legend') === 'show') {
            document.getElementById("legendSwitch").checked = true;
        }
        if (eatCookie('mode') === 'show') {
            document.getElementById("safetySwitch").checked = true;
        }
    }
    debug.end();
}

function cookieLegend() {
    debug.group("Cookie Legend");
    var legendStatus = eatCookie('legend');
    if (eatCookie('legend') !== null) {
        switch (legendStatus) {
            case 'hide':
                cookieMold('legend', 'show', 9999);
                debug.msg("Now Showing");
                break;
            case 'show':
                cookieMold('legend', 'hide', 9999);
                debug.msg("Now Hiding");
                break;
            default:
                debug.msg("Done changing");
        }
    }
    debug.end();
}

function firstLegend() {
    debug.group("First Legend");
    if (eatCookie("visits") === '' || eatCookie("visits") === null) {
        cookieMold('legend', 'hide', 9999);
    }
    debug.end();
}