//Create Safety Mode for safety toggle in menu tab
function safetyMode() {
    debug.group("Safety Mode");
    var safetyStatus = eatCookie('mode');
    console.log("Calling safetyMode()");
    switch (safetyStatus) {
        case "hide":
            cookieMold('mode', 'show', 9999);
            console.log("Now showing");
            debug.msg("Now Showing");
            closeMenu();
            break;
        case "show":
            cookieMold('mode', 'hide', 9999);
            console.log("Now hiding");
            debug.msg("Now Hiding");
            closeMenu();
            break;
        default:
            console.log("Done changing. Mode = " + safetyStatus);
            debug.msg("Done changing");
    }
}

function secondLegend() {
    debug.group("Second Legend");
    if (eatCookie("visits") === '' || eatCookie("visits") === null) {
        cookieMold('mode', 'hide', 9999);
    }
    debug.end();
}

// show the safety legend
function toggleSafetyMode() {
    var safetyLegend = document.getElementById('sLegend');
    if ((eatCookie('mode') === 'show') || (changeFloor() && eatCookie('mode') === 'show')) {
        hideElement(safetyLegend, SHOW);
        safetyLegend.style.display = "inherit";
        Safety.style.display = "block";
        closeMenu();
    }
    else if(eatCookie('mode') === 'hide'  || (changeFloor() && eatCookie('mode') === 'hide')) {
        hideElement(safetyLegend, HIDE);
        safetyLegend.style.display = "none";
        Safety.style.display = "none";
        closeMenu();

    }
}
