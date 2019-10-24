var selectedRoute;

function selectTravelTimeRoute()
{
    /* Reset */
    var travelTimeRoutes = document.getElementById("travelTimeRoutes");
    Array.from(travelTimeRoutes.children).forEach(function(route){
        route.style.display = "none";
    });

    /* Select */
    if(document.getElementById("fromBuilding").value == null || document.getElementById("toBuilding").value == null) return;
    var from = document.getElementById("fromBuilding").value;
    var to = document.getElementById("toBuilding").value;
    if(from > to) //flips the letter order in the case someone choses B to A instead of A to B 
    {
        var temp = from;
        from = to;
        to = temp;
    }
    selectedRoute = document.getElementById(from + to);

    /* Display */
    var toggler = document.getElementById("routesTravelTimesSelector");
    if(toggler.checked)
    {
        selectedRoute.style.display = "block";
    }
}