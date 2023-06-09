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
    turnOffLegend();
    debug.group("Search From Menu");
    closeMenu();
    debug.msg("searchFromMenu calls parseSearch");
    var data = switchMap(sRoom);
    if (data.roomName !== '') {
        // If roomName is not empty then add the roomName to the search bar
        document.getElementById('roomSearch').value = data.roomName;
    } else {
        // Otherwise add the building and room to the search bar
        document.getElementById('roomSearch').value = data.building + ' ' + data.room;
    }
    debug.msg("searchFromMenu calls searchRoomNumber");
    searchRoomNumber(data);
    debug.end();
}

// Search for a room
function searchRoomNumber(data) {
    debug.group("Search Room Number");
    // Create the var rInfo and set it to the parsed value of the search bar, forced to uppercase
     turnOffLegend();
    // var rInfo = parseSearch(document.getElementById('roomSearch').value.toUpperCase()); // The room being searched for
    var rInfo;
    if (data !== undefined) {
        debug.msg('Data Passed');
        rInfo = data;
    } else {
        debug.msg('Data Not Passed');
        rInfo = switchMap(document.getElementById('roomSearch').value);
    }
    debug.msg(rInfo);

    // If the Campus map is being searched for load the map and end the function
    if (rInfo.roomName.toLowerCase() === 'campus' || rInfo.building.toLowerCase() === 'campus') {
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
        var floor = document.getElementById('floor').innerHTML; // Current Floor

        // Empty variables to compare the search to the current
        var newBuilding = '';
        var newFloor = '';

        // Assign variables from rInfo
        if (rInfo.building !== '') {
            debug.msg('New Building: ' + rInfo.building);
            newBuilding = rInfo.building;
        }
        if (rInfo.floor !== '') {
            debug.msg('New Floor: ' + rInfo.floor);
            newFloor = rInfo.floor;
        }
        debug.msg('New Room: ' + rInfo.room);
        if (rInfo.room !== '') {
            roomNum = rInfo.room;
        }
        var upperHash = function() {
            debug.group("Upper Hash");
            // Update the location hash to be the building plus the room number
            if (rInfo.roomName !== '') {
                window.location.hash = rInfo.roomName;
            }
            else if (roomNum !== "4983") {
                window.location.hash = newBuilding.toUpperCase() + '-' + roomNum.toUpperCase();
            } else {
                window.location.hash = newBuilding.toUpperCase();
            }
            debug.msg("urlRoom stopped by upperHash()");
            clearTimeout(urlTimer);
            debug.end();
        };
        upperHash();

        if (building !== newBuilding || floor !== newFloor) { // If either the building or the floor are different then a different map has to be loaded
            debug.msg("searchRoomNumber calls searchNewFloor");
            searchNewFloor(newBuilding, newFloor, roomNum, rInfo.map);
        } else { // Otherwise activate the room
            debug.msg("searchRoomNumber calls activateRoom");
            activateRoom(roomNum, true);
        }
    }
    debug.end();
}

// Load the new map before activating the room
function searchNewFloor(building, floor, roomNum, map) {
     turnOffLegend();
    debug.group("Search New Floor");
    var newWindow = building;
    var curBuild = document.getElementById('building');
    var curFloor = document.getElementById('floor');

    if (curBuild.innerHTML !== building || curFloor.innerHTML !== floor) { // Check to make sure that the map needs to change
        newWindow = map;

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
