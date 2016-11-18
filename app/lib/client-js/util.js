function isLetter(c) {
  return c.toLowerCase() !== c.toUpperCase();
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function parseSearch(str) {
  var res = str.split(/[ -]+/);
  var building = '';
  var room = '';
  var roomName = '';

  for (var i = 0; i < res.length; i++) {

    if (res[i].length === 1 && isLetter(res[i])) {
      building = res[i];
    }
    else if (res[i].length === 4 && isNumeric(res[i])) {
      room = res[i];
    }
    else if (res[i].length === 5 && isNumeric(res[i].substring(0,4))) {
      room = res[i];
    }
    else {
      roomName += res[i] + ' ';
    }
  }
  if (building === '' && room === '' && roomName !== '') {
    if (isLetter(str[0]) && isNumeric(str[1])) {
      building = str[0];
      room = str.substring(1);
    }
  }

  var result = {
    building: building,
    room: room,
    roomName: roomName
  };

  return result;
}
