//Create Safety Mode for safety toggle in menu tab
function safetyMode() {
  debug.group("Safety Mode");
  var safetyStatus = eatCookie('mode').toUpperCase();
  console.log(safetyStatus);
  if (eatCookie('mode') !== null) {
      switch (safetyStatus) {
        case "HIDE":
          cookieMold('mode', 'SHOW', 9999);
          debug.msg("Now Showing");
          break;
        case "SHOW":
          cookieMold('mode', 'HIDE', 9999);
          debug.msg("Now Hiding");
          break;
        default:
          debug.msg("Done changing");
      }
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
        cookieMold('legend', 'HIDE', 9999);
    }
    debug.end();
}
