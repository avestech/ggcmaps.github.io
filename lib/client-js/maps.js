function switchMap(search) {
    debug.group('Switch Map');
    const data = {
      map: '',
      building: '',
      floor: '',
      room: '',
      roomName: ''
    };

    const { building, room, roomName } = parseSearch(search);
    data.roomName = roomName;
    debug.msg(`RoomName "${data.roomName}"`);

    const matchingBuilding = campus.buildings.find(b => b.id.toUpperCase() === building.toUpperCase());

    if (building.toLowerCase() === 'campus') {
      data.map = campus.map;
      data.building = 'Campus';
    } else if (!building && !data.roomName) {
      data.building = document.getElementById('building').innerHTML;
    } else if (matchingBuilding) {
      data.building = matchingBuilding.id;

      if (room) {
        const matchingFloor = matchingBuilding.floors.find(f => f.id.toUpperCase() === room[matchingBuilding.floorIndex].toUpperCase() || f.id.toUpperCase() === data.floor.toUpperCase());

        if (matchingFloor) {
          data.floor = matchingFloor.id;
          data.map = matchingBuilding.dir + matchingFloor.map;
          data.room = room;
        }
      } else {
        data.floor = matchingBuilding.floors[0].id;
        data.map = matchingBuilding.dir + matchingBuilding.floors[0].map;
      }
    }

    if (!data.map && data.roomName) {
      alert(`Were you trying to search by nickname? Unfortunately, "${name}" is not recognized.\nPlease check your spelling, or try a more common name.\n\nExample: Search for "Moes" not "Mo"`);
      data.building = 'Campus';
      data.map = campus.map;
    } else if (!data.map) {
      debug.error(`Did you mean to search for "${building} ${room}"?\nThat building doesn't exist.`);
      alert(`Did you mean to search for building ${building}?\nThat building doesn't exist.`);
      data.building = 'Campus';
      data.map = campus.map;
    }

    debug.msg(`Building= ${data.building}`);
    debug.msg(`Floor= ${data.floor}`);
    debug.msg(`Map= ${data.map}`);
    debug.msg(`Room= ${data.room}`);
    debug.end();

    return data;
  }

function getFloorMap(building, floor) {
    debug.group('Get Floor Map');
    floor = floor || '1';
    var map = '';

    var buildingData = campus.buildings.find((b) => {
      return b.id.toUpperCase() === building.toUpperCase();
    });

    if (buildingData) {
      var floorData = buildingData.floors.find(function(f) {
        return f.id.toUpperCase() === floor.toUpperCase();
      });
      if (floorData) {
        map = buildingData.dir + floorData.map;
      }
    } else if (building.toLowerCase() === 'campus') {
      map = campus.map;
    }

    if (map === '') {
      debug.error('Map not found Building: ' + building + ' Floor: ' + floor);
    }

    debug.end();
    return map;
  }

function addMap(mapLocation, building, floor) {
    debug.group("Add Map");
    var curBuild = document.getElementById('building'); // Current Building
    var curFloor = document.getElementById('floor'); // Current Floor
    var mapHolder = document.getElementById('svg-holder'); // Div that contains the map

    // Ensure that the file has loaded before certain functions are called
    return new Promise(function (resolve, reject) {

        var req = new XMLHttpRequest();
        req.open('GET', mapLocation, true);
        req.onload = function () {
            // if (req.readyState!==4) reject(Error(req.statusText));
            if (req.status !== 200) reject(Error(req.statusText));

            if (building !== curBuild) { // If building is being changed
                var buildingPop = document.getElementById("building-popup"); // Building Popup
                var dropdown = document.getElementsByClassName('dropdown')[0]; // Floor Dropdown
                var safetyLegend = document.getElementById('sLegend');
                var parkingLegend = document.getElementById('pLegend');

                if (building === 'Campus') { // If changing to campus

                    // Hide the building popup
                    hideElement(buildingPop, HIDE);
                    // Safety legend only needs to be visible when viewing inside of a building
                    hideElement(safetyLegend, HIDE);

                    cookieMold('mode', 'hide', 9999); // change cookies to hide
                    document.getElementById("safetySwitch").disabled = true; // disable when in campus
                    document.getElementById("fireSwitch").disabled = true;// disable when in campus


                    // Show the parking legend
                    if (eatCookie('legend') === 'show') {
                        hideElement(parkingLegend, SHOW);
                        parkingLegend.style.display = "inherit";
                    } else {
                        hideElement(parkingLegend, HIDE);
                        parkingLegend.style.display = "none";
                    }
                } else { // Otherwise
                    // Show the building popup
                     document.getElementById("legendSwitch").checked = false;
                    cookieMold('legend', 'hide', 9999); // change the cookies to hide
                    parkingLegend.style.display="none";//turn off display legend
                    document.getElementById("safetySwitch").disabled = false; // enable when in campus
                    document.getElementById("fireSwitch").disabled = false;// enable when in campus

                    hideElement(buildingPop, SHOW);
                }

                if (floor !== undefined) { // If a floor is passed in
                    // Show the current floor and floor dropdown
                    hideElement(curFloor, SHOW);
                    hideElement(dropdown, SHOW);
                    floorDropDown(building);
                    // Change the current floor
                    curFloor.innerHTML = 'FL' + floor;
                } else { // Otherwise
                    // Hide the current floor and floor dropdown
                    hideElement(curFloor, HIDE);
                    hideElement(dropdown, HIDE);
                }
            }

            // Remove all maps
            removeMap();
            // Add new map
            mapHolder.appendChild(convertToElement(req.response));
            // Set the map height to the browser's height and enable panZoomTiger
            var map = mapHolder.childNodes[0];
            map.style.height = getClientHeight();
            // Set current building to building
            curBuild.innerHTML = building;

            // Setup touch events
            var eventsHandler;
            eventsHandler = {
                haltEventListeners: ['touchStart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
                init: function (options) {
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
                    this.hammer.get('pinch').set({
                        enable: true
                    });

                    // Handle double tap
                    this.hammer.on('doubletap', function (ev) {
                        instance.zoomIn();
                    });

                    // Handle pan
                    this.hammer.on('panstart panmove', function (ev) {
                        // On pan start reset panned variables
                        if (ev.type === 'panstart') {
                            pannedX = 0;
                            pannedY = 0;
                        }

                        // Pan only the difference
                        instance.panBy({
                            x: ev.deltaX - pannedX,
                            y: ev.deltaY - pannedY
                        });
                        pannedX = ev.deltaX;
                        pannedY = ev.deltaY;
                    });

                    // Handle pinch
                    this.hammer.on('pinchstart pinchmove', function (ev) {
                        // On pinch start remember initial zoom
                        if (ev.type === 'pinchstart') {
                            initialScale = instance.getZoom();
                            instance.zoom(initialScale * ev.scale);
                        }

                        instance.zoom(initialScale * ev.scale);
                    });

                    this.hammer.on('tap', function (ev) {
                        toggleTab(ev, 'helpbox');
                        toggleTab(ev, 'campusEvents');
                        if (building === 'Campus') {
                            var target = ev.target.parentNode.id;
                            if (target !== undefined && target !== null) {
                                for (var campusB in campus.buildings) {
                                    if (target.toUpperCase() === campus.buildings[campusB].id.toUpperCase()) {
                                        changeFloor(campus.buildings[campusB].id, campus.buildings[campusB].floors[0].id);
                                        break;
                                    }
                                }
                            }
                        } else {
                            var room = ev.target.parentNode.id;
                            if (room.length === 4 || room.length === 5) {
                                debug.msg("addMap calls activateRoom");
                                activateRoom(ev.target.parentNode.id);
                            }
                        }
                    });

                    // Prevent moving the page on some devices when panning over SVG
                    options.svgElement.addEventListener('touchmove', function (e) {
                        e.preventDefault();
                    });
                },
                destroy: function () {
                    this.hammer.destroy();
                }
            };

            // Add the eventsHandler for touch to the svgPanZoom
            var panZoomTiger = svgPanZoom(map, {
                controlIconsEnabled: true,
                fit: 1,
                center: 1,
                customEventsHandler: eventsHandler
            });

            // Resize the panZoomTiger when the window resizes
            window.addEventListener('resize', function () {
                // Resize the map height to adjust the panZoomTiger height
                map.style.height = getClientHeight();

                panZoomTiger.resize();
                panZoomTiger.fit();
                panZoomTiger.center();
            });

            resolve(req.response);
        };

        req.onerror = function () {
            reject(Error('Network Error'));
        };

        req.send();
        debug.end();
    });
}

// Remove all maps from the svg-holder
function removeMap() {
    debug.group("Remove Map");
    var mapHolder = document.getElementById('svg-holder');
    // Just in case multiple elements get added to svg-holder
    while (mapHolder.hasChildNodes()) {
        mapHolder.removeChild(mapHolder.lastChild);
    }
    debug.end();
}
