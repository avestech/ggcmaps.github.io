function isLetter(c) {
  return c.toLowerCase() !== c.toUpperCase();
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function parseSearch(str) {
  var res = str.split(/[ -\s<>'"();/\\]+/);
  var building = '';
  var room = '';
  var roomName = '';

  for (var i = 0; i < res.length; i++) {

    if (res[i].length === 1 && isLetter(res[i])) {
      building = res[i];
    }
    else if (res[i].length === 4 && (isNumeric(res[i]) || (res[i].charAt(0) === 'G' && isNumeric(res[i].substring(1))))) {
      room = res[i];
    }
    else if (res[i].length === 5 && isNumeric(res[i].substring(0,4))) {
      room = res[i];
    }
    else {
      if (roomName !== '') {
        roomName += '-';
      }
      roomName += res[i];
    }
  }
  if (building === '' && room === '' && roomName !== '') {
    if (isLetter(str[0]) && isNumeric(str[2])) {
      building = str[0];
      room = str.substring(1);
      roomName = '';
    }
  }
  var result = {
    building: building,
    room: room,
    roomName: roomName.toLowerCase()
  };

  return result;
}

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

function dropdown(drop, className) {
  var dd = document.getElementsByClassName(drop)[0];
  dd.classList.toggle(className);
}

function resetWidth(panZoomTiger) {
  console.log('resize');
  // var panZoomTiger = svgPanZoom(map, {controlIconsEnabled:true, fit:1, center:1});
  panZoomTiger.resize();
  panZoomTiger.fit();
  panZoomTiger.center();
}

function hideElement(element, hide) {
  if (hide) {
    if (!element.classList.contains('hide')) {
      element.classList.toggle('hide');
    }
  }
  else {
    if (element.classList.contains('hide')) {
      element.classList.toggle('hide');
    }
  }
}

function loadFile(element, file) {
  return new Promise(function(resolve, reject) {

    var req = new XMLHttpRequest();
    req.open('GET', file, true);
    req.onload = function() {
      // if (req.readyState!==4) reject(Error(req.statusText));
      if (req.status!==200) reject(Error(req.statusText));

      var htmlElement = document.getElementById(element);
      htmlElement.appendChild(convertToElement(req.response));

      resolve(req.response);
    };

    req.onerror = function() {
      reject(Error('Network Error'));
    };

    req.send();
  });
}

function toggleEvent(ev, element, className) {
  var target = document.getElementById(element);
  if (ev.target.parentNode !== target && target.classList.contains(className)) {
    target.classList.toggle(className);
  }
}
