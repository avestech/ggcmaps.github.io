function activateRoom(roomID) {
  var roomClass = 'room-group';
  var room = document.getElementById(roomID);
  var roomClassName = room.className.baseVal;
  // console.log(roomClassName);
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
    // console.log(document.getElementById(roomID).className);
    // alert('You have selected ' + roomID);
  }
}

function deactivateAllRooms() {
  var roomClass = 'room-group';
  var room = document.getElementsByClassName(roomClass);

  for (var i = 0; i < room.length; i++) {
    room[i].classList.remove('active-room');
  }
}

function searchForARoom(event) {
  if (event.which == 13 || event.keyCode == 13) {
    searchRooms();
  }
}

function searchRooms() {
  var sRoom = document.getElementById('roomSearch').value;

  if (sRoom.length === 4) {
    searchRoomNumber(sRoom);
  }
  else if (sRoom.length === 5) {
    var roomNum = sRoom.substring(1);
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
          alert('C3 Building not currently searchable');
        }
        else {
          searchRoomNumber(roomNum);
        }
        break;
      case 'C':
        if (roomNum[1] === '3') {
          alert('C3 Building not currently searchable');
        }
        else {
          searchRoomNumber(roomNum);
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
}

function searchRoomNumber(roomNum) {
  var room = document.getElementById(roomNum);

  if (room !== null) {
    deactivateAllRooms();
    room.classList.add('active-room');
    window.location.href='#' + roomNum;
  }
  else {
    alert('No room found for ' + roomNum);
  }
}
