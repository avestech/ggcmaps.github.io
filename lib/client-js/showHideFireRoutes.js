function showFireRoutes() 
{
    var x = document.getElementById("fireRoute");
    var y = document.getElementById("fireRouteCheckbox");
    if (window.performance) 
    {
        y.checked = false;
    }

    if (x.style.display === "none") 
    {
        x.style.display = "block";
    } 
    else 
    {
        x.style.display = "none";
    }
}
