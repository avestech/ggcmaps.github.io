function activateRoom(roomID) {
  var roomClass = 'room-group';
  var room = document.getElementById(roomID);
  var roomClassName = room.className.baseVal;
  // console.log(roomClassName);
  if (roomClassName !== roomClass) {
    // console.log('not active');
    if (roomClassName === roomClass + ' active-room') {
      // TODO deactivateAllRooms();
      return;
    }
    return;
  }
  else if (roomClassName === roomClass) {

    // TODO deactivateAllRooms();

    room.classList.add('active-room');
    // console.log(document.getElementById(roomID).className);
    alert('You have selected ' + roomID);
  }
}
