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
