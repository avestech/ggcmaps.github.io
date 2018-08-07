/*Dynamically updates the datalist with input from the search bar.
  References loadSearch function to read and return AllRooms.txt*/
function searchSuggest(a) {
    debug.group("Search Suggest");


    var searchInfo = document.getElementById('roomSearch').value.toUpperCase();
    roomList = document.getElementById('rooms');
    //Arrays for room data storage
    var log1 = [];
    var log2 = [];
    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';

    var options = '';
    loadSearch("Building\\AllRooms.txt");
    /*loadSearch stores all data in a hidden field for log1
      to access and turn into array values*/
    log1 = document.getElementById("arrayStore").value.split(",");
    debug.msg(searchInfo);
    /*Unique to Firefox since it does not update dataList options
      consistently without errors*/
    if (isFirefox) {
        if (roomList.innerHTML == '') {

            for (var i = 0; i < log1.length - 1; i++) {
                options += '<option value="' + log1[i] + '" />';
            }

            roomList.innerHTML = "<select>" + options + "</select>";
        }
    } else {
        //Checks for values that contain the search input
        for (var h = 0; h <= log1.length - 1; h++) {
            if (log1[h].includes(searchInfo)) {
                log2.push(log1[h]);
            }
        }
        debug.msg(log2);
        //Adds the first 4 values in array to datalist options for display.
        for (var j = 0; j < 4; j++) {
            if (j <= log2.length - 1) {
                options += '<option value="' + log2[j] + '" />';
            } else
                break;
        }
        roomList.innerHTML = "<select>" + options + "</select>";
    }
    debug.end();
}
/* Reads a text file, breaks the data by line, and saves the data
   to arrayStore, a hidden field in the html to be used by searchSuggestion()*/
function loadSearch(a) {
    // Ensure that the file has loaded before certain functions are called
    return new Promise(function(resolve, reject) {
        debug.group("Load Search");
        var req = new XMLHttpRequest();
        req.open('GET', a, true);
        req.onload = function() {
            // if (req.readyState!==4) reject(Error(req.statusText));
            if (req.status !== 200) reject(Error(req.statusText));
            /*Sends txt file informaiton to a hidden field for searchSuggestion()
             to reference*/
            document.getElementById("arrayStore").value = req.responseText.split('\n');
            resolve(req.response);
        };
        req.onerror = function() {
            reject(Error('Network Error'));
        };
        req.send();
        debug.end();
    });
}

// Call searchRoomNumber when the user presses enter
function searchFromBar(event) {
    debug.group("Search From Bar");
    if (event.which == 13 || event.keyCode == 13) {
        debug.msg("searchFromBar calls searchRoomNumber");
        searchRoomNumber();
    }
    debug.end();
}

// Search by passing the room into the function
function searchFromMenu(sRoom) {
    debug.group("Search From Menu");
    closeMenu();
    debug.msg("searchFromMenu calls parseSearch");
    var search = parseSearch(sRoom);
    if (search.roomName !== '') {
        // If roomName is not empty then add the roomName to the search bar
        document.getElementById('roomSearch').value = search.roomName;
    } else {
        // Otherwise add the building and room to the search bar
        document.getElementById('roomSearch').value = search.building + ' ' + search.room;
    }
    debug.msg("searchFromMenu calls searchRoomNumber");
    searchRoomNumber();
    debug.end();
}

// Search for a room
function searchRoomNumber() {
    debug.group("Search Room Number");
    // Create the var rInfo and set it to the parsed value of the search bar, forced to uppercase

    var rInfo = parseSearch(document.getElementById('roomSearch').value.toUpperCase()); // The room being searched for
    debug.msg("building = " + rInfo.building);

    // If the Campus map is being searched for load the map and end the function
    if (rInfo.roomName.toLowerCase() === 'campus') {
        // Clear search bar if roomName is campus
        document.getElementById('roomSearch').value = '';
        changeFloor('Campus');
    }
    // Otherwise actually search for a building and/or room number
    else {
        // Set roomNum to arbitrary non existent room number 4983
        // to prevent errors when only searching building letter
        // will change if a room number is in search string
        var roomNum = "4983";
        var building = document.getElementById('building').innerHTML; // Current Building
        var curBuild = building;
        var floor = document.getElementById('floor').innerHTML; // Current Floor

        // Empty variables to compare the search to the current
        var newBuilding = '';
        var newFloor = '';

        // Assign variables from rInfo
        if (rInfo.building !== '') {
            building = rInfo.building;
        }
        if (rInfo.room !== '') {
            roomNum = rInfo.room;
        }
        if (rInfo.roomName !== '') { // Search by names instead of numbers
            roomNum = '';
            // Search through the roomNames object for the name being searched
            // Buildings
            for (var rmBuilding in roomNames) {
                var tempBuilding = rmBuilding;

                // Floors
                for (var rmFloor in roomNames[rmBuilding]) {
                    var tempFloor = rmFloor;

                    // Rooms
                    for (var rmRoom in roomNames[rmBuilding][rmFloor]) {
                        var tempRoom = roomNames[rmBuilding][rmFloor][rmRoom];

                        if (tempRoom.name.toLowerCase() === rInfo.roomName.toLowerCase()) {
                            // Set the variables based on data from roomNames object
                            newBuilding = tempBuilding;
                            newFloor = tempFloor;
                            roomNum = tempRoom.id;
                        }
                    }
                }
            }

            // Update the location hash to the room name

            if (roomNum === '') { // If no room is found alert the user
                alert('Were you trying to search by nickname? Unfortunately, "' +
                    rInfo.roomName + '" is not recognized.\nPlease check your spelling, ' +
                    'or try a more common name.\n\nExample: Search for "Moes" not "Mo"');
            } else {
                window.location.hash = rInfo.roomName;
            }
        } else {

            var upperHash = function() {
                debug.group("upperHash");
                // Update the location hash to be the building plus the room number
                if (roomNum !== "4983") {
                    window.location.hash = building.toUpperCase() + roomNum.toUpperCase();
                } else {
                    window.location.hash = building.toUpperCase();
                }
                debug.msg("urlRoom stopped by upperHash()");
                clearTimeout(urlTimer);
                debug.end();
            };
            upperHash();
            switch (building[0].toUpperCase()) {
                // Select the proper building and floor for the search variables
                case '2':
                    newBuilding = '2';
                    newFloor = undefined;
                    break;
                    //Index of room number used in detecting floor number has been changed from 0 to 1 for Building 3000
                case '3':
                    if (roomNum[1] === '4') {
                        newBuilding = '3';
                        newFloor = '4';
                    } else if (roomNum[1] === '3') {
                        newBuilding = '3';
                        newFloor = '3';
                    } else if (roomNum[1] === '2') {
                        newBuilding = '3';
                        newFloor = '2';
                    } else {
                        newBuilding = '3';
                        newFloor = '1';
                    }
                    break;
                case 'A':
                    newBuilding = 'A';
                    newFloor = undefined;
                    break;
                case 'B':
                    if (roomNum[0] === '3') {
                        newBuilding = 'B';
                        newFloor = '3';
                    } else if (roomNum[0] === '2') {
                        newBuilding = 'B';
                        newFloor = '2';
                    } else if (roomNum[0] === '1') {
                        newBuilding = 'B';
                        newFloor = '1';
                    } else {
                        newBuilding = 'B';
                        newFloor = '1';
                    }
                    break;
                case 'C':
                    // C3 is defined by the second number of the room as being a 3
                    if (roomNum[1] === '3') { // C3
                        if (roomNum[0] === '2') {
                            newBuilding = 'C3';
                            newFloor = '2';
                        } else if (roomNum[0] === '1') {
                            newBuilding = 'C3';
                            newFloor = '1';
                        } else {
                            newBuilding = 'C3';
                            newFloor = 'G';
                        }
                    } else { // C
                        if (roomNum[0] === '2') {
                            newBuilding = 'C';
                            newFloor = '2';
                        } else { //single letter search fix
                            newBuilding = 'C';
                            newFloor = '1';
                        }
                    }
                    break;
                case 'D':
                    if (roomNum[0] === '2') {
                        newBuilding = 'D';
                        newFloor = '2';
                    } else if (roomNum[0] === '1') {
                        newBuilding = 'D';
                        newFloor = '1';
                    } else { //single letter search fix
                        newBuilding = 'D';
                        newFloor = '1';
                    }
                    break;
                case 'E':
                    if (roomNum[0] === '3') {
                        newBuilding = 'E';
                        newFloor = '3';
                    } else if (roomNum[0] === '2') {
                        newBuilding = 'E';
                        newFloor = '2';
                    } else if (roomNum[0] === '1') {
                        newBuilding = 'E';
                        newFloor = '1';
                    } else {
                        newBuilding = 'E';
                        newFloor = '1';
                    }
                    break;
                case 'F':
                    if (roomNum[0] === '2') {
                        newBuilding = 'F';
                        newFloor = '2';
                    } else if (roomNum[0] === '1') {
                        newBuilding = 'F';
                        newFloor = '1';
                    } else {
                        newBuilding = 'F';
                        newFloor = '1';
                    }
                    break;
                case 'H':
                    if (roomNum[0] === '3') {
                        newBuilding = 'H';
                        newFloor = '3';
                    } else if (roomNum[0] === '2') {
                        newBuilding = 'H';
                        newFloor = '2';
                    } else if (roomNum[0] === '1') {
                        newBuilding = 'H';
                        newFloor = '1';
                    } else { //single letter search fix
                        newBuilding = 'H';
                        newFloor = '1';
                    }
                    break;
                case 'I':
                    if (roomNum[0] === '3') {
                        newBuilding = 'I';
                        newFloor = '3';
                    } else if (roomNum[0] === '2') {
                        newBuilding = 'I';
                        newFloor = '2';
                    } else if (roomNum[0] === '1') {
                        newBuilding = 'I';
                        newFloor = '1';
                    } else { //single letter search fix
                        newBuilding = 'I';
                        newFloor = '1';
                    }
                    break;
                case 'L':
                    if (roomNum[0] === '3') {
                        newBuilding = 'L';
                        newFloor = '3';
                    } else if (roomNum[0] === '2') {
                        newBuilding = 'L';
                        newFloor = '2';
                    } else if (roomNum[0] === '1') {
                        newBuilding = 'L';
                        newFloor = '1';
                    } else { //single letter search fix
                        newBuilding = 'L';
                        newFloor = '1';
                    }
                    break;
                    //added cases for non existent buildings. switches to campus map
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
                    // If the search involves an incorrect building AND room number stop search attempts
                    // notify user that building searched does not exist
                    if (roomNum[0] === '0' || roomNum[0] === '1' || roomNum[0] === '2' ||
                        roomNum[0] === '3' || roomNum[0] === '4' || roomNum[0] === '5' ||
                        roomNum[0] === '6' || roomNum[0] === '7' || roomNum[0] === '8' ||
                        roomNum[0] === '9') {
                        alert("Did you mean to search for building " + building + "?\nThat building doesn't exist.");
                        break;

                    }
                    alert(building + " is an invalid building.");
                    changeFloor('Campus');
                    break;
                default: // Alert user of invalid characters
                    // This alert is only reached when foreign characters that are read as
                    // a single character are used
                    // Examples: Spanish: ñ, ó, Russian: б,
                    // Characters/Symbols that are interpreted as more than one don't trigger
                    // this alert
                    // Examples: German: ß (interpreted as "ss"), Chinese: 你 (Interpreted as "you")
                    alert("I'm sorry, " + building + " is a character we don't understand.");
            }
        }
        if (curBuild !== newBuilding || floor !== newFloor) { // If either the building or the floor are different then a different map has to be loaded
            debug.msg("searchRoomNumber calls searchNewFloor");
            searchNewFloor(newBuilding, newFloor, roomNum);
        } else { // Otherwise activate the room
            debug.msg("searchRoomNumber calls activateRoom");
            activateRoom(roomNum, true);
        }
    }
    debug.end();
}

// Load the new map before activating the room
function searchNewFloor(building, floor, roomNum) {
    debug.group("Search New Floor");
    var newWindow = building;
    var curBuild = document.getElementById('building');
    var curFloor = document.getElementById('floor');

    if (curBuild.innerHTML !== building || curFloor.innerHTML !== floor) { // Check to make sure that the map needs to change
        debug.msg("searchNewFloor calls getMap");
        newWindow = getMap(building.toUpperCase(), floor);

        if (newWindow !== '') { // Provided that newWindow got set then add the map
            debug.msg("searchNewFloor calls addMap");
            addMap(newWindow, building, floor).then(function(response) {
                // debug.msg('Success!');
                debug.msg("searchNewFloor calls activateRoom");
                activateRoom(roomNum, true);
            }, function(error) {
                debug.error('Failed!', error);
            });
        }
    }
    debug.end();
}
