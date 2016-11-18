// Buildings
var buildingA; // TODO
var buildingB; // TODO
var buildingC = ['Building/C/First-Floor.html', 'Building/C/Second-Floor.html'];
var buildingC3 = ['Building/C3/Ground-Floor.html', 'Building/C3/First-Floor.html', 'Building/C3/Second-Floor.html'];
var buildingD; // TODO
var buildingE; // TODO
var buildingF; // TODO
var buildingH = ['Building/H/First-Floor.html', 'Building/H/Second-Floor.html', 'Building/H/Third-Floor.html'];
var buildingI; // TODO
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
var floorsI = ['1', '2'];
var floorsL = ['1', '2', '3'];

document.addEventListener('DOMContentLoaded', function() {

  addMap(buildingC[0], 'C', '1').then(function(response) {
    // console.log('Success!');
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

function activatePopup(popup, id) {
  popup.onmouseover = function() {
    document.getElementById(id).classList.toggle('popup-active');
  };
  popup.onmouseout = function() {
    document.getElementById(id).classList.toggle('popup-active');
  };
}

function convertToElement(html) {
  var temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.childNodes[0];
}

function getClientHeight() {
  return (window.innerHeight || document.body.clientHeight) + 'px';
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
      map.style.height = getClientHeight();
      curBuild.innerHTML = building;
      curFloor.innerHTML = floor;

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
            var room = ev.target.parentNode.id;
            if (room.length === 4) {
              activateRoom(ev.target.parentNode.id);
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

function dropdown(drop, className) {
  var dd = document.getElementsByClassName(drop)[0];
  dd.classList.toggle(className);
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
    var option = '<h2 onclick="changeFloor(\'' + building + '\', \'' + floors[i] + '\')">' + floors[i] + ' Floor</h2>';
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
  var curBuild = building;
  var floor = document.getElementById('floor').innerHTML;

  var newWindow = '';
  var newBuilding = '';
  var newFloor = '';

  if (sRoom.length === 5) {
    building = sRoom[0];
    console.log(building);
    roomNum = sRoom.substring(1);
  }

  switch (building[0].toUpperCase()) { // TODO
    case 'A':
      alert('A Building not currently searchable');
      break;
    case 'B':
      alert('B Building not currently searchable');
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
      alert('D Building not currently searchable');
      break;
    case 'E':
      alert('E Building not currently searchable');
      break;
    case 'F':
      alert('F Building not currently searchable');
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
      alert('I Building not currently searchable');
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
      alert(roomNum + " is an invalid room number. Please don't use any spaces");
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
    case 'A':

      break;
    case 'B':

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

      break;
    case 'E':

      break;
    case 'F':

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
