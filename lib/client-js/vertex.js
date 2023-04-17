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

//Main Function 



// Define a function to navigate from one room to the other
function navigate(startRoom, endRoom) {
    let currentRoom = startRoom;
    
    // Find the path from the current vertex to the next vertex
    while (!currentVertex.rooms.includes(endRoom)) {
        let endDirection = getEndDirection(currentVertex, endRoom);
        const nextVertex = currentVertex.adjacentVertices.find(vertex => {
            return vertex.direction === endDirection;
        });
        currentVertex = graph[nextVertex.vertex];
    }

    
    const hallwaySection = currentVertex.rooms.indexOf(endRoom);
    


  
}

// Define a function to find the closest vertex to the given x and y coordinates
function getClosestVertex(x,y){

}