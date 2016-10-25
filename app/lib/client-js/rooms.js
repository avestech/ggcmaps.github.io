document.addEventListener('DOMContentLoaded', function() {

  var nav = document.getElementsByClassName('nav')[0];
  var mapHolder = document.getElementById('svg-holder');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'Building/C/First-Floor.html', true);
  xhr.onreadystatechange = function() {
    if (this.readyState!==4) return;
    if (this.status!==200) return;
    mapHolder.innerHTML = this.responseText;

    var map = mapHolder.childNodes[0];
    map.style.height = nav.clientHeight;
    var panZoomTiger = svgPanZoom(map, {controlIconsEnabled:true});
  };
  xhr.send();

});

function activateRoom(roomID) {
  var roomClass = 'room-group';
  var room = document.getElementById(roomID);

  if (room === null) {
    alert('No room found for ' + roomID);
  } else {
    var roomClassName = room.className.baseVal;

    if (roomClassName !== roomClass) {
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
  var sRoom = document.getElementById('roomSearch').value;
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
          alert('C3 Building not currently searchable');
        }
        else if (roomNum[0] === '2') {
          newBuilding = 'C';
          newFlooar = '2';
        }
        else if (roomNum[0] == '1') {
          newBuilding = 'C';
          newFloor = '1';
        }
        break;
      case 'C3':
        alert('C3 Building not currently searchable');
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
          // newWindow = 'Building-C3-Ground-Floor.html';
          alert('C3 Building not currently searchable');
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
          // newWindow = 'Building-C3-Ground-Floor.html';
          alert('C3 Building not currently searchable');
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
    alert('Invalid room number');
  }

  if (building !== newBuilding || floor !== newFloor) {
    searchNewFloor(newBuilding, newFloor, roomNum);
  }
  else {
    activateRoom(roomNum);
  }
}

function changeFloor(building, floor) {
  closeMenu();
  var newWindow = building;
  var searchBar = document.getElementById('roomSearch');
  var curBuild = document.getElementById('building');
  var curFloor = document.getElementById('floor');
  searchBar.value = '';
  curBuild.innerHTML = building;
  curFloor.value = floor;

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

  var nav = document.getElementsByClassName('nav')[0];
  var mapHolder = document.getElementById('svg-holder');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', newWindow, true);
  xhr.onreadystatechange = function() {
    if (this.readyState!==4) return;
    if (this.status!==200) return;
    mapHolder.innerHTML = this.responseText;

    var map = mapHolder.childNodes[0];
    map.style.height = nav.clientHeight;
    var panZoomTiger = svgPanZoom(map, {controlIconsEnabled:true});
  };
  xhr.send();
}

function searchNewFloor(building, floor, roomNum) {
  var newWindow = building;
  var curBuild = document.getElementById('building');
  var curFloor = document.getElementById('floor');

  if (curBuild.innerHTML !== building || curFloor.value !== floor) {
    curBuild.innerHTML = building;
    switch (building) {
      case 'A':

        break;
      case 'B':

        break;
      case 'C':
        if (floor === '1') {
          newWindow = 'Building/C/First-Floor.html';
          curFloor.value = '1';
        }
        else {
          newWindow = 'Building/C/Second-Floor.html';
          curFloor.value = '2';
        }
        break;
      case 'C3':

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

    var nav = document.getElementsByClassName('nav')[0];
    var mapHolder = document.getElementById('svg-holder');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', newWindow, true);
    xhr.onreadystatechange = function() {
      if (this.readyState!==4) return;
      if (this.status!==200) return;
      mapHolder.innerHTML = this.responseText;

      var map = mapHolder.childNodes[0];
      map.style.height = nav.clientHeight;
      var panZoomTiger = svgPanZoom(map, {controlIconsEnabled:true});
      activateRoom(roomNum);
    };
    xhr.send();
  }
}
