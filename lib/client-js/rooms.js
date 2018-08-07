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
            switch (room.toUpperCase()) { // If room is a building letter use changeFloor to lowest floor of building
                case '2':
                    changeFloor('2');
                    break;
                case '3':
                    changeFloor('3', '1');
                    break;
                case 'A':
                    changeFloor('A');
                    break;
                case 'B':
                    changeFloor('B', '1');
                    break;
                case 'C':
                    changeFloor('C', '1');
                    break;
                case 'C3':
                    changeFloor('C3', 'G');
                    break;
                case 'D':
                    changeFloor('D', '1');
                    break;
                case 'E':
                    changeFloor('E', '1');
                    break;
                case 'F':
                    changeFloor('F', '1');
                    break;
                case 'H':
                    changeFloor('H', '1');
                    break;
                case 'I':
                    changeFloor('I', '1');
                    break;
                case 'L':
                    changeFloor('L', '1');
                    break;
                    // If not a valid building, don't try loading URL after search attempt
                case 'G':
                case 'J':
                case 'K':
                case 'M':
                case 'N':
                case 'O':
                case 'P':
                case 'Q':
                case 'R':
                case 'S':
                case 'T':
                case 'U':
                case 'V':
                case 'W':
                case 'X':
                case 'Y':
                case 'Z':
                    window.location.hash = "Campus";
                    break;
                default: // If not a building letter search for the room
                    // This search seems to be repetitive
                    debug.msg("urlRoom calls searchFromMenu");
                    searchFromMenu(room);
            }
        } else { // Otherwise just load the map of campus
            addMap(campusMap, 'Campus').then(function(response) {
                // Check if content loaded
                // debug.msg('Success!');

                // Set hash to Campus
                window.location.hash = "Campus";
                // Clear the search bar
                document.getElementById('search').value = '';
            }, function(error) {
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

    switch (building) { // Select the proper floor array based on building
        case '2':
            floors = floors2;
            break;
        case '3':
            floors = floors3;
            break;
        case 'A':
            floors = floorsA;
            break;
        case 'B':
            floors = floorsB;
            break;
        case 'C':
            floors = floorsC;
            break;
        case 'C3':
            floors = floorsC3;
            break;
        case 'D':
            floors = floorsD;
            break;
        case 'E':
            floors = floorsE;
            break;
        case 'F':
            floors = floorsF;
            break;
        case 'H':
            floors = floorsH;
            break;
        case 'I':
            floors = floorsI;
            break;
        case 'L':
            floors = floorsL;
            break;
    }

    for (var i = 0; i < floors.length; i++) { // Create a element for each floor and add it to the dropdown
        var option = '<h2 onclick="changeFloor(\'' + building + '\', \'' + floors[i] + '\')">Floor ' + floors[i] + '</h2>';
        dropdown.appendChild(convertToElement(option));
    }
    debug.end();
}

// Highlight a room
// roomID the ID of the room to highlight
// search True/False was the room being searched for
function activateRoom(roomID, search) {
    debug.group("Activate Room");
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

    for (var i = 0; i < room.length; i++) { // Remove active-room from all rooms
        room[i].classList.remove('active-room');
    }
    debug.end();
}

// Retrieve the file location of the map
function getMap(building, floor) {
    debug.group("Get Map");

    var newMap = '';

    switch (building) {
        // Select the proper building and floor
        case 'Campus':
            newMap = campusMap;
            break;
        case '2':
            newMap = building2[0];
            break;
        case '3':
            if (floor === '4') {
                newMap = building3[3];
            } else if (floor === '3') {
                newMap = building3[2];
            } else if (floor === '2') {
                newMap = building3[1];
            } else {
                newMap = building3[0];
            }
            break;
        case 'A':
            newMap = buildingA[0];
            break;
        case 'B':
            if (floor === '3') {
                newMap = buildingB[2];
            } else if (floor === '2') {
                newMap = buildingB[1];
            } else {
                newMap = buildingB[0];
            }
            break;
        case 'C':
            if (floor === '1') {
                newMap = buildingC[0];
            } else {
                newMap = buildingC[1];
            }
            break;
        case 'C3':
            if (floor === '2') {
                newMap = buildingC3[2];
            } else if (floor === '1') {
                newMap = buildingC3[1];
            } else {
                newMap = buildingC3[0];
            }
            break;
        case 'D':
            if (floor === '2') {
                newMap = buildingD[1];
            } else {
                newMap = buildingD[0];
            }
            break;
        case 'E':
            if (floor === '3') {
                newMap = buildingE[2];
            } else if (floor === '2') {
                newMap = buildingE[1];
            } else {
                newMap = buildingE[0];
            }
            break;
        case 'F':
            if (floor === '2') {
                newMap = buildingF[1];
            } else {
                newMap = buildingF[0];
            }
            break;
        case 'H':
            if (floor === '3') {
                newMap = buildingH[2];
            } else if (floor === '2') {
                newMap = buildingH[1];
            } else {
                newMap = buildingH[0];
            }
            break;
        case 'I':
            if (floor === '3') {
                newMap = buildingI[2];
            } else if (floor === '2') {
                newMap = buildingI[1];
            } else {
                newMap = buildingI[0];
            }
            break;
        case 'L':
            if (floor === '3') {
                newMap = buildingL[2];
            } else if (floor === '2') {
                newMap = buildingL[1];
            } else {
                newMap = buildingL[0];
            }
            break;
    }
    debug.msg("getMap returning");
    debug.end();
    return newMap;
}

// Swap which floor of a building is being displayed
function changeFloor(building, floor) {
    debug.group("Change Floor");
    closeMenu();
    var newWindow = building.toUpperCase();
    var searchBar = document.getElementById('roomSearch');
    // Clear the search bar
    searchBar.value = '';

    newWindow = getMap(building, floor);

    if (newWindow !== '') { // Provided that newWindow got set then add the map
        addMap(newWindow, building, floor).then(function(response) {
            // debug.msg('Success!');
            // Update the location hash to the building letter
            window.location.hash = building;
            debug.msg("urlRoom stopped by changeFloor");
            clearTimeout(urlTimer);
        }, function(error) {
            debug.error('Failed!', error);
        });
    }
    safetyOff();
    debug.end();
}
