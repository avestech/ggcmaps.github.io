function switchMap(search) {
    debug.group('Switch Map');
    var data = {
        map: '',
        building: '',
        floor: '',
        room: ''
    };

    var pData = parseSearch(search);
    data.room = pData.room;

    if (pData.building.toLowerCase() === 'campus') {
        data.map = campus.map;
        data.building = 'Campus';
    }

    for (var i = 0; i < campus.buildings.length; i++) {

        if (pData.building.toUpperCase() === campus.buildings[i].id.toUpperCase()) {
            data.building = campus.buildings[i].id;
            debug.msg('Building= ' + data.building);

            if (pData.room !== null || pData.room !== undefined) {

                for (var j = 0; j < campus.buildings[i].floors.length; j++) {
                    if (pData.room[campus.buildings[i].floorIndex].toUpperCase() === campus.buildings[i].floors[j].id.toUpperCase()) {
                        data.floor = campus.buildings[i].floors[j].id;
                        data.map = campus.buildings[i].dir + campus.buildings[i].floors[j].map;

                        debug.msg('Floor= ' + data.floor);
                        debug.msg('Map= ' + data.map);
                        break;
                    }
                }
            }
            else {
                data.floor = campus.buildings[i].floors[0].id;
                data.map = campus.buildings[i].dir + campus.buildings[i].floors[0].map;

                debug.msg('Floor= ' + data.floor);
                debug.msg('Map= ' + data.map);
                break;
            }
        }
    }

    if (data.map === '') {
        debug.error('Map not set');
    }
    debug.end();
    return data;
}

function addMap(mapLocation, building, floor) {
    debug.group("Add Map");
    var curBuild = document.getElementById('building'); // Current Building
    var curFloor = document.getElementById('floor'); // Current Floor
    var mapHolder = document.getElementById('svg-holder'); // Div that contains the map

    // Ensure that the file has loaded before certain functions are called
    return new Promise(function(resolve, reject) {

        var req = new XMLHttpRequest();
        req.open('GET', mapLocation, true);
        req.onload = function() {
            // if (req.readyState!==4) reject(Error(req.statusText));
            if (req.status !== 200) reject(Error(req.statusText));

            if (building !== curBuild) { // If building is being changed
                var buildingPop = document.getElementById("building-popup"); // Building Popup
                var dropdown = document.getElementsByClassName('dropdown')[0]; // Floor Dropdown
                var legend = document.getElementsByClassName('campus-info')[0]; // Parking Legend

                if (building === 'Campus') { // If changing to campus
                    // Hide the building popup
                    hideElement(buildingPop, HIDE);
                    // Show the parking legend
                    if (eatCookie('legend') === 'show') {
                        hideElement(legend, SHOW);
                        document.getElementById('pLegend').style.display = "inherit";
                        // debug.msg("SHOWN");
                    } else {
                        hideElement(legend, HIDE);
                        document.getElementById('pLegend').style.display = "none";
                        // debug.msg("HIDDENLEGEND");
                    }
                } else { // Otherwise
                    // Show the building popup
                    hideElement(buildingPop, SHOW);
                    // Hide the parking legend
                    hideElement(legend, HIDE);
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
                    this.hammer.get('pinch').set({
                        enable: true
                    });

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
                        instance.panBy({
                            x: ev.deltaX - pannedX,
                            y: ev.deltaY - pannedY
                        });
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
                        toggleTab(ev, 'helpbox');
                        toggleTab(ev, 'campusEvents');
                        if (building === 'Campus') {
                            var target = ev.target.parentNode.id.toUpperCase();
                            if (target === 'A') {
                                changeFloor(target);
                            } else if (target === 'C3') {
                                changeFloor(target, 'G');
                            } else {
                                for (var rbuilding in roomNames) {
                                    if (target === rbuilding) {
                                        changeFloor(rbuilding, '1');
                                    }
                                }
                            }
                        } else {
                            var room = ev.target.parentNode.id;
                            if (room.length === 4 || room.length === 5) {
                                debug_msg("addMap calls activateRoom");
                                activateRoom(ev.target.parentNode.id);
                            }
                        }
                    });

                    // Prevent moving the page on some devices when panning over SVG
                    options.svgElement.addEventListener('touchmove', function(e) {
                        e.preventDefault();
                    });
                },
                destroy: function() {
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
