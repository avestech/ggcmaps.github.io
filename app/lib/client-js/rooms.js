// Buildings
var campus = 'Building/(Campus)/campus.html';
var buildingA = ['Building/A/First-Floor.html'];
var buildingB = ['Building/B/first-floor.html', 'Building/B/second-floor.html', 'Building/B/third-floor.html'];
var buildingC = ['Building/C/First-Floor.html', 'Building/C/Second-Floor.html'];
var buildingC3 = ['Building/C3/Ground-Floor.html', 'Building/C3/First-Floor.html', 'Building/C3/Second-Floor.html'];
var buildingD = ['Building/D/First-Floor.html', 'Building/D/Second-Floor.html'];
var buildingE = ['Building/E/First-Floor.html', 'Building/E/Second-Floor.html', 'Building/E/Third-Floor.html'];
var buildingF = ['Building/F/First-Floor.html', 'Building/F/Second-Floor.html'];
var buildingH = ['Building/H/First-Floor.html', 'Building/H/Second-Floor.html', 'Building/H/Third-Floor.html'];
var buildingI = ['Building/I/First-Floor.html', 'Building/I/Second-Floor.html', 'Building/I/Third-Floor.html'];
var buildingL = ['Building/L/First-Floor.html', 'Building/L/Second-Floor.html', 'Building/L/Third-Floor.html'];

// Floors
var floorsA = ['1'];
var floorsB = ['1', '2', '3'];
var floorsC = ['1', '2'];
var floorsC3 = ['G', '1', '2'];
var floorsD = ['1', '2'];
var floorsE = ['1', '2', '3'];
var floorsF = ['1', '2'];
var floorsH = ['1', '2', '3'];
var floorsI = ['1', '2', '3'];
var floorsL = ['1', '2', '3'];

// JSON of room names
var roomNames;

// Help Documentation
var helpFile = 'help.html';
// Developed By
var devFile = 'devs.html';

// Hiding the element or not
var HIDE = true;
var SHOW = false;

document.addEventListener('DOMContentLoaded', function() {

  addMap(campus, 'Campus').then(function(response) {
    // console.log('Success!');
  }, function(error) {
    console.error('Failed!', error);
  });

  loadRooms().then(function(response) {
    // console.log(roomNames);
  }, function(error) {
    console.error('Failed!', error);
  });

  loadFile('helpbox', helpFile).then(function(response) {
    // console.log('Help Content Loaded');
  }, function(error) {
    console.error('Failed!', error);
  });

  loadFile('devbox', devFile).then(function(response) {
    // console.log('Developer Content Loaded');
  }, function(error) {
    console.error('Failed!', error);
  });

  var building = document.getElementById('building');
  var floor = document.getElementById('floor');
  var menu = document.getElementById('menu');
  var search = document.getElementById('search');

  activatePopup(building, 'building-popup');
  activatePopup(floor, 'floor-popup');
  activatePopup(menu, 'menu-popup');
  activatePopup(search, 'search-popup');
});

function loadRooms() {
  return new Promise(function(resolve, reject) {

    var req = new XMLHttpRequest();
    req.open('GET', 'js/roomNames.json', true);
    req.onload = function() {
      // if (req.readyState!==4) reject(Error(req.statusText));
      if (req.status!==200) reject(Error(req.statusText));

      roomNames = JSON.parse(req.response);

      resolve(req.response);
    };

    req.onerror = function() {
      reject(Error('Network Error'));
    };

    req.send();
  });
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
        var buildingPop = document.getElementById("building-popup");
        var dropdown = document.getElementsByClassName('dropdown')[0];
        var legend = document.getElementsByClassName('campus-info')[0];

        if (building === 'Campus') {
          hideElement(buildingPop, HIDE);
          hideElement(legend, SHOW);
        }
        else {
          hideElement(buildingPop, SHOW);
          hideElement(legend, HIDE);
        }

        if (floor !== undefined) {
          hideElement(curFloor, SHOW);
          hideElement(dropdown, SHOW);
          floorDropDown(building);
          curFloor.innerHTML = floor;
        }
        else {
          hideElement(curFloor, HIDE);
          hideElement(dropdown, HIDE);
        }
      }

      // Remove all maps
      removeMap();
      // Add new map
      // console.log(convertToElement(req.response));
      mapHolder.appendChild(convertToElement(req.response));
      // console.log(mapHolder);
      // Set the map height to the browser's height and enable panZoomTiger
      var map = mapHolder.childNodes[0];
      map.style.height = getClientHeight();
      curBuild.innerHTML = building;

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

          this.hammer.on('tap', function(ev) {
            toggleTab(ev, 'helpbox');
            toggleTab(ev, 'devbox');
            if (building === 'Campus') {
              var target = ev.target.parentNode.id.toUpperCase();
              if (target === 'A') {
                changeFloor(target);
              }
              else if (target === 'C3') {
                changeFloor(target, 'G');
              }
              else {
                for (var rbuilding in roomNames) {
                  if (target === rbuilding) {
                    changeFloor(rbuilding, '1');
                  }
                }
              }
            }
            else {
              var room = ev.target.parentNode.id;
              if (room.length === 4 || room.length === 5) {
                activateRoom(ev.target.parentNode.id);
              }
            }
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
        map.style.height = getClientHeight();

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
  var dropdown = document.getElementsByClassName('floors')[0];
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
    var option = '<h2 onclick="changeFloor(\'' + building + '\', \'' + floors[i] + '\')">Floor ' + floors[i] + '</h2>';
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
  var curBuild = building;
  var floor = document.getElementById('floor').innerHTML;

  var newWindow = '';
  var newBuilding = '';
  var newFloor = '';

  var rInfo = parseSearch(sRoom);
  if (rInfo.building !== '') {
    building = rInfo.building;
  }
  if (rInfo.room !== '') {
    roomNum = rInfo.room;
  }
  if (rInfo.roomName !== '') {
    roomNum = '';
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
            newBuilding = tempBuilding;
            newFloor = tempFloor;
            roomNum = tempRoom.id;
          }
        }
      }
    }

    if (roomNum === '') {
      alert(rInfo.roomName + ' is a invalid room. Please check your spelling.');
    }
  }
  else {

    switch (building[0].toUpperCase()) { // TODO
      case 'A':
          newBuilding = 'A';
          newFloor = undefined;
        break;
      case 'B':
        if (roomNum[0] === '3') {
          newBuilding = 'B';
          newFloor = '3';
        }
        else if (roomNum[0] === '2') {
          newBuilding = 'B';
          newFloor = '2';
        }
        else {
          newBuilding = 'B';
          newFloor = '1';
        }
        break;
      case 'C':
        if (roomNum[1] === '3') { // C3
          if (roomNum[0] === '2') {
            newBuilding = 'C3';
            newFloor = '2';
          }
          else if (roomNum[0] === '1') {
            newBuilding = 'C3';
            newFloor = '1';
          }
          else if (roomNum[0].toUpperCase() === 'G') {
            newBuilding = 'C3';
            newFloor = 'G';
          }
        }
        else { // C

          if (roomNum[0] === '2') {
            newBuilding = 'C';
            newFloor = '2';
          }
          else if (roomNum[0] == '1') {
            newBuilding = 'C';
            newFloor = '1';
          }
        }
        break;
      case 'D':
        if (roomNum[0] === '2') {
          newBuilding = 'D';
          newFloor = '2';
        }
        else if (roomNum[0] === '1') {
          newBuilding = 'D';
          newFloor = '1';
        }
        break;
      case 'E':
        if (roomNum[0] === '2') {
          newBuilding = 'E';
          newFloor = '2';
        }
        else if (roomNum[0] === '1') {
          newBuilding = 'E';
          newFloor = '1';
        }
        break;
      case 'F':
        if (roomNum[0] === '2') {
          newBuilding = 'F';
          newFloor = '2';
        }
        else if (roomNum[0] === '1') {
          newBuilding = 'F';
          newFloor = '1';
        }
        break;
      case 'H':
        if (roomNum[0] === '3') {
          newBuilding = 'H';
          newFloor = '3';
        }
        else if (roomNum[0] === '2') {
          newBuilding = 'H';
          newFloor = '2';
        }
        else if (roomNum[0] === '1') {
          newBuilding = 'H';
          newFloor = '1';
        }
        break;
      case 'I':
        if (roomNum[0] === '3') {
          newBuilding = 'I';
          newFloor = '3';
        }
        else if (roomNum[0] === '2') {
          newBuilding = 'I';
          newFloor = '2';
        }
        else if (roomNum[0] === '1') {
          newBuilding = 'I';
          newFloor = '1';
        }
        break;
      case 'L':
        if (roomNum[0] === '3') {
          newBuilding = 'L';
          newFloor = '3';
        }
        else if (roomNum[0] === '2') {
          newBuilding = 'L';
          newFloor = '2';
        }
        else if (roomNum[0] === '1') {
          newBuilding = 'L';
          newFloor = '1';
        }
        break;
      default:
        alert(roomNum + " is an invalid room number.");
    }
  }

  if (curBuild !== newBuilding || floor !== newFloor) {
    searchNewFloor(newBuilding, newFloor, roomNum);
  }
  else {
    activateRoom(roomNum, true);
  }
}

function getMap(building, floor) {

  var newMap = '';

  switch (building) { // TODO
    case 'Campus':
      newMap = campus;
      break;
    case 'A':
      newMap = buildingA[0];
      break;
    case 'B':
      if (floor === '3') {
        newMap = buildingB[2];
      }
      else if (floor === '2') {
        newMap = buildingB[1];
      }
      else {
        newMap = buildingB[0];
      }
      break;
    case 'C':
      if (floor === '1') {
        newMap = buildingC[0];
      }
      else {
        newMap = buildingC[1];
      }
      break;
    case 'C3':
      if (floor === '2') {
        newMap = buildingC3[2];
      }
      else if (floor === '1') {
        newMap = buildingC3[1];
      }
      else {
        newMap = buildingC3[0];
      }
      break;
    case 'D':
      if (floor === '2') {
        newMap = buildingD[1];
      }
      else {
        newMap = buildingD[0];
      }
      break;
    case 'E':
      if (floor === '3') {
        newMap = buildingE[2];
      }
      else if (floor === '2') {
        newMap = buildingE[1];
      }
      else {
        newMap = buildingE[0];
      }
      break;
    case 'F':
      if (floor === '2') {
        newMap = buildingF[1];
      }
      else {
        newMap = buildingF[0];
      }
      break;
    case 'H':
      if (floor === '3') {
        newMap = buildingH[2];
      }
      else if (floor === '2') {
        newMap = buildingH[1];
      }
      else {
        newMap = buildingH[0];
      }
      break;
    case 'I':
      if (floor === '3') {
        newMap = buildingI[2];
      }
      else if (floor === '2') {
        newMap = buildingI[1];
      }
      else {
        newMap = buildingI[0];
      }
      break;
    case 'L':
      if (floor === '3') {
        newMap = buildingL[2];
      }
      else if (floor === '2') {
        newMap = buildingL[1];
      }
      else {
        newMap = buildingL[0];
      }
      break;
  }

  return newMap;
}

function changeFloor(building, floor) {
  closeMenu();
  var newWindow = building.toUpperCase();
  var searchBar = document.getElementById('roomSearch');
  searchBar.value = '';

  newWindow = getMap(building, floor);

  if (newWindow !== '') {
    addMap(newWindow, building, floor).then(function(response) {
      // console.log('Success!');
    }, function(error) {
      console.error('Failed!', error);
    });
  }
}

function searchNewFloor(building, floor, roomNum) {
  var newWindow = building;
  var curBuild = document.getElementById('building');
  var curFloor = document.getElementById('floor');

  if (curBuild.innerHTML !== building || curFloor.innerHTML !== floor) {

    newWindow = getMap(building.toUpperCase(), floor);

    if (newWindow !== '') {
      addMap(newWindow, building, floor).then(function(response) {
        // console.log('Success!');
        activateRoom(roomNum, true);
      }, function(error) {
        console.error('Failed!', error);
      });
    }
  }
}
