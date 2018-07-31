	var bgColor = "#FFFFFF";
	var canvas;
	var canvasImage;	
	var circleCount;
	var circles;
	var color;
	var context;
	var draggingDraw;
	var draggingMove;
	var dragX;
	var dragY;
	var dragIndexDelete;
	var dragIndexMove;
	var dragStartLocation;
	var mouseX;
	var mouseY;
	var radius;
	var targetX;
	var targetY;
	var tempX;
	var tempY;
	var dx;
	var dy;
	var flagRandom= false;

window.addEventListener('load', init, false);

//Function to resize canvas based on Browser Window size
window.onload = window.onresize = function() {
	var canvas = document.getElementById('canvas');
	var hm = document.getElementById('hm');
	var dbclk = document.getElementById('dbclk');
	canvas.width = window.innerWidth * 0.6;
	canvas.height = window.innerHeight * 0.8;
	buttons.width = canvas.width;
	drawCircles();
}	

//Initialization Function
function init() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext('2d');
	context.lineWidth = 3;
	
	circleCount = 0;	
	draggingDraw = false;
	circles = [];

	//Mouse Event Handlers
	canvas.addEventListener('mousedown', dragStart, false);
	canvas.addEventListener('mousemove', drag, false);
	canvas.addEventListener('mouseup', dragStop, false);
	canvas.addEventListener('click', clickFunc, false);
	canvas.addEventListener('dblclick', deleteCircle,false);
}

function clickFunc(event) {
	setTimeout(function(){hitCircle(event);}, 500);
}	


var clickFlag = 0;

//Random Color Generator Function
function getRandomColor() {
	var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
    	color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function dragStart(event) {
	clickFlag = 0;
    draggingDraw = true;
    dragStartLocation = getCanvasCoordinates(event);
	color = getRandomColor();
    getImage();
}

function drag(event) {
	clickFlag = 1;
    var position;
    if (draggingDraw === true) {
        putImage();
        position = getCanvasCoordinates(event);
        drawCircle(position);
		context.fillStyle = color;
		context.fill();
    }
}
function dragStop(event) {
    draggingDraw = false;
    putImage();
    var position = getCanvasCoordinates(event);
    drawCircle(position);		
	context.fillStyle = color;
	context.fill();	
	circleCount=circleCount+1;
	tempCircle = {x:tempX, y:tempY, rad:radius, color:color};
	
	circles.push(tempCircle);
	
}

//Function to fetch Mouse Coordinates	
function getCanvasCoordinates(event) {
	var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function getImage() {
    canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
}

function putImage() {
    context.putImageData(canvasImage, 0, 0);
}

//Function for Drawing Circles
function drawCircle(position) {
	tempX=dragStartLocation.x;
	tempY=dragStartLocation.y;
		
	radius = Math.sqrt(Math.pow((tempX - position.x), 2) + Math.pow((tempY - position.y), 2));
	context.beginPath();
	context.arc(tempX, tempY, radius, 0, 2 * Math.PI, false);
	context.closePath();
}

// Reset Button Action
function drawScreen() {
	var m = confirm("Are you sure you want to clear the Canvas ?");
	if (m) {
		circleCount=0;
		circles = [];
		context.fillStyle = bgColor;
		context.fillRect(0,0,canvas.width,canvas.height);
	}
}	

function drawCircles() {
	var i;
	var x;
	var y;
	var rad;
	var color;
		
	context.fillStyle = bgColor;
	context.fillRect(0,0,canvas.width,canvas.height);		
		
	for (i=0; i < circleCount; i++) {
		rad = circles[i].rad;
		x = circles[i].x;
		y = circles[i].y;
		color = circles[i].color;
		context.beginPath();
		context.arc(x, y, rad, 0, 2*Math.PI, false);
		context.closePath();
		context.fillStyle = color;
		context.fill();
	}
}

//To check whether the circle was clicked
function isCircleClicked(shape,mx,my) {
	var dx;
	var dy;
	dx = mx - shape.x;
	dy = my - shape.y;
	return (dx*dx + dy*dy < shape.rad*shape.rad);
}

// Function to delete Circle on Double Click
function deleteCircle(event) 
{
		var i;
		var bRect = canvas.getBoundingClientRect();
//		var highestIndex=-1;
		dragIndexDelete=-1;
		
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
		//To find that which circle has been clicked
		for (i=0; i < circleCount; i++) {
			if	(isCircleClicked(circles[i], mouseX, mouseY)) {
				dragIndexDelete = i;		
			}
		}
		//Remove the circle from the array
		if ( dragIndexDelete> -1 ){
			circles.splice(dragIndexDelete,1)[0];
			circleCount=circleCount-1;
		}
		
		if (event.preventDefault) {
			event.preventDefault();
		} 
		else if (event.returnValue) {
			event.returnValue = false;
		} 
		drawCircles();				
		return false;
}

//Hit/Miss Detection Function
function hitCircle(event) {
	var i;
	var bRect = canvas.getBoundingClientRect();
	var hitFlag = 0;
	mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
	mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
	
	if (clickFlag == 0) {
		for (i=0; i < circleCount; i++) {
			if	(isCircleClicked(circles[i], mouseX, mouseY)) {
				hitFlag = 1;
				alert("Hit");
				break;		
			}
	}
	if (hitFlag == 0) {
			alert("Miss");
		}
	}
}
