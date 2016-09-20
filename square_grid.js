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

	spacing = 30;
	pointRadius = 1;
	lineStyle = "solid";

	ctx.fillStyle = 'rgba(0,0,0,0.3)';
	ctx.strokeStyle = 'rgba(0,0,0,0.5)';
	ctx.lineWidth = 2;

	arcTool = false;
	
	points = [];
	lines = [];
	arcs = [];

	$(document).mousedown(function(evt) {
		mouseD = true;

		downMouseX = Math.round(evt.pageX/spacing)*spacing;
		downMouseY = Math.round(evt.pageY/spacing)*spacing;

	});

	$(document).mouseup(function(evt) {
		mouseD = false;

		upMouseX = Math.round(evt.pageX/spacing)*spacing;
		upMouseY = Math.round(evt.pageY/spacing)*spacing;

		// lines.push([downMouseX,downMouseY,upMouseX,upMouseY,lineStyle]);

		if(arcTool){
			if(upMouseX !== downMouseX && upMouseY !== downMouseY){ // Quarter circle
				var radius = Math.abs(upMouseY-downMouseY);

				if(upMouseX<downMouseX && upMouseY>downMouseY){
					var centerX = upMouseX;
					var centerY = downMouseY;
					var startAngle = 0;
				}else if(upMouseX<downMouseX && upMouseY<downMouseY){
					var centerX = downMouseX;
					var centerY = upMouseY;
					var startAngle = 0.5*Math.PI;
				}else if(upMouseX>downMouseX && upMouseY<downMouseY){
					var centerX = upMouseX;
					var centerY = downMouseY;
					var startAngle = Math.PI;
				}else if(upMouseX>downMouseX && upMouseY>downMouseY){
					var centerX = downMouseX;
					var centerY = upMouseY;
					var startAngle = 1.5*Math.PI;
				}

				arcs.push([centerX, centerY, radius, startAngle, startAngle+0.5*Math.PI,lineStyle]);
 
			}
		}else{
			lines.push([downMouseX,downMouseY,upMouseX,upMouseY,lineStyle]);
		}

		draw();

	});

	$(document).mousemove(function(evt){

		if(mouseD){

			currentMouseX = Math.round(evt.pageX/spacing)*spacing;
			currentMouseY = Math.round(evt.pageY/spacing)*spacing;

			if(arcTool){
				if(currentMouseX !== downMouseX && currentMouseY !== downMouseY){ // Quarter circle
					var radius = Math.abs(currentMouseY-downMouseY);

					if(currentMouseX<downMouseX && currentMouseY>downMouseY){
						var centerX = currentMouseX;
						var centerY = downMouseY;
						var startAngle = 0;
					}else if(currentMouseX<downMouseX && currentMouseY<downMouseY){
						var centerX = downMouseX;
						var centerY = currentMouseY;
						var startAngle = 0.5*Math.PI;
					}else if(currentMouseX>downMouseX && currentMouseY<downMouseY){
						var centerX = currentMouseX;
						var centerY = downMouseY;
						var startAngle = Math.PI;
					}else if(currentMouseX>downMouseX && currentMouseY>downMouseY){
						var centerX = downMouseX;
						var centerY = currentMouseY;
						var startAngle = 1.5*Math.PI;
					}

					currentArc = [centerX, centerY, radius, startAngle, startAngle+0.5*Math.PI,lineStyle];
				
				}else{
					currentArc = [0, 0, 0, 0, 0,lineStyle];
				}

			}else{
				currentLine = [downMouseX,downMouseY,currentMouseX,currentMouseY,lineStyle];
			}

			draw();

		}

	});

	$(document).keyup(function(evt) {

		if (evt.keyCode == 8) {

			if(arcTool){
				arcs.pop();
			}else{
				lines.pop();
			}

			draw();
		}

		if (evt.keyCode == 32) {

			lineStyle = lineStyle === "solid" ? "dashed" : "solid";

			setLineStyle(lineStyle);

		}

		if (evt.keyCode == 65) {

			arcTool = arcTool ? false : true;

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

	for(var n=0; n<arcs.length; n++){

		setLineStyle(arcs[n][5]);

		ctx.beginPath();
		ctx.arc(arcs[n][0], arcs[n][1], arcs[n][2], arcs[n][3], arcs[n][4]);  // Create an arc
		ctx.stroke();
	}

	setLineStyle(lineStyle);

	if(mouseD){
		if(arcTool){
			ctx.beginPath();
			ctx.arc(currentArc[0], currentArc[1], currentArc[2], currentArc[3], currentArc[4]);  // Create an arc
			ctx.stroke();
		}else{
			ctx.beginPath();
			ctx.moveTo(currentLine[0],currentLine[1]);
			ctx.lineTo(currentLine[2],currentLine[3]);
			ctx.stroke();
		}
	}

}

function init(){

	for(var i=1; i<width/spacing; i++){
		for(var j=1; j<height/spacing; j++){
			points.push([i*spacing,j*spacing]);
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