
// (function(window){


	/**************************************************************************
		
		Let's cache some domzzzzz
	
	**************************************************************************/
	
	var $menu = $("#menu"),
		$canvas = $('#paper');



	/**************************************************************************
		
		Menu
		- controls which stage of the experience we are on: menu or level,
		  and which level
	
	**************************************************************************/
	
	var menu = {

		show_menu : function(){

			// show the menu and bind click event handlers
			$menu.show();

		},

		start_level : function(which_level){

			// hide the menu and unbind all its event handlers
			$menu.hide();

			// show the canvas object and bind its event handlers
			// p.init()
			api.currentLevel = which_level;
			control.init();
			// particles.init();
			ground.init();
			ground.update();

			// call all the paperjs init functions

		}
	}




	/**************************************************************************
		
		API
		- loads the weather data from an external JSON file
		- data is accessible from:
			api.data.<city>.[
				{
			    	"date": "20120901",
			    	"rain": "0",
			    	"snow": "0",
			    	"fog": "0",
			    	"thunder": "0",
			    	"tornado": "0",
			    	"hail": "0",
			    	"snowfallm": "0.00",
			    	"meantempm": "17",
			    	"meanwindspdm": "17",
			    	"precipm": "0.00",
			    	"meanvism": "16"
			    }
		    ]

	**************************************************************************/
	
	var api = {

		currentLevel : undefined,
		data : {},

		init : function(){
			console.log('api.init() -> api.data:')
			// load the data

			$.getJSON('api/data.json', function(json) {
				api.data = json;
				console.log(api.data)
			});

		}

	}




	/**************************************************************************
		
		Various utility functions
	
	**************************************************************************/
	

	var util = {

		map : function(value, oMin, oMax, nMin, nMax){
		    return nMin + (nMax - nMin) * ((value - oMin) / (oMax - oMin));
		},

	}




	/**************************************************************************
		
		p: Master paperscript controller
		- holds the canvas object
		- any global paperjs config goes here

		update()
		- calls all the draw functions from different modules
		- runs the actual paperjs draw frame function

	
	**************************************************************************/
	
	var p = {
		canvas : $canvas[0],
		
		init : function(){
			paper.setup(p.canvas);
			paper.view.onFrame = p.update;
			paper.view.onResize = p.debounce;
		},

		update : function(){

			particles.update();
			ground.update();

			paper.view.draw();
		},


		/* Debounced Resize
		 *
		 * makes sure all resize functionality only happens once every 500ms:
		 * otherwise in some browsers resizing makes things hella laggy
		 * and sometimes breaks them. */

		resizeTimeout : undefined,

		debounce : function(){
			if(p.resizeTimeout) clearTimeout(p.resizeTimeout);
			resizeTimeout = setTimeout(p.resize, 500);
		},

		// all paperscript-related resize functionality should be called from here
		resize : function(){
			particles.resize();
		}

	}



	


	/**************************************************************************
		
		Paper: Ground
	
	**************************************************************************/
	

	var ground = {

		

		divisions : [],
		height : 0,
		amount : 5,
		groundpath : {},

		pan1 : {
			fps: 30,
			speed: 1,
			dir: 'left'
		},

		pan2 : {
			fps: 30,
			speed: .25,
			dir: 'right'
		},





		init : function(){

			$('#background2').pan(ground.pan2);
			$('#background').pan(ground.pan1);

			var windowwidth= $(window).width();
		
			function dividewidth(){
				for (var i = 0; i <= 5; i++) {
					var x= i/5 * windowwidth;
					ground.divisions.push(x);
				}
		
			};

			function randonum(){
				return Math.floor((Math.random()*10));
			};
		
			dividewidth();

			control.speed = 0;
			ground.height= randonum() * 10 + 50;
			ground.amount = 5;

			control.accelerating = false;
			control.distance = 0;

			paper.setup('paper');
		
			
			ground.groundpath = new paper.Path({
				strokeColor: [0.5],
				strokeWidth: 20,
				strokeCap: 'square'
			});
			
			for (var i = 0; i <= ground.amount; i++) {
				var x= i/ground.amount * paper.view.size.width;
				ground.groundpath.add(new paper.Point(x, 1) );
			}

		},

		accelerate : function(){

			if(control.accelerating && control.speed>=3) {
			
					control.speed = 3;
					return;
			
			} else if(control.accelerating && control.speed<3) {
			
					control.speed += control.spdinc;
			
			} else {
			
					if(control.speed <= 0) {
						control.speed = 0;
						return;
					} else {
						control.speed -= control.spdinc;
					}
				}
		},

		update : function(){

			// paper.setup('paper');
		
		
			
			// paper.view.onFrame = function(event) {
				console.log(ground.pan1.speed);
				console.log('la')
				console.log(speed, distance);
		
				ground.accelerate();
		
				
				for (var i = 0; i <= ground.amount; i++) {
		
					var segment = ground.groundpath.segments[i];
					var sinus = Math.sin(control.distance + i) * (control.speed/10);
					control.distance += control.speed * 0.01;
					segment.point.y = sinus * ground.height + 400;
			
				}
				ground.groundpath.smooth();
				
			// }
		
		}

		
	}

	/**************************************************************************
		
		Paper: KITE
	
	**************************************************************************/
	
	// var kite = {

	// 	kiteobj : {},
	// 	kitepos : { x: 100, y: 100},


	// 	init : function(){

	// 		paper.setup('paper');

	// 		kite.kiteobj = new paper.Path.Circle(new paper.Point(kite.kitepos.x, kite.kitepos.y), 50);

	// 		kite.kiteobj.fillColor = 'black';
	// 		// console.log(kite.kiteobj);

	// 	},


	// 	update : function(){

	// 		paper.setup('paper');
		
		
			
	// 		paper.view.onFrame = function(event) {

	// 			kite.kitepos.x = control.currentpos.x;
	// 			kite.kitepos.y = control.currentpos.y;

	// 			// console.log(kite.kiteobj);
	// 		}


	// 	},


	// 	resize : function(){



	// 	},



	// }


	/**************************************************************************
		
		Paper: Particles
	
	**************************************************************************/
	
	var particles = {

		p : [], // the particle array
		t : [], // the tails array

		numParticles : 50,

		rowLength : 10,
		numRows : null,

		mx : null,
		my : null,

		init : function(){

			var h = paper.view.size.height,
				w = paper.view.size.width,
				rows = 0,
				rowCounter = 0;

			particles.numRows = Math.ceil(particles.numParticles/particles.rowLength);

			for (var i = 0; i < particles.numParticles; i++) {
				particles.p[i] = new paper.Path.Circle([0,0], 10);
				particles.p[i].fillColor = 'black';				
			};

			particles.resize();

		},


		update : function(){

			// Very simple proximity detection

			var r = paper.view.size.width/15,
				mx = particles.mx,
				my = particles.my;

			for (var i = particles.p.length-1; i>=0; i--) {
				var px = particles.p[i].position.x,
					py = particles.p[i].position.y;

				// if within range (+/-r)
				if(mx < px+r && mx > px-r  &&  my < py+r && my > py-r) {
					particles.p[i].fillColor = 'red';
				} else {
					particles.p[i].fillColor = 'black';
				}
			};

		},


		resize : function(){

			var h = paper.view.size.height,
				w = paper.view.size.width,
				rows = 0,
				rowCounter = 0,
				xSpacing = w/particles.rowLength,
				ySpacing = h/particles.numRows;

			for (var i = 0; i < particles.numParticles; i++) {

				var x = ((rowCounter*xSpacing) * 0.8) + (w*0.1); // (position * overall_width) + left
				var y = ((rows*ySpacing ) * 0.8) + (h*0.1);      // (position * overall_height) + top

				particles.p[i].position = [x,y];

				rowCounter++;
				if(rowCounter > particles.rowLength) {
					rows++;
					rowCounter = 0;
				}
			};

		},



	}



	/**************************************************************************
		
		Control (for the game)
		- input handlers -> speed variable
	
	**************************************************************************/

	var control = {


		speed : 0,
		currentpos : { x: -1, y: -1 },
		spdinc : 0,
		accelerating : false,
		distance: 0,

		init : function(){

			

			$(document).on('keydown', function(e){
			    switch(e.which) {
			        // case 37: // left
			        // 	break;

			        case 39: // right
			        	control.go();
			        	break;

			        // case 38: // up
				       //  break;

			        // case 40: // down
				       //  break;

			        // case 32: // space
			        // 	break;

			        default: return; // exit this handler for other keys
			    }
			    e.preventDefault();
			});

			

			$canvas.on('mousemove',function(e){
				var point = [e.pageX,e.pageY];

				particles.mx = e.pageX;
				particles.my = e.pageY;

				control.currentpos = { x: e.pageX, y: e.pageY };


				if (control.currentpos.x > $(ground.divisions).get(0) && control.currentpos.x < $(ground.divisions).get(1) ) {
					control.accelerating=false;
					control.spdinc= 0.04;
					$('#background').spStop();
					$('#background2').spStop();
				}
				
				if (control.currentpos.x > $(ground.divisions).get(1) && control.currentpos.x < $(ground.divisions).get(2) ) {
					control.accelerating = false;
					control.spdinc= 0.01;
					$('#background').spStart();
					$('#background2').spStart();
					$('#background').spSpeed(.25);
					$('#background2').spSpeed(1); 
				}
				if (control.currentpos.x > $(ground.divisions).get(2) && control.currentpos.x < $(ground.divisions).get(3) ) {
					control.accelerating = true;
					control.spdinc= 0.02;
					$('#hills').spSpeed(20);
					$('#background').spSpeed(.5);
					$('#background2').spSpeed(4); 
					
				}
				if (control.currentpos.x > $(ground.divisions).get(3) && control.currentpos.x < $(ground.divisions).get(4) ) {
					control.accelerating = true;
					control.spdinc= 0.04;
					$('#background').spSpeed(1);
					$('#background2').spSpeed(7);
				}
				if (control.currentpos.x > $(ground.divisions).get(4) && control.currentpos.x < $(ground.divisions).get(5) ) {
					control.accelerating = true;
					control.spdinc= 0.06;
					$('#background').spSpeed(2);
					$('#background2').spSpeed(12);
					
				}


				// control.speed+=1;

				// console.log(control.speed);
				// console.log(ground.divisions);
				// console.log(control.currentpos.x);
				// console.log(control.accelerating);
				// console.log(control.spdinc);

			
			})


			if(Modernizr.touch) {

				console.log('touch enabled')

				// prevent touch overscroll
				// $(document).on('touchstart',  function(e) { e.preventDefault(); });

				// $('*').css('transform','translate3d(0,0,0)')

				// Hammer(document)
				// 	.on("swipeleft", function(){ s.next() })
				// 	.on("swiperight",function(){ s.prev() })

			}


		},

		destroy : function(){

			$(document).off('keydown')

			// off touch

		},

		// Process the running action ********************************************************

		go : function(){
			console.log('go')
		}


	}

	




	$(document).ready(function(){

		// kite.init();
		// kite.update();

		api.init();
		ground.init();
		ground.update();
		// // preloader.init(); // if we write a preloader


		// PRODUCTION

		menu.show_menu();

		// DEVELOPMENT

		menu.start_level('toronto')

	})

// })(window);