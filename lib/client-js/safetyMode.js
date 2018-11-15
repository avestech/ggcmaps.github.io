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
            break;
        case "show":
            cookieMold('mode', 'hide', 9999);
            console.log("Now hiding");
            debug.msg("Now Hiding");
            break;
        default:
            console.log("Done changing. Mode = " + safetyStatus);
            debug.msg("Done changing");
    }
}

function visitSafety() {
    debug.group("Visit Safety");
    if (eatCookie("visits") === '' || eatCookie("visits") === null) {
        cookieMold('visits', 1, 1);
        // cookieMold('mode','HIDE',9999);
    } else {
        var numVisits = parseInt(eatCookie('visit')) + 1;
        cookieMold('visits', numVisits, 1);
        if (eatCookie('mode') === 'show') {
            document.getElementById("safetySwitch").checked = true;
        }
    }
    debug.end();
}

function secondLegend() {
    debug.group("Second Legend");
    if (eatCookie("visits") === '' || eatCookie("visits") === null) {
        cookieMold('legend', 'hide', 9999);
    }
    debug.end();
}