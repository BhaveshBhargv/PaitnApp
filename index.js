var canvas = document.getElementById("canvas"),
    ctx,
    dragging = false,
    move,
    X,Y,
    trianglesCount = 0,
    triangles = [];

if (canvas.getContext) {   
    ctx = canvas.getContext('2d');   
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', stop);
    document.getElementById('clear').addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        triangles = [];
        trianglesCount = 0;
    }); 
    canvas.addEventListener('dblclick', toDelete);
} 

function coordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function start(e) {
    dragging = true;
    dragStartPoint = coordinates(e);
    move = checkForTriangle(dragStartPoint);
    color = randomColor();
    getImage();
}

function drag(e) {
    var position;
    if (dragging && !move) {
        putImage();
        position = coordinates(e);
        draw(position);
        ctx.fillStyle = color;
        ctx.fill();
    }
    else if (move) {
        position = coordinates(e);
        shiftTo(position)
        triangles[moved].triangleXCoordinates = triangleXCoordinates;
        triangles[moved].triangleYCoordinates = triangleYCoordinates;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        reDraw(triangles);
    }
}
 
function stop(e) {
    if (move) {
        move = false;
        dragging = false;        
        position = coordinates(e);
        shiftTo(position);
        temp = {triangleXCoordinates, triangleYCoordinates, color: triangles[moved].color, radius: radius};
        triangles.push(temp);
        triangles.splice(moved,1);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        reDraw(triangles);
    }
    else {
        dragging = false;
        move = false;
        putImage();
        position = coordinates(e);
        draw(position);
        ctx.fillStyle = color;
        ctx.fill();
        trianglesCount++;
        temp = {triangleXCoordinates, triangleYCoordinates, color: color, radius: radius};
        triangles.push(temp);
    }
} 

function draw(position) {
    triangleXCoordinates = [];
    triangleYCoordinates = [];
    radius = Math.sqrt(Math.pow((dragStartPoint.x - position.x), 2) + Math.pow((dragStartPoint.x - position.x), 2));
    var angle = 100,
    index = 0;

    for (index = 0; index < 3; index++) {
        triangleXCoordinates.push({x: dragStartPoint.x + radius * Math.cos(angle)});
        triangleYCoordinates.push({y: dragStartPoint.y - radius * Math.sin(angle)});
        angle += (2 * Math.PI) / 3;
    } 

    ctx.beginPath();
    ctx.moveTo(triangleXCoordinates[0].x, triangleYCoordinates[0].y);
    for (index = 1; index < 3; index++) {
        ctx.lineTo(triangleXCoordinates[index].x, triangleYCoordinates[index].y);
    }
    ctx.closePath();
    ctx.fill();
} 

function randomColor() {  
    return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

function toDelete(e) {
    var selected = canvas.getBoundingClientRect(),
    deleted = -1;
    mouseX = (event.clientX - selected.left)*(canvas.width/selected.width);
    mouseY = (event.clientY - selected.top)*(canvas.height/selected.height);
    for (i=0; i < trianglesCount; i++) {
        if  (isclicked(triangles[i].triangleXCoordinates,triangles[i].triangleYCoordinates, mouseX, mouseY)) {
            deleted = i;        
        }
    } 
    if (deleted > -1) {
        triangles.splice(deleted, 1)[0];
        trianglesCount--;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    reDraw(triangles);
}

function isclicked(vertx, verty, testx, testy ) {
    ctx.beginPath();
    for (var i = 0; i < 3; i++) {
        ctx.lineTo(vertx[i].x, verty[i].y);
    }
    return ctx.isPointInPath(testx,testy);        
}

function reDraw(triangles) {
    for (var i = 0; i < triangles.length; i++) {
        ctx.beginPath();
        ctx.moveTo(triangles[i].triangleXCoordinates[0].x, triangles[i].triangleYCoordinates[0].y);
        for (var index = 1; index < 3; index++) {
            ctx.lineTo(triangles[i].triangleXCoordinates[index].x, triangles[i].triangleYCoordinates[index].y);
        }
        ctx.closePath();
        ctx.fillStyle = triangles[i].color;
        ctx.fill();
    }
}

function getImage() {
    img = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function putImage() {
    ctx.putImageData(img, 0, 0);
}

function checkForTriangle(position) {
    var mouseX = position.x;
    var mouseY = position.y;
    moved = -1;
    for (i = 0; i < trianglesCount; i++) {
        if  (isclicked(triangles[i].triangleXCoordinates,triangles[i].triangleYCoordinates, mouseX, mouseY)) {
            moved = i;
            return true;        
        }
    }
}

function shiftTo(position) {
    triangleXCoordinates = [];
    triangleYCoordinates = [];
    radius = triangles[moved].radius;
    angle = 100;
    for (index = 0; index < 3; index++) {
        triangleXCoordinates.push({x: position.x + radius * Math.cos(angle)});
        triangleYCoordinates.push({y: position.y - radius * Math.sin(angle)});
        angle += (2 * Math.PI) / 3;
    }
}
