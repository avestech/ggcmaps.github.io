document.addEventListener('DOMContentLoaded', function() {

  // var rooms = document.getElementsByClassName('room-group');
  //
  // for (int i = 0; i < rooms.length; i++) {
  //   rooms[i].addEventListener('click', function(event) {
  //     event.target.className = 'room-group active-room';
  //     console.log('click');
  //     alert('You have selected ' + event.target.id);
  //   });
  // }

  // var rooms = document.getElementsByClassName('room-group');
  //
  // for (var i = 0; i < rooms.length; i++) {
  //   document.getElementById(rooms[i].id).addEventListener('click', activateRoom(event));
  // }

  // document.getElementById('le-rooms').addEventListener('click', function(event)  {
  //   var room = event.target;
  //   console.log(room);
  //   if (room.className !== roomClass) {
  //     console.log('not active');
  //     if (room.className === roomClass + ' active-room') {
  //       // TODO deactivateAllRooms();
  //       return;
  //     }
  //     return;
  //   }
  //   else if (room.className === headerClass) {
  //
  //     var roomID = room.id;
  //
  //     // TODO deactivateAllRooms();
  //
  //     room.className = roomClass + ' active-room';
  //     console.log('active');
  //   }
  // });
});

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
