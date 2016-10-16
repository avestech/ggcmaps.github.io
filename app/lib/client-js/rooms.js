document.addEventListener('DOMContentLoaded', function() {
  var ref = window.location.href;
  var roomNum = ref.substring(ref.lastIndexOf('#') + 1);

  if (roomNum.length > 0 && roomNum.length < 5) {
    document.getElementById('roomSearch').value = roomNum;
    searchRoomNumber(roomNum);
  }
});

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
  var roomNum = sRoom;

  var ref = window.location.href;
  var refWindow = ref.substring(ref.lastIndexOf('/') + 1, ref.lastIndexOf('#'));
  var newWindow = refWindow;

  if (sRoom.length === 4) {
    var file = refWindow.substring(refWindow.indexOf('-') + 1);
    var building = file.substring(0, file.indexOf('-'));

    switch (building) {
      case 'A':
        alert('A Building not currently searchable');
        break;
      case 'B':
        alert('B Building not currently searchable');
        break;
      case 'C':
        if (roomNum[1] === '3') {
          // newWindow = 'Building-C3-Ground-Floor.html';
          alert('C3 Building not currently searchable');
        }
        else if (roomNum[0] === '2') {
          newWindow = "Building-C-Second-Floor.html";
          // searchRoomNumber(roomNum);
        }
        else if (roomNum[0] == '1') {
          newWindow = "Building-C-First-Floor.html";
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
          newWindow = "Building-C-Second-Floor.html";
          // searchRoomNumber(roomNum);
        }
        else if (roomNum[0] == '1') {
          newWindow = "Building-C-First-Floor.html";
        }
        break;
      case 'C':
        if (roomNum[1] === '3') {
          // newWindow = 'Building-C3-Ground-Floor.html';
          alert('C3 Building not currently searchable');
        }
        else if (roomNum[0] === '2') {
          newWindow = "Building-C-Second-Floor.html";
          // searchRoomNumber(roomNum);
        }
        else if (roomNum[0] == '1') {
          newWindow = "Building-C-First-Floor.html";
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

  if (refWindow !== newWindow) {
    window.location.href = newWindow + '#' + roomNum;
  }
  else {
    searchRoomNumber(roomNum);
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
