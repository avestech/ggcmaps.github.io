var floorsA = [];
var floorsB = ['1', '2', '3'];
var floorsC = ['1', '2'];
var floorsC3 = ['G', '1', '2'];
var floorsD = ['1', '2'];
var floorsE = ['1', '2', '3'];
var floorsF = ['1', '2'];
var floorsH = ['1', '2', '3'];
var floorsI = ['1', '2'];
var floorsL = ['1', '2', '3'];

document.addEventListener('DOMContentLoaded', function() {

  addMap('Building/C/First-Floor.html', 'C', '1').then(function(response) {
    // console.log('Success!');
    floorDropDown('C');
    document.getElementById('floor').value = '1';
  }, function(error) {
    console.error('Failed!', error);
  });

});

function convertToElement(html) {
  var temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.childNodes[0];
}

function addMap(mapLocation, building, floor) {
  var curBuild = document.getElementById('building');
  var curFloor = document.getElementById('floor');
  var nav = document.getElementsByClassName('nav')[0];
  var mapHolder = document.getElementById('svg-holder');

  return new Promise(function(resolve, reject) {

    var req = new XMLHttpRequest();
    req.open('GET', mapLocation, true);
    req.onload = function() {
      // if (req.readyState!==4) reject(Error(req.statusText));
      if (req.status!==200) reject(Error(req.statusText));

      if (building !== curBuild) {
        floorDropDown(building);
      }

      // Remove all maps
      removeMap();
      // Add new map
      mapHolder.appendChild(convertToElement(req.response));

      // Set the map height to the browser's height and enable panZoomTiger
      var map = mapHolder.childNodes[0];
      map.style.height = nav.clientHeight;
      curBuild.innerHTML = building;
      curFloor.value = floor;

      var eventsHandler;
      eventsHandler = {
        haltEventListeners: ['touchStart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
        init: function(options) {
          var instance = options.instance,
          initialScale = 1,
          pannedX = 0,
          pannedY = 0;

          // Init Hammer
          // Listen only for pointer and touch events
          this.hammer = Hammer(options.svgElement, {
            inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
          });

          // Enable pinch
          this.hammer.get('pinch').set({enable: true});

          // Handle double tap
          this.hammer.on('doubletap', function(ev) {
            instance.zoomIn();
          });

          // Handle pan
          this.hammer.on('panstart panmove', function(ev) {
            // On pan start reset panned variables
            if (ev.type === 'panstart') {
              pannedX = 0;
              pannedY = 0;
            }

            // Pan only the difference
            instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY});
            pannedX = ev.deltaX;
            pannedY = ev.deltaY;
          });

          // Handle pinch
          this.hammer.on('pinchstart pinchmove', function(ev) {
            // On pinch start remember initial zoom
            if (ev.type === 'pinchstart') {
              initialScale = instance.getZoom();
              instance.zoom(initialScale * ev.scale);
            }

            instance.zoom(initialScale * ev.scale);
          });

          // Prevent moving the page on some devices when panning over SVG
          options.svgElement.addEventListener('touchmove', function(e) { e.preventDefault(); });
        },
        destroy: function() {
          this.hammer.destroy();
        }
      };

      var panZoomTiger = svgPanZoom(map, {
        controlIconsEnabled:true,
        fit:1,
        center:1,
        customEventsHandler: eventsHandler
      });

      // Resize the panZoomTiger when the window resizes
      window.addEventListener('resize', function() {
        // Resize the map height to adjust the panZoomTiger height
        map.style.height = nav.clientHeight;

        panZoomTiger.resize();
        panZoomTiger.fit();
        panZoomTiger.center();
      });

      resolve(req.response);
    };

    req.onerror = function() {
      reject(Error('Network Error'));
    };

    req.send();
  });
}

function removeMap() {
  var mapHolder = document.getElementById('svg-holder');
  while (mapHolder.hasChildNodes()) {
    mapHolder.removeChild(mapHolder.lastChild);
  }
}

function floorDropDown(building) {
  var dropdown = document.getElementById('floor');
  while (dropdown.hasChildNodes()) {
    dropdown.removeChild(dropdown.lastChild);
  }

  var floors = [];

  switch (building) {
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

  for (var i = 0; i < floors.length; i++) {
    var option = '<option value="' + floors[i] + '">' + floors[i] + '</option>';
    dropdown.appendChild(convertToElement(option));
  }
}

function activateRoom(roomID, search) {
  var roomClass = 'room-group';
  var room = document.getElementById(roomID.toLowerCase());

  if (room === null) {
    alert('No room found for ' + roomID);
  } else {
    var roomClassName = room.className.baseVal;

    if (roomClassName !== roomClass && !search) {
      // console.log('not active');
      if (roomClassName === roomClass + ' active-room') {
        deactivateAllRooms();
        return;
      }
      return;
    }
    else if (roomClassName === roomClass) {

      deactivateAllRooms();

      room.classList.add('active-room');
    }
  }
}

function deactivateAllRooms() {
  var roomClass = 'room-group';
  var room = document.getElementsByClassName(roomClass);

  for (var i = 0; i < room.length; i++) {
    room[i].classList.remove('active-room');
  }
}

function resetWidth(panZoomTiger) {
  console.log('resize');
  // var panZoomTiger = svgPanZoom(map, {controlIconsEnabled:true, fit:1, center:1});
  panZoomTiger.resize();
  panZoomTiger.fit();
  panZoomTiger.center();
}

function searchFromBar(event) {
  if (event.which == 13 || event.keyCode == 13) {
    searchRoomNumber();
  }
}

function searchFromMenu(sRoom) {
  closeMenu();
  document.getElementById('roomSearch').value = sRoom;
  searchRoomNumber();
}

function searchRoomNumber() {
  var sRoom = document.getElementById('roomSearch').value.toUpperCase();
  var roomNum = sRoom;
  var building = document.getElementById('building').innerHTML;
  var floor = document.getElementById('floor').value;

  var newWindow = '';
  var newBuilding = '';
  var newFloor = '';

  if (sRoom.length === 4) {

    switch (building) {
      case 'A':
        alert('A Building not currently searchable');
        break;
      case 'B':
        alert('B Building not currently searchable');
        break;
      case 'C':
        if (roomNum[1] === '3') {
          if (roomNum[0] === '2') {
            newBuilding = 'C3';
            newFloor = '2';
          }
          else if (roomNum[0] == '1') {
            newBuilding = 'C3';
            newFloor = '1';
          }
          else if (roomNum[0] == 'G') {
            newBuilding = 'C3';
            newFloor = 'G';
          }
        }
        else if (roomNum[0] === '2') {
          newBuilding = 'C';
          newFloor = '2';
        }
        else if (roomNum[0] == '1') {
          newBuilding = 'C';
          newFloor = '1';
        }
        break;
      case 'C3':
      if (roomNum[0] === '2') {
        newBuilding = 'C3';
        newFloor = '2';
      }
      else if (roomNum[0] == '1') {
        newBuilding = 'C3';
        newFloor = '1';
      }
      else if (roomNum[0] == 'G') {
        newBuilding = 'C3';
        newFloor = 'G';
      }
      break;
      case 'D':
        alert('D Building not currently searchable');
        break;
      case 'E':
        alert('E Building not currently searchable');
        break;
      case 'F':
        alert('F Building not currently searchable');
        break;
      case 'H':
        alert('H Building not currently searchable');
        break;
      case 'I':
        alert('I Building not currently searchable');
        break;
      case 'L':
        alert('L Building not currently searchable');
        break;
      default:
        alert('Cannot find ' + sRoom);
    }
  }
  else if (sRoom.length === 5) {
    roomNum = sRoom.substring(1);

    switch (sRoom[0]) {
      case 'a':
        alert('A Building not currently searchable');
        break;
      case 'A':
        alert('A Building not currently searchable');
        break;
      case 'b':
        alert('B Building not currently searchable');
        break;
      case 'B':
        alert('B Building not currently searchable');
        break;
      case 'c':
        if (roomNum[1] === '3') {
          if (roomNum[0] === '2') {
            newBuilding = 'C3';
            newFloor = '2';
          }
          else if (roomNum[0] == '1') {
            newBuilding = 'C3';
            newFloor = '1';
          }
          else if (roomNum[0] == 'G') {
            newBuilding = 'C3';
            newFloor = 'G';
          }
        }
        else if (roomNum[0] === '2') {
          newBuilding = 'C';
          newFloor = '2';
        }
        else if (roomNum[0] == '1') {
          newBuilding = 'C';
          newFloor = '1';
        }
        break;
      case 'C':
        if (roomNum[1] === '3') {
          if (roomNum[0] === '2') {
            newBuilding = 'C3';
            newFloor = '2';
          }
          else if (roomNum[0] == '1') {
            newBuilding = 'C3';
            newFloor = '1';
          }
          else if (roomNum[0] == 'G') {
            newBuilding = 'C3';
            newFloor = 'G';
          }
        }
        else if (roomNum[0] === '2') {
          newBuilding = 'C';
          newFloor = '2';
        }
        else if (roomNum[0] == '1') {
          newBuilding = 'C';
          newFloor = '1';
        }
        break;
      case 'd':
        alert('D Building not currently searchable');
        break;
      case 'D':
        alert('D Building not currently searchable');
        break;
      case 'e':
        alert('E Building not currently searchable');
        break;
      case 'E':
        alert('E Building not currently searchable');
        break;
      case 'f':
        alert('F Building not currently searchable');
        break;
      case 'F':
        alert('F Building not currently searchable');
        break;
      case 'h':
        alert('H Building not currently searchable');
        break;
      case 'H':
        alert('H Building not currently searchable');
        break;
      case 'i':
        alert('I Building not currently searchable');
        break;
      case 'I':
        alert('I Building not currently searchable');
        break;
      case 'l':
        alert('L Building not currently searchable');
        break;
      case 'L':
        alert('L Building not currently searchable');
        break;
      default:
        alert('Cannot find ' + sRoom);
    }
  }
  else {
    alert("Invalid room number. Please don't use any spaces");
  }

  if (building !== newBuilding || floor !== newFloor) {
    searchNewFloor(newBuilding, newFloor, roomNum);
  }
  else {
    activateRoom(roomNum, true);
  }
}

function changeFloor(building, floor) {
  closeMenu();
  var newWindow = building.toUpperCase();
  var searchBar = document.getElementById('roomSearch');
  searchBar.value = '';

  switch (building.toUpperCase()) {
    case 'A':

      break;
    case 'B':

      break;
    case 'C':
      if (floor === '1') {
        newWindow = 'Building/C/First-Floor.html';
      }
      else {
        newWindow = 'Building/C/Second-Floor.html';
      }
      break;
    case 'C3':
      if (floor === 'G') {
        newWindow = 'Building/C3/Ground-Floor.html';
      }
      else if (floor === '1') {
        newWindow = 'Building/C3/First-Floor.html';
      }
      else if (floor === '2') {
        newWindow = 'Building/C3/Second-Floor.html';
      }
      break;
    case 'D':

      break;
    case 'E':

      break;
    case 'F':

      break;
    case 'H':

      break;
    case 'I':

      break;
    case 'L':

      break;
  }

  addMap(newWindow, building, floor).then(function(response) {
    // console.log('Success!');
    activateRoom(roomNum, true);
  }, function(error) {
    console.error('Failed!', error);
  });
}

function searchNewFloor(building, floor, roomNum) {
  var newWindow = building;
  var curBuild = document.getElementById('building');
  var curFloor = document.getElementById('floor');

  if (curBuild.innerHTML !== building || curFloor.value !== floor) {

    switch (building) {
      case 'A':

        break;
      case 'B':

        break;
      case 'C':
        if (floor === '1') {
          newWindow = 'Building/C/First-Floor.html';
        }
        else {
          newWindow = 'Building/C/Second-Floor.html';
        }
        break;
      case 'C3':
        if (floor === 'G') {
          newWindow = 'Building/C3/Ground-Floor.html';
        }
        else if (floor === '1') {
          newWindow = 'Building/C3/First-Floor.html';
        }
        else if (floor === '2') {
          newWindow = 'Building/C3/Second-Floor.html';
        }
        break;
      case 'D':

        break;
      case 'E':

        break;
      case 'F':

        break;
      case 'H':

        break;
      case 'I':

        break;
      case 'L':

        break;
    }

    addMap(newWindow, building, floor).then(function(response) {
      // console.log('Success!');
      activateRoom(roomNum, true);
    }, function(error) {
      console.error('Failed!', error);
    });
  }
}
