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
  for(var i = 0; i < eventNumber; i++)
  {
    var eventDay = eventArray[i][0].substring(eventArray[i][0].search(date.toLocaleString("en", {month: "long"})) + date.toLocaleString("en", {month: "long"}).length, eventArray[i][0].lastIndexOf(","));
    if(eventDay >= date.getDate() && eventDay <= date.getDate() + 14)
    {
        var event = document.createElement("div");
        event.className = "tab-group";

        var eventName = document.createElement("h5");
        eventName.innerText = eventArray[i][1];
        event.appendChild(eventName);

        var eventDate = document.createElement("p");
        eventDate.innerText = eventArray[i][0];
        event.appendChild(eventDate);

        var eventTime = document.createElement("p");
        eventTime.innerText = eventArray[i][2];
        event.appendChild(eventTime);


        var eventLocation = document.createElement("p");
        eventLocation.innerText = eventArray[i][3];
        event.appendChild(eventLocation);

        if(re.test(eventArray[i][3]) == true)
        {
          var link = document.createElement("a");
          link.setAttribute('href', window.location.href.substring(0, window.location.href.search("#") + 1) + re.exec(eventArray[i][3]));
          link.appendChild(event);
          var eventDiv = document.querySelectorAll("div#campusEvents")[0].children[0].children[2];
          eventDiv.appendChild(link);
        }
        else if(re.test(eventArray[i][3]) == false || re.test(eventArray[i][3]) == null){
          var eventDiv = document.querySelectorAll("div#campusEvents")[0].children[0].children[2];
          eventDiv.appendChild(event);
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
  var savedEvents = localStorage.getObj("event_key");
  var savedEventNumber = localStorage.getObj("eventNumber_key");

  if(savedEvents == null && savedEventNumber == null)
  {
    getEvents();
  }
  else if(savedEvents[0][0].search(date.toLocaleString("en", {month: "long"})) < 0)
  {
    getEvents();
  }
  else{
    insertEvents(savedEvents, savedEventNumber);
  }
}
