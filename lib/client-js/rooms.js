/* jshint sub:true */

// Hiding the element or not
var HIDE = true;
var SHOW = false;

// Timeout variable for urlRoom()
var urlTimer;

// Load the proper map based on url
function urlRoom() {
    debug.group("URL Room");
    if (window.navigator.userAgent.indexOf("Edge") > -1) {
        // Do nothing
    } else {
        // Get the location hash
        var hash = window.location.hash;
        // Remove everything before the last '#' sign
        var room = hash.substring(hash.lastIndexOf('#') + 1);
        if (room !== '' && !room.includes('.') && room.toLowerCase() !== 'campus') { // If room is set and not campus or have a '.'

            var data = switchMap(room);
            searchRoomNumber(data);
        } else { // Otherwise just load the map of campus
            addMap(campus.map, 'Campus').then(function (response) {
                // Check if content loaded
                // debug.msg('Success!');

                // Set hash to Campus
                window.location.hash = "Campus";
                // Clear the search bar
                document.getElementById('search').value = '';
            }, function (error) {
                debug_error('Failed!', error);
            });
        }
    }
    debug.end();
}

// Reset the floor dropdown based on the building
function floorDropDown(building) {
    debug.group("Floor DropDown");
    // Floor dropdown
    var dropdown = document.getElementsByClassName('floors')[0];
    // Remove all floors from dropdown
    while (dropdown.hasChildNodes()) {
        dropdown.removeChild(dropdown.lastChild);
    }

    var floors = [];

    for (const cBuilding of campus.buildings) {
        if (cBuilding.id.toUpperCase() === building.toUpperCase()) {
            floors = cBuilding.floors;
        }
    }

    for (const floor of floors) {
        // Create an element for each floor and add it to the dropdown
        const option = `<h2 onclick="changeFloor('${building}', '${floor.id}')">Floor ${floor.id}</h2>`;
        dropdown.appendChild(convertToElement(option));
      }
    debug.end();
}

// Highlight a room
// roomID the ID of the room to highlight
// search True/False was the room being searched for
function activateRoom(roomID, search) {
    debug.group("Activate Room");
    debug.msg('Attempt to activate: ' + roomID);
    //room 4983 does not exist. no room to activate so return
    if (roomID === "4983") {
        return;
    }
    var roomClass = 'room-group';
    var room = document.getElementById(roomID.toLowerCase());

    if (room === null) { // If room is null alert the user
        alert("Sorry, room number " + roomID + " couldn't be found in this building.");
    } else {
        var roomClassName = room.className.baseVal;

        // When searching for a room don't let searching for the same room twice add and remove active-room class the room
        if (roomClassName !== roomClass && !search) { // If not searching for room

            if (roomClassName === roomClass + ' active-room') { // Check to deactivate room
                deactivateAllRooms();
                return;
            }
            return;
        } else if (roomClassName === roomClass) { // If searching for room

            deactivateAllRooms();
            debug.msg('Activate: ' + roomID);
            // add active-room to the room
            room.classList.add('active-room');
        }
    }
    debug.end();
}

// Remove active-room from all rooms
function deactivateAllRooms() {
    debug.group("Deactivate All Rooms");
    var roomClass = 'room-group';
    var room = document.getElementsByClassName(roomClass);

    for (const r of room) {
        r.classList.remove('active-room');
      }
    debug.end();
}

// Swap which floor of a building is being displayed
function changeFloor(building, floor) {

    debug.group("Change Floor");
    debug.msg(`Change Map to: ${building} ${floor}`);
    closeMenu();
    var newWindow = building.toUpperCase();
    var searchBar = document.getElementById('roomSearch');
    // Clear the search bar
    searchBar.value = '';

    newWindow = getFloorMap(building, floor);
    turnOffLegend();
    if (newWindow !== '') { // Provided that newWindow got set then add the map
        addMap(newWindow, building, floor).then(function (response) {
            // debug.msg('Success!');
            // Update the location hash to the building letter
            window.location.hash = building;
            debug.msg("urlRoom stopped by changeFloor");
            clearTimeout(urlTimer);
        }, function (error) {
            debug.error('Failed!', error);
        });
    }
    // safetyMode();
    debug.end();
}


// turn off the ledgend evertime change building
function turnOffLegend(){
    var safetyLegend = document.getElementById('sLegend');
    document.getElementById("safetySwitch").checked = false;
    cookieMold('mode', 'hide', 9999);
    document.getElementById("fireSwitch").checked = false;
    safetyLegend.style.display="none";
}
