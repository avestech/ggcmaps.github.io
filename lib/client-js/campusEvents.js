function getEvents()  {
  console.log("Getting Events");
  var eventNumber = 0;
  var eventArray = [];
  var request = new XMLHttpRequest();
  request.open("GET", ("https://cors-anywhere.herokuapp.com/" + "http://www.ggc.edu/student-life/events-calendar/events-calendar/summary"));
  request.send(null);
  request.onreadystatechange = function() {
    if (request.readyState == 4)  {                                                               // A readystate of 4 means that the state of the request is DONE
        var container;
        var parser = new DOMParser();                                                             // Creates a new DOMParser named parser to parse DOM elements
        var xmlDoc = parser.parseFromString(request.responseText, "text/html");                   // Creates a variable named xmlDoc that parses xml from a string which takes the parameters (xmlString, mimeType)
        var events = xmlDoc.querySelectorAll('.SECalendarSummaryDate');                           // Creates a variable named events and selects all classes that are called SECalendarSummaryDate from the xmlString. SECalendarSummaryDate is a list item from an unorderd list that contains 1 or more events.
        for(var i = 0; i < events.length; i++)  {                                                 // Loops through all the events with the class name SECalendarSummaryDate
          if(events[i].className != "SECalendarSummaryDate")  {                                   // Check if it is the correct class
              console.log(false);                                                                 // Prints false if class is not correct
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
        insertEvents(eventArray, eventNumber);
      }
    };
  }

function insertEvents(eventArray, eventNumber) {
  var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  var firstDay = new Date(y, m, 1);
  var lastDay = new Date(y, m + 1, 0);

  for(var i = 0; i < eventNumber; i++)
  {
    var eventDay = eventArray[i][0].substring(eventArray[i][0].search(date.toLocaleString("en", {month: "long"})) + date.toLocaleString("en", {month: "long"}).length, eventArray[i][0].lastIndexOf(","));
    if(eventDay >= date.getDate() - date.getDay() && eventDay <= date.getDate() - date.getDay() + 6 || eventDay <= lastDay.getDate() - lastDay.getDay() && eventDay >= lastDay.getDate())
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

        var eventDiv = document.querySelectorAll("div#campusEvents")[0].children[0].children[2];
        eventDiv.appendChild(event);
    }
  }
}
