//definition of the vertex
//will need to be defined in a json file
class Vertex {
    constructor(vertex, adjacentVertices, rooms, x, y) {
        this.vertex = vertex;
        //adjacent vertices is a list of objects with the vertex and the direction
        this.adjacentVertices = adjacentVertices;
        this.rooms = rooms;
        this.x = x;
        this.y = y;
    }
    
    //get the list of rooms in the vertex
    getRooms() {
        return this.rooms;
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
//will need to be defined in a json file
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
    cutearly(room){
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

//Main Function 

//load from the json file
const vertexs = [];
const rooms = [];
const graph = [];
const currentVertex = null;
const currentRoom = null;

//loads the json into the vertexs and rooms
function loadInfo(){
    
}

// Define a function to navigate from one room to the other
function navigate(startRoom, endRoom) {
    let currentRoom = startRoom;
    
    // Find the path from the current vertex to the next vertex
    while (!currentVertex.rooms.includes(endRoom)) {
        let endDirection = vertex.
        const nextVertex = currentVertex.adjacentVertices.find(vertex => {
            return vertex.direction === endDirection;
        });
        currentVertex = graph[nextVertex.vertex];
    }

    
    const hallwaySection = currentVertex.rooms.indexOf(endRoom);
    


  
}

// Define a function to find the closest vertex to the given x and y coordinates


//function to calculate where the room is in the current hallway
function goIntoRoom(currentVertex, endRoom) {
   if(currentVertex.rooms.includes(endRoom)) {
       x = endRoom.x;
   }
   let endsvg = currentVertex.svg.slice(x);
   return endsvg;
}