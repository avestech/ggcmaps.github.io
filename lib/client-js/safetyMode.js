//Create Safety Mode for safety toggle in menu tab
function safetyMode() {
    debug.group("Safety Mode");
    var safetyStatus = eatCookie('mode');

    switch (safetyStatus) {
        case "hide":
            cookieMold('mode', 'show', 9999);
            closeMenu();
            break;
        case "show":
            cookieMold('mode', 'hide', 9999);
            closeMenu();
            break;
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
// function toggleSafetyMode() {
//     var safetyLegend = document.getElementById('sLegend');
//     var safety = document.getElementById('Safety');
//     if ((eatCookie('mode') === 'show') || (eatCookie('mode') === 'show')) {
//         hideElement(safetyLegend, SHOW);
//         safetyLegend.style.display = "inherit";
//         Safety.style.display = "block";
//         closeMenu();
//     }
//     else if ((eatCookie('mode') === 'hide')  || (eatCookie('mode') === 'hide')) {
//         hideElement(safetyLegend, HIDE);
//         safetyLegend.style.display = "none";
//         Safety.style.display = "none";
//         closeMenu();
//     }
// }
//revised toggleSafetyMode function, the conditions were checking for the same thing
function toggleSafetyMode() {
    var safetyLegend = document.getElementById('sLegend');
    var safety = document.getElementById('Safety');
    var mode = eatCookie('mode');
    
    if (mode === 'show') {
        hideElement(safetyLegend, SHOW);
        safetyLegend.style.display = "inherit";
        safety.style.display = "block";
        closeMenu();
    } else if (mode === 'hide') {
        hideElement(safetyLegend, HIDE);
        safetyLegend.style.display = "none";
        safety.style.display = "none";
        closeMenu();
    }
}