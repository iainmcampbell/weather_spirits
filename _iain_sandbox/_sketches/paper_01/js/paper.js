/**************************************************************************
	
	Paperscript File

	

	Mouse Tool

	Frame Handler
	Resize Handler

**************************************************************************/




// Utils ********************************************************

lerp = function(a, b, u) {
    return (1 - u) * a + u * b;
}

map = function(value, oMin, oMax, nMin, nMax){
    return nMin + (nMax - nMin) * ((value - oMin) / (oMax - oMin));
}




// Trail setup ********************************************************


var Tail = function(){

	var path = new Path({
		strokeColor: [0.8],
		strokeWidth: 30,
		strokeCap: 'round'
	});

	var trail = [],
		cachedPoint,
		trailLength = 10,
		moving = false,
		movingTimeout;

	for(var i=0; i<trailLength; i++) {
		path.add(new Point(view.center, 0))
		trail[i] = {};
	}


	this.update = function(e){
		console.log(e.point.y)
		trail.unshift(new Point(e.point.x, e.point.y)); // add new point to start of array
		trail.pop(); // remove the last point

		cachedPoint = e.point;

		// set up delayed decay
		moving = true;
		clearTimeout(movingTimeout);
		movingTimeout = setTimeout(function() {
			moving = false;
		}, 1000)
	}


	this.draw = function(){
		if(moving) {
			// get tail data from mouse array
			for (var i=trailLength-1; i>=0; i--) {
				path.segments[i].point = trail[i];
			};	
		}
		else {
			// decay tail data
			for (var i=trailLength-1; i>=0; i--) {
				path.segments[i].point = trail[i];
			};		
		}

		path.smooth();
	}

}

var tail = new Tail();




// Boids ********************************************************

var Particles = function(){


	this.update = function(){

	}
	
	this.draw = function(){

	}
}

var particles = new Particles();








// Mouse Tool ********************************************************

// http://paperjs.org/reference/tool/

var kite = new Tool();
tool.distanceThreshold = 10; // move more than this amount to trigger event

function onMouseMove(e){

	tail.update(e);
	
}

function onMouseDown(e){
	console.log('mousedown')
}





// Frame Handler ********************************************************

function onFrame(e){

	tail.draw();

	particles.draw();
	particles.update();

}

// Resize Handler ********************************************************

function onResize(e){

}


