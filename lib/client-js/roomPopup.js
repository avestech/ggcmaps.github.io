/* jshint sub:true */

// Hiding the element or not
var HIDE = true;
var SHOW = false;

// Timeout variable for urlRoom()
var urlTimer;

function roomPopup() {
  debug.group("Activate Room");
  debug.msg('Attempt to activate: ' + roomID);
  //room 4983 does not exist. no room to activate so return
  if (roomID === "4983") {
      return;
}
var roomClass = 'room-popup';
var room = document.getElementid(roomID.toLowerCase());

if(room == null) {
  alert("Sorry, room number" + roomID + "couldn't be found in this building.");
}else{
  var roomClassName = room.className.baseVal;
}
}
