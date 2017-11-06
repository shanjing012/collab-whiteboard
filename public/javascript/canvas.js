'use strict';

(function() {

//CURRENT BRUSH OBJECT
var current = { 
	color: 'black',
	brushS: 2,
	eraser: false,
	drawing: false
};

//Get elements from document.
var brushUp = document.getElementsByName('brushUp')[0];
var brushDown = document.getElementsByName('brushDown')[0];
var brushSize = document.getElementsByName('brushSize')[0];
var colorpicker = document.getElementsByName('colourpicker')[0];
var eraser = document.getElementsByName('eraser')[0];
var canvas = document.getElementsByClassName('whiteboard')[0];
var download = document.getElementsByName('download')[0];
var context = canvas.getContext('2d');

//set background
context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = current.color;


//EVENT LISTENER: Color picker
colorpicker.addEventListener('click', function() {
	current.eraser = false;
}, false);

//EVENT LISTENER: Eraser
eraser.addEventListener('click', function() {
	current.eraser = true;
}, false);

//EVENT LISTENERS: Changing brush size
brushUp.addEventListener('click', function() {onBrushUpdate(1)}, false);
brushDown.addEventListener('click', function() {onBrushUpdate(-1)}, false);

//FUNCTION: updating brush size
function onBrushUpdate(e){
	var newBrush = current.brushS;
	current.brushS = current.brushS + e;
	if((current.brushS > 9) || (current.brushS < 1))
	{
		current.brushS = newBrush;
	}
	brushSize.innerText = "Brush Size: " + current.brushS;
}

//EVENT LISTENER: Download
download.addEventListener('click', onDownload, false);

//FUNCTION: Download image as jpeg
function onDownload(e){
	var img = canvas.toDataURL('image/jpeg');
	this.download = 'image';
	this.href = img;
}

//EVENT LISTENER: Canvas
//when click
canvas.addEventListener('mousedown', onMouseDown, false);
//when not clicking
canvas.addEventListener('mouseup', onMouseUp, false);
//when mouse leaves the canvas
canvas.addEventListener('mouseout', onMouseUp, false);
//when mouse moves around
canvas.addEventListener('mousemove', throttle(onMouseMove, 5), false);

//EVENT LISTENER: Touch commands
//on touch start
canvas.addEventListener('touchstart', function(e) {
	e.preventDefault();
	//create a mouse event with the touch handler
	var touch = e.touches[0];
	var mouseEvent = new MouseEvent("mousedown", {
    	clientX: touch.clientX,
    	clientY: touch.clientY
  	});
	onMouseDown(mouseEvent);
}, false);
//on touch move
canvas.addEventListener('touchmove', function(e) {
	e.preventDefault();
	//create a mouse event with the touch handler
	var touch = e.touches[0];
	var mouseEvent = new MouseEvent("mousemove", {
    	clientX: touch.clientX,
    	clientY: touch.clientY
  	});
	onMouseMove(mouseEvent);
}, false);
//on touch end
canvas.addEventListener('touchend', function(e) {
	e.preventDefault();
	//create a mouse event with the touch handler
	current.drawing = false;
}, false);


//FUNCTION: Drawing of line
function drawLine(x0, y0, x1, y1, current, emit){
	
	context.beginPath();
	if(current.eraser == true)
	{

		context.fillStyle = 'white';
		context.arc(x1, y1, 30, 0, Math.PI*2, true);
		context.fill();
	}
	else
	{
		context.lineCap = "round";
		context.strokeStyle = current.color;
		context.moveTo(x0, y0);
		context.lineTo(x1, y1);
		context.lineWidth = parseInt(current.brushS);
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
		current: current
	});

}

//FUNCTION: on click
function onMouseDown(e){

	//change color when drawing.
	current.color = colorpicker.jscolor.toHEXString();

    current.drawing = true;
    current.x = e.clientX - canvas.offsetLeft;
    current.y = e.clientY - canvas.offsetTop;
}

//FUNCTION: on unclick
function onMouseUp(e){
    if (!current.drawing) { return; }
    current.drawing = false;
    drawLine(current.x, current.y, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, current, true);
}

//FUNCTION: on movement of mouse method
function onMouseMove(e){
    if (!current.drawing) { return; }

    drawLine(current.x, current.y, e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, current, true);
    current.x = e.clientX - canvas.offsetLeft;
    current.y = e.clientY - canvas.offsetTop;
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

//SOCKET HANDLER: when others are drawing, do onDrawingEvent.
socket.on('drawing', onDrawingEvent);

//FUNCTION: when other people draw, this event is called
function onDrawingEvent(data){
    var w = canvas.width;
    var h = canvas.height;
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.current);
}

//resize window
window.addEventListener('resize', onResize, false);
onResize();

function onResize() {
	//save the image and post it again once it 
	//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData
	var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
	//need to create an image object to store the image then scale it toward the image itself.

	if(window.innerHeight < 576 + 50 || window.innerWidth < 1024)
	{
		//scale down
		//take into account the navbar
		var scaleX = window.innerWidth / canvas.width;
		var scaleY = (window.innerHeight - 50)  / canvas.height;

		var scale;
		if(scaleX < scaleY)
			scale = scaleX;
		else
			scale = scaleY;

		canvas.height = canvas.height * scale;
		canvas.width = canvas.width * scale;
		//context.putImageData(imgData, 0, 0);
	}
	else
	{
		//scale back up to 1024 and 576
		var scaleX = 1024 / canvas.width;
		var scaleY = 576 / canvas.height;

		context.scale(scaleX, scaleY);
		canvas.height = canvas.height * scaleY;
		canvas.width = canvas.width * scaleX;
    	//context.putImageData(imgData, 0, 0);
	}
	//draw the scaled image
	//create white background first
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = current.color;
    context.putImageData(imgData, 0, 0);
}

})();