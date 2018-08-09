// Checks if c is a letter
function isLetter(c) {
    return c.toLowerCase() !== c.toUpperCase();
}

// Checks if n is a number
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// Split str on specific symbols
// Prevents the possiblity of remote code execution
// Uses the array to create a json object to return
function parseSearch(str) {
    debug.group("Parse Search");
    var res = str.split(/[ \+-\s<>'"();/\\]+/);
    var building = '';
    var room = '';
    var roomName = '';
    debug.msg("Search: " + str);

    for (var i = 0; i < res.length; i++) {

        // If res[i] is a single letter and at the beginning of the string, then it is a building
        if (res[i].length === 1 && isLetter(res[i]) && i === 0) {
            // Assign res[i] to building
            building = res[i];
        }
        // If res[i] is 4 characters long
        else if (res[i].length === 4) {
            //assign res[i] to room if its numeric.
            if (isNumeric(res[i])) {
                //building search just for 2000 or 3000 buildig, Assign res[i] to building
                if (res[i] == "2000" || res[i] == "3000")
                    building = res[i][0];
                else
                    // Assign res[i] to room
                    room = res[i];
            }
            //assign res[i] to room and building to C if first char is G and rest is numeric
            else if (res[i].charAt(0).toUpperCase() === 'G' && isNumeric(res[i].substring(1))) {
                room = res[i];
                building = 'C';
            } else {
                if (roomName !== '') {
                    roomName += '-';
                }
                roomName += res[i];
            }
        }

        //If res[i] is 5 characters long
        else if (res[i].length === 5) {
            if (isNumeric(res[i].substring(1))) { //if search is like 'b1200'
                room = res[i].substring(1);
                building = res[i].charAt(0); //added to set building to first char
            } else if (isNumeric(res[i].substring(0, 4))) { //search is like 'b 3500b'
                room = res[i];
            } else { //concat room name. Fixed chick fil a search
                if (roomName !== '') {
                    roomName += '-';
                }
                roomName += res[i];
            }
        }

        //code for rooms with letter at end ie B3500b
        else if (res[i].length === 6 && isNumeric(res[i].substring(1, 5))) { //check middle chars are numeric
            room = res[i].substring(1);
            building = res[i].charAt(0);
        }
        // Otherwise concatinate the room name together
        else {
            if (roomName !== '') {
                roomName += '-';
            }
            roomName += res[i];

        }
    }
    // Checks to see if the ground floor of C3 made it into roomName instead of building and room
    if (building === '' && room === '' && roomName !== '') {
        // The first character would be the building letter and the 3 character is a number
        // The second character would be a 'G'
        if (isLetter(str[0]) && isNumeric(str[2])) {
            building = str[0];
            room = str.substring(1);
            roomName = '';
        }
    }

    /* TODO remove
        Patch work for C3 while it is still classified as a seperate building from C
    */
    if (building.toUpperCase() === 'C' && room[1] === '3') {
        building = 'C3';
        roomName = '';
    }

    // Create a json object to pass the data back
    var result = {
        building: building,
        room: room,
        roomName: roomName.toLowerCase()
    };

    debug.msg(result);

    debug.end();
    return result;
}

// Turn on the popup functionality
function activatePopup(popup, id) {
    debug.group("Activate Popup");
    // Show it on mouse over
    popup.onmouseover = function() {
        document.getElementById(id).classList.toggle('popup-active');
    };
    // Hide it on mouse out
    popup.onmouseout = function() {
        document.getElementById(id).classList.toggle('popup-active');
    };
    debug.end();
}

// Creates a html element that can be used in appendChild
function convertToElement(html) {
    debug.group("Convert to Element");
    // Create a temportary div
    var temp = document.createElement('div');
    // Place the html in the div's innerhtml
    temp.innerHTML = html;
    // Then return the first node
    debug.end();
    return temp.childNodes[0];
}

// Retrieve the client's window hight
function getClientHeight() {
    return (window.innerHeight || document.body.clientHeight) + 'px';
}

// Open any dropdown
// Just pass in the className of the dropdown and the className that will display the dropdown
function dropdown(drop, className) {
    debug.group("Drop Down");
    var dd = document.getElementsByClassName(drop)[0];
    dd.classList.toggle(className);
    debug.end();
}

// Whenever the width of the window changes update the size of panZoomTiger
function resetWidth(panZoomTiger) {
    debug.group("Reset Width");
    debug.msg('resize');
    panZoomTiger.resize();
    panZoomTiger.fit();
    panZoomTiger.center();
    debug.end();
}

// Used to hide/show an element
// element is the element you want to hide/show
// hide True/False, use true to hide and false to show
function hideElement(element, hide) {
    debug.group("Hide Element");
    if (hide) {
        if (!element.classList.contains('hide')) {
            element.classList.toggle('hide');
        }
    } else {
        if (element.classList.contains('hide')) {
            element.classList.toggle('hide');
        }
    }
    debug.end();
}

// Load a file into a div
// element to load the contents of file into
// file the location of the file you want to load
function loadFile(element, file) {
    // Ensure that the file has loaded before certain functions are called
    return new Promise(function(resolve, reject) {
        debug.group("Load File");
        var req = new XMLHttpRequest();
        req.open('GET', file, true);
        req.onload = function() {
            // if (req.readyState!==4) reject(Error(req.statusText));
            if (req.status !== 200) reject(Error(req.statusText));

            // Find the element you are trying to load the file into
            var htmlElement = document.getElementById(element);
            // Append it in
            htmlElement.appendChild(convertToElement(req.response));

            resolve(req.response);
        };

        req.onerror = function() {
            reject(Error('Network Error'));
        };

        req.send();
        debug.end();
    });
}

// Closes the active tab if the user clicks outside of the tab
function toggleTab(ev, element) {
    debug.group("Toggle Tab");
    var target = document.getElementById(element);
    // Checks if the ev.target is a descendant of the element
    if (!isDescendant(target, ev.target) && target.classList.contains('tab-active')) {
        target.classList.toggle('tab-active');
    }
    debug.end();
}

// Checks the parent of child until it either finds parent otherwise returns false
function isDescendant(parent, child) {
    debug.group("Is Decendant");
    var node = child.parentNode;
    while (node !== null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    debug.end();
    return false;
}
