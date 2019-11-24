//Create vending Mode for vending toggle in menu tab
function vendingMode() {
    debug.group("Vending Mode");
    var vendingStatus = eatCookie('mode');
    console.log("Calling vendingMode()");
    switch (vendingStatus) {
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
            console.log("Done changing. Mode = " + vendingStatus);
            debug.msg("Done changing");
    }
function secondLegend() {
    debug.group("Second Legend");
    if (eatCookie("visits") === '' || eatCookie("visits") === null) {
        cookieMold('mode', 'hide', 9999);
    }
    debug.end();
}

// show the vending legend
function toggleVendingMode() {
    var vendingLegend = document.getElementById('vLegend');
    var vending = document.getElementById('Vending');
    if ((eatCookie('mode') === 'show') || (eatCookie('mode') === 'show')) {
        hideElement(vendingLegend, SHOW);
        vendingLegend.style.display = "inherit";
        vendingLegend.Vending.style.display = "block";
        closeMenu();
    }
    else if ((eatCookie('mode') === 'hide')  || (eatCookie('mode') === 'hide')) {
        hideElement(vendingLegend, HIDE);
        vendingLegend.style.display = "none";
        vendingLegend.Vending.style.display = "none";
        closeMenu();

    }
}
