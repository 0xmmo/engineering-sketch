$(document).ready(function(){
	var canvas = document.getElementById("grid");
	$('#grid').css('width', $(window).width());
	$('#grid').css('height', $(window).height());
	canvas.width = $(window).width();
	canvas.height = $(window).height();
	ctx = canvas.getContext("2d");
	width = canvas.width;
	height = canvas.height;
	mouseX = 0;
	mouseY = 0;
	mouseD = false;
	freeform = false;
	construction = false;

	ySpacing = 30;
	xSpacing = ySpacing*Math.cos(Math.PI/6);
	pointRadius = 1;
	lineStyle = "solid";

	ctx.fillStyle = 'rgba(0,0,0,0.3)';
	ctx.strokeStyle = 'rgba(0,0,0,0.5)';
	ctx.lineWidth = 2;
	
	points = [];
	lines = [];

	$(document).mousedown(function(evt) {
		mouseD = true;

		downMouseX = Math.round(evt.pageX/xSpacing)*xSpacing;
		var yOffset = Math.round(evt.pageX/xSpacing)%2? ySpacing/2 : 0;
		downMouseY = Math.round((evt.pageY-yOffset)/ySpacing)*ySpacing+yOffset;

	});

	$(document).mouseup(function(evt) {
		mouseD = false;

		upMouseX = Math.round(evt.pageX/xSpacing)*xSpacing;		
		var yOffset = Math.round(evt.pageX/xSpacing)%2? ySpacing/2 : 0;
		upMouseY = Math.round((evt.pageY-yOffset)/ySpacing)*ySpacing+yOffset;

		lines.push([downMouseX,downMouseY,upMouseX,upMouseY,lineStyle]);

		draw();

	});

	$(document).mousemove(function(evt){

		if(mouseD){

			currentMouseX = Math.round(evt.pageX/xSpacing)*xSpacing;		
			var yOffset = Math.round(evt.pageX/xSpacing)%2? ySpacing/2 : 0;
			currentMouseY = Math.round((evt.pageY-yOffset)/ySpacing)*ySpacing+yOffset;

			currentLine = [downMouseX,downMouseY,currentMouseX,currentMouseY,lineStyle];

			draw();

		}

	});

	$(document).keyup(function(evt) {

		if (evt.keyCode == 8) {

			lines.pop();

			draw();
		}

		if (evt.keyCode == 32) {

			lineStyle = lineStyle === "solid" ? "dashed" : "solid";

			setLineStyle(lineStyle);

		}

	});

	init();
	
});

function draw(){

	ctx.clearRect(0,0,width,height);

	for(var n=0; n<points.length; n++){
		ctx.beginPath();
		ctx.arc(points[n][0],points[n][1],pointRadius,0,2*Math.PI);
		ctx.fill();
	}

	for(var n=0; n<lines.length; n++){
		
		setLineStyle(lines[n][4]);
		
		ctx.beginPath();
		ctx.moveTo(lines[n][0],lines[n][1]);
		ctx.lineTo(lines[n][2],lines[n][3]);
		ctx.stroke();
	}

	setLineStyle(lineStyle);

	if(mouseD){		
		ctx.beginPath();
		ctx.moveTo(currentLine[0],currentLine[1]);
		ctx.lineTo(currentLine[2],currentLine[3]);
		ctx.stroke();
	}

}

function init(){

	for(var i=1; i<width/xSpacing; i++){
		for(var j=1; j<(height-ySpacing/2)/ySpacing; j++){
			var yOffset = i%2? ySpacing/2 : 0;
			points.push([i*xSpacing,j*ySpacing+yOffset]);
		}
	}

	draw();
}

function setLineStyle(style){

	if(style === "dashed"){
		ctx.setLineDash([5, 5]);
	}else if(style === "solid"){			
		ctx.setLineDash([5, 0]);
	}

}