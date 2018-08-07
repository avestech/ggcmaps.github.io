// JSON file for room names
var roomNameFile = 'js/roomNames.json';
// JSON of room names
var roomNames;

// Help Documentation
var helpFile = 'help.html';
// Campus events
var campusEventsFile = 'campusEvents.html';

// When DOM has loaded
document.addEventListener('DOMContentLoaded', function() {
    debug.group("DOM Content Loaded");
    // Load roomNameFile
    loadRooms().then(function(response) {
        // Check if content loaded
        // console.log(roomNames);
    }, function(error) {
        debug.error('Failed!', error);
    });

    // Load helpFile
    loadFile('helpbox', helpFile).then(function(response) {
        // Check if content loaded
        // console.log('Help Content Loaded');
    }, function(error) {
        debug.error('Failed!', error);
    });

    // Load campusEvents file
    loadFile('campusEvents', campusEventsFile).then(function(response) {
        // Check if content loaded
        //console.log('Campus Events Loaded');
        checkLocalStorage();
    }, function(error) {
        debug.error('Failed!', error);
    });


    // Popup elements
    var building = document.getElementById('building');
    var floor = document.getElementById('floor');
    var menu = document.getElementById('menu');
    var search = document.getElementById('search');

    // Setup popup elements
    activatePopup(building, 'building-popup');
    activatePopup(floor, 'floor-popup');
    activatePopup(menu, 'menu-popup');
    activatePopup(search, 'search-popup');

    urlRoom();
    // If the user goes back in the browser reload the last loction
    window.addEventListener('popstate', function(e) {
        debug.msg("website auto calls urlRoom");
        urlTimer = setTimeout(function() {
            urlRoom();
        }, 100);
    });
    debug.end();

});

// Loads and parses roomNameFile into a JSON object
function loadRooms() {
    // Ensure that the file has loaded before certain functions are called
    return new Promise(function(resolve, reject) {
        debug.group("Load Rooms");

        var req = new XMLHttpRequest();
        req.open('GET', roomNameFile, true);
        req.onload = function() {
            // if (req.readyState!==4) reject(Error(req.statusText));
            if (req.status !== 200) reject(Error(req.statusText));

            // Parse the response into a JSON object
            roomNames = JSON.parse(req.response);

            resolve(req.response);
        };

        req.onerror = function() {
            reject(Error('Network Error'));
        };

        req.send();
        debug.end();
    });
}
