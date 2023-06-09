//definition of the vertex

class Vertex {
    constructor(vertex, adjacentVertices, rooms, x, y) {
        this.vertex = vertex;
        //adjacent vertices is a list of objects with the vertex and the direction
        this.adjacentVertices = adjacentVertices;
        this.rooms = rooms;
        this.x = x;
        this.y = y;
    }


    //get the list of adjacent vertices with their direction
    getAdjacentVertices() {
        return this.adjacentVertices;
    }

    //get x
    getX() {
        return this.x;
    }

    //get y
    getY() {
        return this.y;
    }


}

//Definition of the room
class Room {
    constructor(name, x, y) {
        this.RoomNum = name;
        this.x = x;
        this.y = y;
    }
    //get the room number
    getRoomNum() {
        return this.RoomNum;
    }
    //get x
    getX() {
        return this.x;
    }
    //get y
    getY() {
        return this.y;
    }

}

//hallway class
class Hallway {
    constructor(startVertex, endVertex, roomsin, building, floor, svg) {
        this.startVertex = startVertex;
        this.endVertex = endVertex;
        this.roomsin = roomsin;
        this.building = building;
        this.floor = floor;
        this.svg = svg;
    }

    //get the start vertex
    getStartVertex() {
        return this.startVertex;
    }

    //get the end vertex
    getEndVertex() {
        return this.endVertex;
    }

    //get the rooms in the hallway
    getRoomsIn() {
        return this.roomsin;
    }

    //get the building
    getBuilding() {
        return this.building;
    }

    //get the floor
    getFloor() {
        return this.floor;
    }

    //get the svg
    getSVG() {
        return this.svg;
    }

    //Cuts the hallway at the specified room
    cutearly(room) {
        //find the x value of the svg at the room
        let x = room.getX();
        //find the y value of the svg at the room
        let y = room.getY();
        let svg = this.getSVG();
        svg.getTotalLength();
        let point = svg.getPointAtLength(x);
        //cut the svg at the point
        let newsvg = svg.slice(0, point);
        //set the new svg
        this.svg = newsvg;
    }


}

//will need to be defined in a json file
//initalize the data

let hallways = [];
let vertices = [];
let rooms = [];
let buildings = [];
let floors = [];

//initalize the data using the json files.
function initalizeData() {

}

//get the hallway with specified room inside of it start room and end room. 
function getStartHallway(InitialRoom) {
    for (let i = 0; i < hallways.length; i++) {
        let roomsin = hallways[i].getRoomsIn();
        for (let j = 0; j < roomsin.length; j++) {
            if (roomsin[j].getRoomNum() == InitialRoom) {
                return hallways[i];
            }
        }
    }
}


function getEndHallway(FinalRoom) {
    for (let i = 0; i < hallways.length; i++) {
        let roomsin = hallways[i].getRoomsIn();
        for (let j = 0; j < roomsin.length; j++) {
            if (roomsin[j].getRoomNum() == FinalRoom) {
                return hallways[i];
            }
        }
    }
}

//get Closest StairCase 
//will have to add staircase classes to the document
function getClosestStairCase(StartRoom) {
    let staircases = document.querySelectorAll('.staircase');
    let x = StartRoom.getX();
    let y = StartRoom.getY();
    for (let i = 0; i < staircases.length; i++) {
        let Sx = staircases[i].getX();
        let Sy = staircases[i].getY();
        let distance = Math.sqrt(Math.pow((x - Sx), 2) + Math.pow((y - Sy), 2));
        if (i == 0) {
            let closest = staircases[i];
            let closestDistance = distance;
        } else if (distance < closestDistance) {
            closest = staircases[i];
            closestDistance = distance;
        }
    }
    return closest;
}

//Traverse the Floors 
function goToFloor(StairCase, Floor) {
    //call the go to floor function using the staircase as a starting point for the new nav./
}


//get the vertex in the direction of the FinalRoom
function pickFirstVertex(StartRoom, FinalRoom) {
    let StartHallway = getStartHallway(StartRoom);
    let FinalHallway = getEndHallway(FinalRoom);
    let x = FinalRoom.getX();
    let y = FinalRoom.getY();
    if (StartHallway == FinalHallway) {
        return StartHallway.cutSvg(FinalRoom);
    }
}


