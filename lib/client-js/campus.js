// Buildings Floor Files
var campusMap = 'Building/(Campus)/campus.html';
var building2 = ['Building/2000/First-Floor.html'];
var building3 = ['Building/3000/First-Floor.html', 'Building/3000/Second-Floor.html', 'Building/3000/Third-Floor.html', 'Building/3000/Fourth-Floor.html'];
var buildingA = ['Building/A/First-Floor.html'];
var buildingB = ['Building/B/first-floor.html', 'Building/B/second-floor.html', 'Building/B/third-floor.html'];
var buildingC = ['Building/C/First-Floor.html', 'Building/C/Second-Floor.html'];
var buildingC3 = ['Building/C3/Ground-Floor.html', 'Building/C3/First-Floor.html', 'Building/C3/Second-Floor.html'];
var buildingD = ['Building/D/First-Floor.html', 'Building/D/Second-Floor.html'];
var buildingE = ['Building/E/First-Floor.html', 'Building/E/Second-Floor.html', 'Building/E/Third-Floor.html'];
var buildingF = ['Building/F/First-Floor.html', 'Building/F/Second-Floor.html'];
var buildingH = ['Building/H/First-Floor.html', 'Building/H/Second-Floor.html', 'Building/H/Third-Floor.html'];
var buildingI = ['Building/I/First-Floor.html', 'Building/I/Second-Floor.html', 'Building/I/Third-Floor.html'];
var buildingL = ['Building/L/First-Floor.html', 'Building/L/Second-Floor.html', 'Building/L/Third-Floor.html'];

// Floors Numbers
var floors2 = ['1'];
var floors3 = ['1', '2', '3', '4'];
var floorsA = ['1'];
var floorsB = ['1', '2', '3'];
var floorsC = ['1', '2'];
var floorsC3 = ['G', '1', '2'];
var floorsD = ['1', '2'];
var floorsE = ['1', '2', '3'];
var floorsF = ['1', '2'];
var floorsH = ['1', '2', '3'];
var floorsI = ['1', '2', '3'];
var floorsL = ['1', '2', '3'];

var campus = {
    map: 'Building/(Campus)/campus.html',
    buildings: [
        {
            id: '2',
            name: '2000',
            dir: 'Building/2000/',
            floorIndex: 0,
            floors: [
                {
                    id: '1',
                    map: 'First-Floor.html'
                }
            ]
        },
        {
            id: '3',
            name: '3000',
            dir: 'Building/3000/',
            floorIndex: 1,
            floors: [
                {
                    id: '1',
                    map: 'First-Floor.html'
                },
                {
                    id: '2',
                    map: 'Second-Floor.html'
                },
                {
                    id: '3',
                    map: 'Third-Floor.html'
                },
                {
                    id: '4',
                    map: 'Fourth-Floor.html'
                }
            ]
        },
        {
            id: 'A',
            name: 'Building A',
            dir: 'Building/A/',
            floorIndex: 0,
            floors: [
                {
                    id: '1',
                    map: 'First-Floor.html'
                }
            ]
        },
        {
            id: 'B',
            name: 'Building B',
            dir: 'Building/B/',
            floorIndex: 0,
            floors: [
                {
                    id: '1',
                    map: 'first-floor.html'
                },
                {
                    id: '2',
                    map: 'second-floor.html'
                },
                {
                    id: '3',
                    map: 'third-floor.html'
                }
            ]
        },
        {
            id: 'C',
            name: 'Building C',
            dir: 'Building/C/',
            floorIndex: 0,
            floors: [
                {
                    id: '1',
                    map: 'First-Floor.html'
                },
                {
                    id: '2',
                    map: 'Second-Floor.html'
                }
            ]
        },
        {
            id: 'C3',
            name: 'Building C3',
            dir: 'Building/C3/',
            floorIndex: 1,
            floors: [
                {
                    id: 'G',
                    map: 'Ground-Floor.html'
                },
                {
                    id: '1',
                    map: 'First-Floor.html'
                },
                {
                    id: '2',
                    map: 'Second-Floor.html'
                }
            ]
        },
        {
            id: 'D',
            name: 'Building D',
            dir: 'Building/D/',
            floorIndex: 0,
            floors: [
                {
                    id: '1',
                    map: 'First-Floor.html'
                },
                {
                    id: '2',
                    map: 'Second-Floor.html'
                }
            ]
        },
        {
            id: 'E',
            name: 'Building E',
            dir: 'Building/E/',
            floorIndex: 0,
            floors: [
                {
                    id: '1',
                    map: 'First-Floor.html'
                },
                {
                    id: '2',
                    map: 'Second-Floor.html'
                },
                {
                    id: '3',
                    map: 'Third-Floor.html'
                }
            ]
        },
        {
            id: 'F',
            name: 'Building F',
            dir: 'Building/F/',
            floorIndex: 0,
            floors: [
                {
                    id: '1',
                    map: 'First-Floor.html'
                },
                {
                    id: '2',
                    map: 'Second-Floor.html'
                }
            ]
        },
        {
            id: 'H',
            name: 'Building H',
            dir: 'Building/H/',
            floorIndex: 0,
            floors: [
                {
                    id: '1',
                    map: 'First-Floor.html'
                },
                {
                    id: '2',
                    map: 'Second-Floor.html'
                },
                {
                    id: '3',
                    map: 'Third-Floor.html'
                }
            ]
        },
        {
            id: 'I',
            name: 'Building I',
            dir: 'Building/I/',
            floorIndex: 0,
            floors: [
                {
                    id: '1',
                    map: 'First-Floor.html'
                },
                {
                    id: '2',
                    map: 'Second-Floor.html'
                },
                {
                    id: '3',
                    map: 'Third-Floor.html'
                }
            ]
        },
        {
            id: 'L',
            name: 'Building L',
            dir: 'Building/L/',
            floorIndex: 0,
            floors: [
                {
                    id: '1',
                    map: 'First-Floor.html'
                },
                {
                    id: '2',
                    map: 'Second-Floor.html'
                },
                {
                    id: '3',
                    map: 'Third-Floor.html'
                }
            ]
        },
    ]
};
