// Gets events from the GGC website and adds it to local storage then calls checkLocalStorage
function getEvents()  {
  console.log("Getting Events");
  Storage.prototype.setObj = function(key, obj) {
    this.setItem(key, JSON.stringify(obj))
  }
  var eventNumber = 0;
  var eventArray = [];
  var request = new XMLHttpRequest();
  request.open("GET", ("https://cors-anywhere.herokuapp.com/" + "http://www.ggc.edu/student-life/events-calendar/events-calendar/summary"));
  request.send(null);
  request.onreadystatechange = function() {
    if (request.readyState == 4)  {
        var container;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(request.responseText, "text/html");
        var events = xmlDoc.querySelectorAll('.SECalendarSummaryDate');
        for(var i = 0; i < events.length; i++)  {
          if(events[i].className != "SECalendarSummaryDate")  {
              console.log(false);
          }
          else {
            if(events[i].querySelectorAll('.SECalendarPropertyContainer').length > 1) {                                                   // If the number of events in the property container are greater than 1 then it does the for loop to iterate each event
                for(var x = 0; x<events[i].querySelectorAll('.SECalendarPropertyContainer').length; x++)  {                               // For loop to iterate each event based on the length of the property container. A property container should have the information for a single event.
                    container = events[i].querySelectorAll('.SECalendarSummaryDateEventList');                                        // Container to hold the SECalendarSummaryDateEventList which can hold even or odd SECalenderProperty classes
                    eventArray[eventNumber] = new Array (events[i].querySelector('h3').innerText,                                         // Creates a new array and gets the date, event name, event time, and event location of the event at index i and at the property child at the x'th position
                                                         container[0].children[x].querySelector('.SECalendarEventName').innerText,
                                                         container[0].children[x].children[0].children[2].innerText,
                                                         container[0].children[x].children[0].children[4].innerText.replace(/^\s+|\s+$/g, "") );
                    eventNumber += 1;
                }
            }
            else {
                container = events[i].querySelectorAll('.SECalendarPropertyContainer');                                // Entire div block that has the class name SECalendarPropertContainer. Used for getting certain children at a certain index
                eventArray[eventNumber] = new Array (events[i].querySelector('h3').innerText,                              // Adds the date to the eventArray by using querySelector to get the inner text of the h3 tag
                                                     events[i].querySelector('.SECalendarEventName').innerText,            // Adds the event name to the eventArray by using querySelector to get the inner text of the class SECalendarEventName
                                                     container[0].children[2].innerText,                                   // Adds the time to the eventArray by getting the inner text of the child at index 2
                                                     container[0].children[4].innerText.replace(/^\s+|\s+$/g, "") );       // Adds the location to the eventArray by getting the inner text of the child at index 4 and deletes extra spaces
                eventNumber += 1;
            }
          }
        }
        localStorage.setObj("event_key", eventArray);
        localStorage.setObj("eventNumber_key", eventNumber);
        checkLocalStorage();
      }
    };
  }

// Insert events into the campusEvents.html file
function insertEvents(eventArray, eventNumber) {
  // Dates for weekly events
  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  var lastDay = new Date(y, m + 1, 0);
  var re = /[a-zA-Z]\-[A-Z|0-9][0-9]+/;
  // Appends div tag containing the events to campusEvents.html
  for(var i = 0; i < eventNumber; i++)  {
    var eventDay = eventArray[i][0].substring(eventArray[i][0].search(date.toLocaleString("en", {month: "long"})) + date.toLocaleString("en", {month: "long"}).length, eventArray[i][0].lastIndexOf(","));
    if(eventDay >= date.getDate() && eventDay <= date.getDate() + 14) {
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
        var regexString = eventArray[i][3].replace(/ /g,'');
        var location = eventArray[i][3].split(", ");
        if(location[0].includes("(") == true) {
          var start = location[0].search("\\(");
          var end = location[0].search("\\)");
          location[0] = location[0].replace(location[0].substr(start - 1, end), "");
        }
        var splitLocations = location[0].split(" ");
        var isTrue = false;
        if(re.test(regexString) == true) {
            link.setAttribute('href', window.location.href.substring(0, window.location.href.search("#") + 1) + re.exec(regexString));
            link.setAttribute('onclick', "closeTab('campusEvents');");
            link.appendChild(eventName);
            link.appendChild(eventDate);
            link.appendChild(eventTime);
            link.appendChild(eventLocation);
            event.appendChild(link);
            tab.appendChild(event);
            if(re.exec(regexString)[0].includes("C-G") == true) {
              event.id = "C3";
            }
            else {
              if(re.exec(regexString)[0].indexOf(0) == "C" && re.exec(regexString)[0].substr(2,4) > 1300 && re.exec(regexString)[0].substr(2, 4) < 2000 ||
                 re.exec(regexString)[0].indexOf(0) == "C" && re.exec(regexString)[0].substr(2,4) > 2300 && re.exec(regexString)[0].substr(2, 4) < 3000) {
                   event.id = "C3";
              }
              else {
                event.id = re.exec(regexString)[0].substr(0, 1);
              }
          }
          var eventDiv = document.querySelectorAll("div#campusEvents")[0].children[0].children[2];
          eventDiv.appendChild(tab);
        }
        // Checks the location of the event by referencing it with the JSON file
        else {
          var nameFromJSON;
          var letter;
          for(var buildingLetter in roomNames) {
              for(var floorNum in roomNames[buildingLetter])  {
                for(var floorNumIndex in roomNames[buildingLetter][floorNum]) {
                  if(splitLocations.length >= 2 && roomNames[buildingLetter][floorNum][floorNumIndex]["name"].includes(splitLocations[0].toLowerCase() + "-" + splitLocations[1].toLowerCase()) == true)  {
                    isTrue = true;
                    nameFromJSON = roomNames[buildingLetter][floorNum][floorNumIndex]["name"];
                    letter = buildingLetter.toUpperCase();
                  }
                  else if(splitLocations.length == 1 && roomNames[buildingLetter][floorNum][floorNumIndex]["name"].includes(splitLocations[0].toLowerCase()) == true) {
                    isTrue = true;
                    nameFromJSON = roomNames[buildingLetter][floorNum][floorNumIndex]["name"];
                    letter = buildingLetter.toUpperCase();
                  }
                }
              }
            }
          // If isTrue is true create a anchor tag with the link to the location referenced by JSON
          if(isTrue == true) {
            link.setAttribute('href', window.location.href.substring(0, window.location.href.search("#") + 1) + nameFromJSON);
            link.setAttribute('onclick', "closeTab('campusEvents');");
            event.id = letter;
            link.appendChild(eventName);
            link.appendChild(eventDate);
            link.appendChild(eventTime);
            link.appendChild(eventLocation);
            event.appendChild(link);
            tab.appendChild(event);
            var eventDiv = document.querySelectorAll("div#campusEvents")[0].children[0].children[2];
            eventDiv.appendChild(tab);
          }
          else {
            if(location.length > 1 && location[1].includes("Building") == true || location.length > 1 && location[0].includes("Building") == true){
                if(location[1].includes("Building") == true) {
                  link.setAttribute('href', window.location.href.substring(0, window.location.href.search("#") + 1) + location[1].substr(location[1].search("Building") + 9));
                  event.id = location[1].substr(location[1].search("Building") + 9);
                  link.setAttribute('onclick', "closeTab('campusEvents');");
                  link.appendChild(eventName);
                  link.appendChild(eventDate);
                  link.appendChild(eventTime);
                  link.appendChild(eventLocation);
                  event.appendChild(link);
                  tab.appendChild(event);
                  var eventDiv = document.querySelectorAll("div#campusEvents")[0].children[0].children[2];
                  eventDiv.appendChild(tab);
              }
              else {
                  var reg = /[A-Z|0-9][0-9]+/;
                  link.setAttribute('href', window.location.href.substring(0, window.location.href.search("#") + 1) + location[0].substr(location[0].search("Building") + 9) + reg.exec(location[1]));
                  event.id = location[0].substr(location[0].search("Building") + 9);
                  link.setAttribute('onclick', "closeTab('campusEvents');");
                  link.appendChild(eventName);
                  link.appendChild(eventDate);
                  link.appendChild(eventTime);
                  link.appendChild(eventLocation);
                  event.appendChild(link);
                  tab.appendChild(event);
                  var eventDiv = document.querySelectorAll("div#campusEvents")[0].children[0].children[2];
                  eventDiv.appendChild(tab);
              }
            }
            else if(eventArray[i][3].includes("Student Center") == true)  {
              link.setAttribute('href', window.location.href.substring(0, window.location.href.search("#") + 1) + "E");
              event.id = "E";
              link.setAttribute('onclick', "closeTab('campusEvents');");
              link.appendChild(eventName);
              link.appendChild(eventDate);
              link.appendChild(eventTime);
              link.appendChild(eventLocation);
              event.appendChild(link);
              tab.appendChild(event);
              var eventDiv = document.querySelectorAll("div#campusEvents")[0].children[0].children[2];
              eventDiv.appendChild(tab);
            }
            else {
              event.appendChild(eventName);
              event.appendChild(eventDate);
              event.appendChild(eventTime);
              event.appendChild(eventLocation);
              tab.appendChild(event);
              var eventDiv = document.querySelectorAll("div#campusEvents")[0].children[0].children[2];
              eventDiv.appendChild(tab);
            }
          }
        }
    }
  }
}

// Checks local storage for list of campus events.
function checkLocalStorage() {
  Storage.prototype.getObj = function(key) {
      return JSON.parse(this.getItem(key))
  }
  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  if(localStorage.getObj("event_key") == null || localStorage.getObj("eventNumber_key") == 0) {
    getEvents();
  }
  else if(localStorage.getObj("event_key") != null && localStorage.getObj("event_key")[0][0].includes(date.toLocaleString("en", {month: "long"})) == false) {
    getEvents();
  }
  else{
    insertEvents(localStorage.getObj("event_key"), localStorage.getObj("eventNumber_key"));
  }
}
