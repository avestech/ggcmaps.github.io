function selectTravelTimeRoute()
{
    /* Reset */
    var travelTimeRoutes = document.getElementById("travelTimeRoutes");
    Array.from(travelTimeRoutes.children).forEach(function(route){
        route.style.display = "none";
    });

    /* Select */
    if(document.getElementById("fromBuilding").value == null || document.getElementById("toBuilding").value == null) 
    {
        return;
    }
    var from = document.getElementById("fromBuilding").value;
    var to = document.getElementById("toBuilding").value;
    if(from > to) //flips the letter order in the case someone choses B to A instead of A to B 
    {
        var temp = from;
        from = to;
        to = temp;
    }
    var selectedRoute = document.getElementById(from + to);
    var routeSelectorLegend = document.getElementById("routeSelectorLegend");
    var travelTimesLegend = document.getElementById("travelTimesLegend");

    /* Setting travel time */
    var currentTravelTime = document.getElementById("currentTravelTime");
    switch(from + to)
    {
        case "AB":
            currentTravelTime.innerHTML = "10 min";
            break;
        case "AC":
            currentTravelTime.innerHTML = "11 min";
            break;
        case "AD":
            currentTravelTime.innerHTML = "2.5 min";
            break;
        case "AE":
            currentTravelTime.innerHTML = "10 min";
            break;
        case "AF":
            currentTravelTime.innerHTML = "8 min";
            break;
        case "AH":
            currentTravelTime.innerHTML = "6 min";
            break;
        case "AI":
            currentTravelTime.innerHTML = "11 min";
            break;
        case "AL":
            currentTravelTime.innerHTML = "10 min";
            break;   
        case "AW":
            currentTravelTime.innerHTML = "11 min";
            break;
        case "BC":
            currentTravelTime.innerHTML = "1 min";
            break;
        case "BD":
            currentTravelTime.innerHTML = "18 min";
            break;
        case "BE":
            currentTravelTime.innerHTML = "3 min";
            break;  
        case "BF":
            currentTravelTime.innerHTML = "13 min";
            break;
        case "BH":
            currentTravelTime.innerHTML = "3 min";
            break;
        case "BI":
            currentTravelTime.innerHTML = "11 min";
            break;
        case "BL":
            currentTravelTime.innerHTML = "3 min";
            break;   
        case "BW":
            currentTravelTime.innerHTML = "3 min";
            break;
        case "CD":
            currentTravelTime.innerHTML = "19 min";
            break;
        case "CE":
            currentTravelTime.innerHTML = "3 min";
            break;
        case "CF":
            currentTravelTime.innerHTML = "15 min";
            break;
        case "CH":
            currentTravelTime.innerHTML = "4 min";
            break;
        case "CI":
            currentTravelTime.innerHTML = "16 min";
            break;
        case "CL":
            currentTravelTime.innerHTML = "2 min";
            break;
        case "CW":
            currentTravelTime.innerHTML = "30 sec";
            break;   
        case "DE":
            currentTravelTime.innerHTML = "17 min";
            break;
        case "DF":
            currentTravelTime.innerHTML = "6 min";
            break;
        case "DH":
            currentTravelTime.innerHTML = "11 min";
            break;
        case "DI":
            currentTravelTime.innerHTML = "12 min";
            break;  
        case "DL":
            currentTravelTime.innerHTML = "16 min";
            break;
        case "DW":
            currentTravelTime.innerHTML = "17 min";
            break;
        case "EF":
            currentTravelTime.innerHTML = "13 min";
            break;
        case "EH":
            currentTravelTime.innerHTML = "3 min";
            break;
        case "EI":
            currentTravelTime.innerHTML = "11 min";
            break;  
        case "EL":
            currentTravelTime.innerHTML = "1 min";
            break;
        case "EW":
            currentTravelTime.innerHTML = "1 min";
            break;
        case "FH":
            currentTravelTime.innerHTML = "FIX";
            break;
        case "FI":
            currentTravelTime.innerHTML = "6 min";
            break;   
        case "FL":
            currentTravelTime.innerHTML = "12 min";
            break;
        case "FW":
            currentTravelTime.innerHTML = "13 min";
            break;
        case "HI":
            currentTravelTime.innerHTML = "11 min";
            break;
        case "HL":
            currentTravelTime.innerHTML = "2 min";
            break;
        case "HW":
            currentTravelTime.innerHTML = "3 min 30 s";
            break;
        case "IL":
            currentTravelTime.innerHTML = "10 min";
            break;
        case "IW":
            currentTravelTime.innerHTML = "11 min 30 s";
            break;
        case "LW":
            currentTravelTime.innerHTML = "1 min 30 s";
            break;
        default:
            currentTravelTime.innerHTML = "Select a route";
    }

    //var travelTimesWalkingIcon = document.getElementById("travelTimesWalkingIcon");
    var toggler = document.getElementById("routesTravelTimesSelector");
    /* Display */
    if(toggler.checked)
    {
        console.log("toggler show routes ran.");
        routeSelectorLegend.style.display = "flex";
        travelTimesLegend.style.display = "block";
        if(currentTravelTime.innerHTML == "Please select a route.")
            travelTimesWalkingIcon.style.display = "none";
        else travelTimesWalkingIcon.style.display = "inline-block";
        selectedRoute.style.display = "block"; //This HAS to be last.
    }
    else 
    {
        console.log("toggler hide routes ran.");
        travelTimesLegend.style.display = "none";
        routeSelectorLegend.style.display = "none";
        travelTimesWalkingIcon.style.display = "none";
    }
}