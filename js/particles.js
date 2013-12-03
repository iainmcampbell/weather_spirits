
/**************************************************************************
	
	  _____                             
	 / ____|                            
	| (_____      ____ _ _ __ _ __ ___  
	 \___ \ \ /\ / / _` | '__| '_ ` _ \ 
	 ____) \ V  V / (_| | |  | | | | | |
	|_____/ \_/\_/ \__,_|_|  |_| |_| |_|
	                                    

	Spirit(Point point, Point offset, Point delay)

	swarm.add(howmany)
	
	swarm.initSwarm()
	swarm.updateSwarm(base_position)

**************************************************************************/

// Class definition
function Spirit(_point, _offset, _speed){

	this.offset = _offset; // vector distance from kite
	this.speed  = _speed;  // random variation in follow speed

	this.circle = new Path.Circle({
		center : _point,
		radius : 5,
		style : {
			fillColor: 'blue'
		}
	})

}

var swarm = {

	array : [],
	len : 0,

	// ********************************************************
	initSwarm : function(){

		array = [];
	},

	// ********************************************************
	add : function(howmany){
		for (var i = 0; i < howmany; i++) {
			var point  = new Point(0,0);
			var offset = new Point( util.rand(-100,-200), util.rand(-50,50)  );
			var speed  = util.rand(2,4);

			this.array.push( new Spirit(point, offset, speed) );
		};

		this.len = this.array.length;
	},

	// ********************************************************
	remove : function(howmany){
		for (var i = 0; i < howmany; i++) {
			this.array.shift();
		};

		this.len = this.array.length;
	},

	// ********************************************************
	updateSwarm : function(base_position){

		if(this.len <= 0) return;

		for (var i=this.len-1; i>=0; i--) {

			var destination = base_position.add(this.array[i].offset);
			
			var diff = this.array[i].circle.position.subtract(destination);

			// TODO: add acceleration

			if(diff.length > this.array[i].speed) diff.length = this.array[i].speed; // cap speed

			this.array[i].circle.position = this.array[i].circle.position.subtract(diff);

		};

	}

}


/**************************************************************************
	
	 _  ___ _       
	| |/ (_) |      
	| ' / _| |_ ___ 
	|  < | | __/ _ \
	| . \| | ||  __/
	|_|\_\_|\__\___|
	
	kite.initKite()
	kite.draw()

	kite.mouseMove() -> updates variables

	kite.updatePosition() -> returns kite position as paper.Point

	params:
	max_speed: pixels per second, default 5
	wind_strength: base sine wave oscillation strength multiplier. default 1.
	y_max, x_max:  how far the kite can go from the base point

**************************************************************************/

var kite = {

	// Parameters
	
	y_max : 0,
	x_max : 0,

	max_speed : 10,
	wind_strength : 1, // 1 = 'normal'

	// Points

	base  : null, // centre of the bounding box
	mouse : null, // mouse position
	// kite  : null, // kite point


	// Paper objects

	kite : null,
	runner : null,
	kite_string : null,


	// ********************************************************

	initKite : function(){
		var h = paper.view.size.height;
		var w = paper.view.size.width;

		kite.y_max = h / 4;
		kite.x_max = kite.y_max;

		kite.base  = new Point(w-w/3, h/3); 
		kite.kite  = new Point(w-w/3-100, h/3-100);
		kite.mouse = new Point(0,0);

		// Init visuals

		kite.kite = new Path.Circle({
			center : kite.kite,
			radius : 3,
			style : {
				fillColor: 'red'
			}
		})

		kite.runner = new Path.Circle({
			center : [w*(7/8), h],
			radius : 5,
			style : {
				fillColor: 'grey'
			}
		})

		kite.kite_string = new Path(
			new Segment({
				point : new Point(0,0),
				handleIn : new Point(-w*0.15, h*0.35)
			}),
			new Segment({
				point : new Point(0,0),
				handleIn : new Point( -w*0.2, -h*0.06)
			})
		);
		kite.kite_string.style = {
			strokeWeight: 1,
			strokeColor: 'black'
		};
		kite.kite_string.smooth()


		// if(debug){
		// 	var from = new Point(kite.base.x - kite.x_max, kite.base.y - kite.y_max)
		// 	var to   = new Point(kite.base.x + kite.x_max, kite.base.y + kite.y_max)
		// 	var bounding_box = new Path.Rectangle(from,to);
		// 	bounding_box.fillColor = '#eeeeee';

		// 	var base_marker = new Path.Circle({
		// 		center : kite.base,
		// 		radius : 5,
		// 		style : {
		// 			strokeColor: 'black',
		// 			strokeWidth: 1
		// 		} 
		// 	})
		// }

	},

	mouseMove : function(e){
		kite.mouse = new Point(e.event.pageX, e.event.pageY);
	},

	updatePosition : function(oldPos){

		var mouse = new Point(control.currentpos.x, control.currentpos.y)

		// Calculate the normalized quadrant positions 
		// of the mouse and the kite, as well as booleans

		//  ––––––– –––––––
		// | -1,-1 |  1,-1 |
		//  –––––––0–––––––
		// | -1, 1 |  1, 1 |
		//  ––––––– –––––––

		var mouse_diff_float = [
			util.cap( (mouse.x - kite.base.x), -kite.x_max, kite.x_max) / kite.x_max,
			util.cap( (mouse.y - kite.base.y), -kite.y_max, kite.y_max) / kite.y_max
		];

		var mouse_diff_bool = [
			(mouse_diff_float[0] > 0) ? true : false,
			(mouse_diff_float[1] > 0) ? true : false
		];

		var kite_diff_float = [
			util.cap( (oldPos.x - kite.base.x), -kite.x_max, kite.x_max) / kite.x_max,
			util.cap( (oldPos.y - kite.base.y), -kite.y_max, kite.y_max) / kite.y_max
		];

		var kite_diff_bool = [
			(kite_diff_float[0] > 0) ? true : false,
			(kite_diff_float[1] > 0) ? true : false
		];


		// If the kite is in a different quadrant than the mouse,
		// it's going towards the base, so don't apply resistance.
		// Otherwise, apply resistance based on how far the kite is
		// from the base.

		var x_resistance,
			y_resistance;

		// X
		if(kite_diff_bool[0] !== mouse_diff_bool[0]) {
			x_resistance = 1;
		} else {
			var diff = util.cap( Math.abs(kite.base.x - oldPos.x), 0, kite.x_max);
			x_resistance = util.easeOutSine( diff, 1, -1, kite.x_max);
		}

		// Y
		if(kite_diff_bool[1] !== mouse_diff_bool[1]) {
			y_resistance = 1;
		} else {
			var diff = util.cap( Math.abs(kite.base.y - oldPos.y), 0, kite.y_max);
			y_resistance = util.easeOutSine( diff, 1, -1, kite.y_max);
		}

		var position_resistance = new Point(x_resistance, y_resistance);
		

		// calculate the movement vector

		var diff = mouse.subtract(oldPos);
		if(diff.length > kite.max_speed) diff.length = kite.max_speed; // cap speed to 5

		diff = diff.multiply(position_resistance)

		// var newPos = ;
		return oldPos.add(diff);
	},


	draw : function(){

		kite.kite.position = kite.updatePosition( kite.kite.position );

		swarm.updateSwarm( kite.kite.position );

		kite.kite_string.segments[0].point = kite.kite.position;
		kite.kite_string.segments[1].point = kite.runner.position;

	}

};


