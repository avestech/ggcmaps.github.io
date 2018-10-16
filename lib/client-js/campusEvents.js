/* jshint sub:true */

// Gets events from the GGC website and adds it to local storage then calls checkLocalStorage
function getEvents() {
    debug.group("Getting Events");
    Storage.prototype.setObj = function(key, obj) {
        this.setItem(key, JSON.stringify(obj));
    };
    var eventNumber = 0;
    var eventArray = [];
    var request = new XMLHttpRequest();
    request.open("GET", ("https://cors-anywhere.herokuapp.com/" + "http://www.ggc.edu/student-life/events-calendar/events-calendar/summary"));
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var container;
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(request.responseText, "text/html");
            var events = xmlDoc.querySelectorAll('.SECalendarSummaryDate');
            for (var i = 0; i < events.length; i++) {
                if (events[i].className != "SECalendarSummaryDate") {
                    debug.msg(false);
                } else {
                    if (events[i].querySelectorAll('.SECalendarPropertyContainer').length > 1) { // If the number of events in the property container are greater than 1 then it does the for loop to iterate each event
                        for (var x = 0; x < events[i].querySelectorAll('.SECalendarPropertyContainer').length; x++) { // For loop to iterate each event based on the length of the property container. A property container should have the information for a single event.
                            container = events[i].querySelectorAll('.SECalendarSummaryDateEventList'); // Container to hold the SECalendarSummaryDateEventList which can hold even or odd SECalenderProperty classes
                            eventArray[eventNumber] = new Array(events[i].querySelector('h3').innerText, // Creates a new array and gets the date, event name, event time, and event location of the event at index i and at the property child at the x'th position
                                container[0].children[x].querySelector('.SECalendarEventName').innerText,
                                container[0].children[x].children[0].children[2].innerText,
                                container[0].children[x].children[0].children[4].innerText.replace(/^\s+|\s+$/g, ""));
                            eventNumber += 1;
                        }
                    } else {
                        container = events[i].querySelectorAll('.SECalendarPropertyContainer'); // Entire div block that has the class name SECalendarPropertContainer. Used for getting certain children at a certain index
                        eventArray[eventNumber] = new Array(events[i].querySelector('h3').innerText, // Adds the date to the eventArray by using querySelector to get the inner text of the h3 tag
                            events[i].querySelector('.SECalendarEventName').innerText, // Adds the event name to the eventArray by using querySelector to get the inner text of the class SECalendarEventName
                            container[0].children[2].innerText, // Adds the time to the eventArray by getting the inner text of the child at index 2
                            container[0].children[4].innerText.replace(/^\s+|\s+$/g, "")); // Adds the location to the eventArray by getting the inner text of the child at index 4 and deletes extra spaces
                        eventNumber += 1;
                    }
                }
            }
            localStorage.setObj("event_key", eventArray);
            localStorage.setObj("eventNumber_key", eventNumber);
            var date = new Date(),
                y = date.getFullYear(),
                m = date.getMonth();
            localStorage.setObj("event_updated", date.getMonth() + 1 + "/" + date.getDate());
            checkLocalStorage();
        }
    };
    debug.end();
}

// Insert events into the campusEvents.html file
function insertEvents(eventArray, eventNumber) {
    debug.group("Insert Events");
    // Dates for weekly events
    var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
    var re = /[a-zA-Z]\-[A-Z|0-9][0-9]+/;
    // Appends div tag containing the events to campusEvents.html
    for (var i = 0; i < eventNumber; i++) {
        var eventDay = eventArray[i][0].substring(eventArray[i][0].search(date.toLocaleString("en", {
            month: "long"
        })) + date.toLocaleString("en", {
            month: "long"
        }).length, eventArray[i][0].lastIndexOf(","));
        if (eventDay >= date.getDate() && eventDay <= date.getDate() + 14) {
            var event = document.createElement("div");
            event.className = "event";

            var tab = document.createElement("div");
            tab.className = "tab-group";

            var eventName = document.createElement("h5");
            eventName.innerText = eventArray[i][1];

            var eventDate = document.createElement("p");
            eventDate.innerText = eventArray[i][0];

            var eventTime = document.createElement("p");
            eventTime.innerText = eventArray[i][2];


            var eventLocation = document.createElement("p");
            eventLocation.innerText = eventArray[i][3];

            var link = document.createElement("a");

            // Checks if regex applies to the event location without spaces
            var regexString = eventArray[i][3].replace(/ /g, '');
            var location = eventArray[i][3].split(", ");
            if (location[0].includes("(") == true) {
                var start = location[0].search("\\(");
                var end = location[0].search("\\)");
                location[0] = location[0].replace(location[0].substr(start - 1, end), "");
            }
            var splitLocations = location[0].split(" ");
            var isTrue = false;
            var eventDiv = document.querySelectorAll("div#campusEvents")[0].children[0].children[2];
            // If the string regexString is true for the regex test then set the link to the matching regex
            if (re.test(regexString) == true) {
                link.setAttribute('onclick', "closeTab('campusEvents');");
                link.setAttribute('href', "#" + re.exec(regexString)[0].replace("-", ""));
                link.appendChild(eventName);
                link.appendChild(eventDate);
                link.appendChild(eventTime);
                link.appendChild(eventLocation);
                event.appendChild(link);
                tab.appendChild(event);
                if (re.exec(regexString)[0].includes("W-G") == true) {
                    event.id = "W";
                } else if (re.exec(regexString)[0].substr(0, 1) == "C" && parseInt(re.exec(regexString)[0].substr(2, 4)) > 1300 && parseInt(re.exec(regexString)[0].substr(2, 4)) < 2000 ||
                    re.exec(regexString)[0].substr(0, 1) == "C" && parseInt(re.exec(regexString)[0].substr(2, 4)) > 2300 && parseInt(re.exec(regexString)[0].substr(2, 4)) < 3000) {
                    event.id = "C";
                } else {
                    event.id = re.exec(regexString)[0].substr(0, 1);
                }
                eventDiv.appendChild(tab);
            }

            // Checks the location of the event by referencing it with the JSON file
            else {
                var nameFromJSON = '';
                var letter;
                for (var b = 0; b < campus.buildings.length; b++) {
                    for (var f = 0; f < campus.buildings[b].floors.length; f++) {
                        for (var n = 0; n < campus.buildings[b].floors[f].roomNames.length; n++) {
                            if (splitLocations.length >= 2 && campus.buildings[b].floors[f].roomNames[n].name.toLowerCase().includes(splitLocations[0].toLowerCase() + "-" + splitLocations[1].toLowerCase()) == true) {
                                isTrue = true;
                                nameFromJSON = campus.buildings[b].floors[f].roomNames[n].name;
                                letter = campus.buildings[b].id.toUpperCase();
                                break;
                            }
                            else if (splitLocations.length == 1 && campus.buildings[b].floors[f].roomNames[n].name.toLowerCase().includes(splitLocations[0].toLowerCase()) == true) {
                                debug.msg('test');
                                isTrue = true;
                                nameFromJSON = campus.buildings[b].floors[f].roomNames[n].name;
                                letter = campus.buildings[b].id.toUpperCase();
                                break;
                            }
                        }
                        if (nameFromJSON !== '') {
                            break;
                        }
                    }
                    if (nameFromJSON !== '') {
                        debug.msg('Name from JSON: ' + nameFromJSON);
                        break;
                    }
                }

                // If isTrue is true create a anchor tag with the link to the location referenced by JSON
                if (isTrue == true) {
                    link.setAttribute('onclick', "closeTab('campusEvents');");
                    link.setAttribute('href', "#" + nameFromJSON);
                    event.id = letter;
                    link.appendChild(eventName);
                    link.appendChild(eventDate);
                    link.appendChild(eventTime);
                    link.appendChild(eventLocation);
                    event.appendChild(link);
                    tab.appendChild(event);
                    eventDiv.appendChild(tab);
                } else {
                    // Events seperated by the comma
                    if (location.length > 1 && location[1].includes("Building") == true || location.length > 1 && location[0].includes("Building") == true) {
                        // If the string at index 1 of location contains the string "Building" then set the link
                        if (location[1].includes("Building") == true) {
                            link.setAttribute('onclick', "closeTab('campusEvents');");
                            link.setAttribute('href', "#" + location[1].substr(location[1].search("Building") + 9));
                            event.id = location[1].substr(location[1].search("Building") + 9);
                            link.appendChild(eventName);
                            link.appendChild(eventDate);
                            link.appendChild(eventTime);
                            link.appendChild(eventLocation);
                            event.appendChild(link);
                            tab.appendChild(event);
                            eventDiv.appendChild(tab);
                        }
                        // If the string at index 0 of location contains the string "Building" letter then set the link
                        else {
                            var reg = /[A-Z|0-9][0-9]+/;
                            link.setAttribute('onclick', "closeTab('campusEvents');");
                            link.setAttribute('href', "#" + location[0].substr(location[0].search("Building") + 9) + reg.exec(location[1]));
                            event.id = location[0].substr(location[0].search("Building") + 9);
                            link.appendChild(eventName);
                            link.appendChild(eventDate);
                            link.appendChild(eventTime);
                            link.appendChild(eventLocation);
                            event.appendChild(link);
                            tab.appendChild(event);
                            eventDiv.appendChild(tab);
                        }
                    } else if (splitLocations.length == 2 && splitLocations[0].includes("Building") == true && splitLocations[1].length == 1) {
                        link.setAttribute('onclick', "closeTab('campusEvents');");
                        link.setAttribute('href', "#" + splitLocations[1]);
                        event.id = splitLocations[1];
                        link.appendChild(eventName);
                        link.appendChild(eventDate);
                        link.appendChild(eventTime);
                        link.appendChild(eventLocation);
                        event.appendChild(link);
                        tab.appendChild(event);
                        eventDiv.appendChild(tab);
                    }
                    // If the location has the string "student center"
                    else if (eventArray[i][3].includes("Student Center") == true) {
                        link.setAttribute('onclick', "closeTab('campusEvents');");
                        link.setAttribute('href', "#E");
                        event.id = "E";
                        link.appendChild(eventName);
                        link.appendChild(eventDate);
                        link.appendChild(eventTime);
                        link.appendChild(eventLocation);
                        event.appendChild(link);
                        tab.appendChild(event);
                        eventDiv.appendChild(tab);
                    }
                    // If its not in JSON or not in student center then it has no link
                    else {
                        event.appendChild(eventName);
                        event.appendChild(eventDate);
                        event.appendChild(eventTime);
                        event.appendChild(eventLocation);
                        tab.appendChild(event);
                        eventDiv.appendChild(tab);
                    }
                }
            }
        }
    }
    debug.end();
}

// Checks local storage for list of campus events.
function checkLocalStorage() {
    debug.group("Check Local Storage");
    Storage.prototype.getObj = function(key) {
        return JSON.parse(this.getItem(key));
    };
    var online = navigator.onLine;
    var currentDate = new Date(),
        y = currentDate.getFullYear(),
        m = currentDate.getMonth();
    if (online == true) {
        if (localStorage.getObj("event_key") == null || localStorage.getObj("eventNumber_key") == null) {
            getEvents();
        } else if (localStorage.getObj("event_updated") != (currentDate.getMonth() + 1 + "/" + currentDate.getDate())) {
            getEvents();
        } else {
            insertEvents(localStorage.getObj("event_key"), localStorage.getObj("eventNumber_key"));
        }
    } else {
        if (localStorage.getObj("event_key") == null || localStorage.getObj("eventNumber_key") == null) {
            debug.msg("No connection to retrieve events");
        } else {
            insertEvents(localStorage.getObj("event_key"), localStorage.getObj("eventNumber_key"));
        }
    }
    debug.end();
}

function sortEvents() {
    debug.group("Sort Events");
    var re = /[A-Z][A-Z|0-9][0-9]+/;
    var counter = 0;
    var listOfEvents = document.querySelectorAll("div.event");
    document.querySelectorAll("h5.no-events")[0].style.display = "none";
    var i;
    if (window.location.hash.length <= 2) {
        for (i = 0; i < listOfEvents.length; i++) {
            if (window.location.hash.substr(1) != listOfEvents[i].id) {
                listOfEvents[i].style.display = "none";
                counter++;
            } else if (window.location.hash.substr(1) == listOfEvents[i].id) {
                listOfEvents[i].style.display = "block";
            }
        }
        if (counter == listOfEvents.length) {
            document.querySelectorAll("h5.no-events")[0].style.display = "block";
        }
    } else if (re.test(window.location.hash.substr(1)) == true) {
        // Checking for building W
        if (window.location.hash.includes("WG") == true || window.location.hash.includes("C") == true && window.location.hash.substr(2, 4) > 1300 && window.location.hash.substr(2, 4) < 1400 || window.location.hash.includes("C") == true && window.location.hash.substr(2, 4) > 2300 && window.location.hash.substr(2, 4) < 2400) {
            for (i = 0; i < listOfEvents.length; i++) {
                if (listOfEvents[i].id == "W") {
                    listOfEvents[i].style.display = "block";
                } else {
                    listOfEvents[i].style.display = "none";
                    counter++;
                }
            }
            if (counter == listOfEvents.length) {
                document.querySelectorAll("h5.no-events")[0].style.display = "block";
            }
        }
        // Any other building besides W
        else {
            for (i = 0; i < listOfEvents.length; i++) {
                if (window.location.hash.substr(1, 1) == listOfEvents[i].id) {
                    listOfEvents[i].style.display = "block";
                } else {
                    listOfEvents[i].style.display = "none";
                    counter++;
                }
            }
            if (counter == listOfEvents.length) {
                document.querySelectorAll("h5.no-events")[0].style.display = "block";
            }
        }
    }
    // If hash is campus
    else if (window.location.hash == "#Campus") {
        for (i = 0; i < listOfEvents.length; i++) {
            listOfEvents[i].style.display = "block";
        }
    }
    // If hash is a string of words or a combination
    else {
        var letter;
        for (var b = 0; b < campus.buildings.length; b++) {
            for (var f = 0; f < campus.buildings[b].floors.length; f++) {
                for (var n = 0; n < campus.buildings[b].floors[f].roomNames.length; n++) {
                    if (window.location.hash.substr(1) == campus.buildings[b].floors[f].roomNames[n].name) {
                        letter = campus.buildings[b].id;
                        debug.msg(letter);
                    }
                }
            }
        }
        counter = 0;
        for (i = 0; i < listOfEvents.length; i++) {
            if (listOfEvents[i].id == letter) {
                listOfEvents[i].style.display = "block";
                counter++;
            } else {
                listOfEvents[i].style.display = "none";
            }
        }
        if (counter == listOfEvents.length) {
            document.querySelectorAll("h5.no-events")[0].style.display = "block";
        }
    }
    openTab('campusEvents');
    debug.end();
}
