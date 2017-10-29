'use strict';

(function() {


var coloursList = document.getElementsByName('color');

var brushUp = document.getElementsByName('brushUp');
var brushDown = document.getElementsByName('brushDown');
var brushSize = document.getElementsByName('brushSize');

var current = { 
	color: 'black'
};

var brushS = 2;

//changing of colours
//create event listeners for changing colours of brush
for (var i = 0; i < coloursList.length; i++) {
	coloursList[i].addEventListener('click', onColorUpdate, false);
}

//create event listeners for changing size
brushUp[0].addEventListener('click', function() {onBrushUpdate(1)}, false);
brushDown[0].addEventListener('click', function() {onBrushUpdate(-1)}, false);

//to update brush size
function onBrushUpdate(e){
	var newBrush = brushS;
	brushS = brushS + e;
	if((brushS > 5) || (brushS < 1))
	{
		brushS = newBrush;
	}
	brushSize[0].innerText = "Brush Size: " + brushS;
}

//to update colour
function onColorUpdate(e){
    current.color = e.target.className.split(' ')[2];
}

//working with the canvas itself
var canvas = document.getElementsByClassName('whiteboard')[0];
var context = canvas.getContext('2d');
var drawing = false;

//create canvas listeners
//when click
canvas.addEventListener('mousedown', onMouseDown, false);
//when not clicking
canvas.addEventListener('mouseup', onMouseUp, false);
//when mouse leaves the canvas
canvas.addEventListener('mouseout', onMouseUp, false);
//when mouse moves around
canvas.addEventListener('mousemove', throttle(onMouseMove, 5), false);

//draw line method
function drawLine(x0, y0, x1, y1, color, brushSize, emit){
	
	context.beginPath();

	if(color == 'white')
	{
		context.fillStyle = color;
		context.arc(x1, y1, 30, 0, Math.PI*2, true);
		context.fill();
	}
	else
	{
		context.strokeStyle = color;
		context.moveTo(x0, y0);
		context.lineTo(x1, y1);
		context.lineWidth = parseInt(brushSize);
		context.stroke();
	}

	
	context.closePath();

	if (!emit) { return; }
	var w = canvas.width;
	var h = canvas.height;

	//emit to all other sockets
	socket.emit('drawing', {
		x0: x0 / w,
		y0: y0 / h,
		x1: x1 / w,
		y1: y1 / h,
		color: color,
		brushSize: brushSize
	});

}

//on click method
function onMouseDown(e){
    drawing = true;
    current.x = e.clientX;
    current.y = e.clientY;
}

//on unclick method
function onMouseUp(e){
    if (!drawing) { return; }
    drawing = false;
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, brushS, true);
}

//on movement of mouse method
function onMouseMove(e){
    if (!drawing) { return; }
    drawLine(current.x, current.y, e.clientX, e.clientY, current.color, brushS, true);
    current.x = e.clientX;
    current.y = e.clientY;
}

// limit the number of events per second
function throttle(callback, delay) {
	var previousCall = new Date().getTime();
		return function() {
			var time = new Date().getTime();
			if ((time - previousCall) >= delay) {
			previousCall = time;
			callback.apply(null, arguments);
		}
	};
}

//when others are drawing, do onDrawingEvent.
socket.on('drawing', onDrawingEvent);

//when other people draw, this event is called
function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.brushSize);
}


//resize window
window.addEventListener('resize', onResize, false);
onResize();

function onResize() {
	//save the image and post it again once it 
	//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
	var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context.putImageData(imgData, 0, 0);
}

})();

