//websocket connection
const socket = new WebSocket('ws://localhost:9000');

//connection opened
socket.addEventListener('open', function (event) {
    console.log('Connected to WS Server')
})

socket.addEventListener('message', function (event) {
    
    coords = JSON.parse(event.data)
    placePixel(coords.x, coords.y)
})

function sendPixel(loc_x,loc_y) {
    coords = {
        x: loc_x,
        y: loc_y
    }
    socket.send(JSON.stringify(coords))
}





//post request 
function postRequest() {
    // Define the coordinates and color of the pixel to be updated
    const pixel = {
    x: 100,
    y: 100,
    color: '#ff0000' // red color
    };

    console.log(JSON.stringify(pixel))

    // Send an HTTP POST request to update the pixel on the server
    fetch('/save', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(pixel)
    })
    .then(response => {
    if (!response.ok) {
        throw new Error('Failed to update pixel');
    }
    // Handle successful response
    })
    .catch(error => {
    console.error(error);
    // Handle error
    });
}

//mouse location and place pixel
pixelCanvas = document.getElementById("pixelCanvas")
currentDiv = document.getElementById("pixel")
var context = pixelCanvas.getContext('2d');
drawGrid(context, 5, '#ccc')

pixelCanvas.onmousemove = function(e){
    if(e.target.classList.contains('pixelCanvas')) {
        var $target = e.target.nextElementSibling;
        var tooltip = document.getElementById("tooltip");            
        var x = e.offsetX;
        var y = e.offsetY;
        tooltip.style.display = 'block';
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
        tooltip.textContent = 'Your text here';
        
        pixelCanvas.onclick = function(e){
            placePixel(x, y)      
            sendPixel(x, y)  
        }

        pixelCanvas.onmouseout = function(e) {
            tooltip.style.display = 'none';
        }
    }
}



function drawGrid(context, spacing, color) {
    context.strokeStyle = color;
    context.lineWidth = 0.1;
  
    // draw vertical lines
    for (let x = spacing + 0.5; x < context.canvas.width; x += spacing) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, context.canvas.height);
      context.stroke();
    }
  
    // draw horizontal lines
    for (let y = spacing + 0.5; y < context.canvas.height; y += spacing) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(context.canvas.width, y);
      context.stroke();
    }
  }
  
  

let  dx, dy, zoomLevel, zoomDirection
function placePixel(x,y) {
    const canvas = document.getElementById('pixelCanvas');
    var context = canvas.getContext('2d');

    // set the fill color
    context.fillStyle = 'blue'
    context.fillRect(x, y, 4, 4);
}

//zoom on the canvas using mousewheel 
zoomLevel = 1.0; // initial zoom level
const canvas = document.getElementById('pixelCanvas');
    var context = canvas.getContext('2d');
canvas.addEventListener('wheel', (event) => {
event.preventDefault(); // prevent default scrolling behavior

// determine zoom direction based on scroll direction
zoomDirection = event.deltaY > 0 ? -1 : 1;

// adjust zoom level
zoomLevel += zoomDirection * 0.05; // adjust zoom level by 10%

// adjust canvas position to keep center of view in same place
const rect = canvas.getBoundingClientRect();
const mouseX = event.offsetX - rect.left;
const mouseY = event.offsetY - rect.top;
const oldWidth = canvas.width / zoomLevel;
const oldHeight = canvas.height / zoomLevel;
const newWidth = canvas.width / (zoomLevel + zoomDirection * 0.1);
const newHeight = canvas.height / (zoomLevel + zoomDirection * 0.1);
dx = (mouseX - oldWidth / 2) * (newWidth / oldWidth - 1);
dy = (mouseY - oldHeight / 2) * (newHeight / oldHeight - 1);
canvas.style.transform = `translate(${dx}px, ${dy}px) scale(${zoomLevel + zoomDirection * 0.01})`;


});

var isDragging = false;
var dragStartX, dragStartY;
var deltaX, deltaY, endX, endY


canvas.addEventListener('mousedown', (event) => {
if (event.button === 2) { // Right mouse button
    isDragging = true;

    dragStartX = event.clientX;
    dragStartY = event.clientY;

    console.log(`dragStartX = ${dragStartX}, dragStartY = ${dragStartY}`)


    }
});

canvas.addEventListener('mousemove', (event) => {

if (isDragging) {
    if(endX == null || endY == null) {
        deltaX = event.clientX - dragStartX;
        deltaY = event.clientY - dragStartY;
    }
    else if(endX || endY) {
        deltaX = endX - (event.clientX - dragStartX)
        deltaY = endY - (event.clientY - dragStartY)
    }
    // Update the canvas position based on the drag distance
    if(dx == null || dy == null) {
        canvas.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    }
    else if(dx || dy) {
        canvas.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${zoomLevel + zoomDirection * 0.01})`;
    }
    
    }
});

canvas.addEventListener('mouseup', (event) => {
if (event.button === 2 && isDragging) {
    isDragging = false;    

    endX = deltaX
    endY = deltaY

    console.log(`deltaX = ${deltaX}, deltaY = ${deltaY}`)
    }
});

canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault()
});