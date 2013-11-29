
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

			api.currentLevel = which_level;

			// hide the menu and unbind all its event handlers
			$menu.hide();

			// show the canvas object and bind its event handlers


			// common modules
			
			p.init();
			control.init();

			// *****************************
			// CANVAS MODULE INITS GO HERE

			// particles.init();
			ground.init();


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
			paper.install(window);
			paper.setup(p.canvas);
			paper.view.onFrame = p.update;
			paper.view.onResize = p.debounce;
		},

		update : function(){

			// particles.update();
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
			// particles.resize();
		}

	}



	/**************************************************************************
		
		Control (for the game)
		- input handlers -> speed variable
	
	**************************************************************************/

	var control = {

		// MASTER VARIABLE
		// range 0-3 -> change to 0-1
		speed : 0,
		accelerating : false,

		speedfix: 0,
		currentpos : { x: -1, y: -1 },
		spdinc : 0,
		distance: 0,
		spawnqeues: 0,

		init : function(){

			$canvas.on('mousemove.control', control.go)

			if(Modernizr.touch) {

				console.log('touch enabled')

				// prevent touch overscroll
				// $(document).on('touchstart',  function(e) { e.preventDefault(); });

				// $('*').css('transform','translate3d(0,0,0)')

				// Hammer(document)
				// 	.on("swipeleft",  function(){ s.next() })
				// 	.on("swiperight", function(){ s.prev() })

			}


		},

		go : function(e){

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

		
		},

		speedfixit : function(){

			if(control.speed != 0){
				control.speedfix= control.speed;
			}
			else{
				control.speedfix=0;
			}
			
		},

		destroy : function(){

			$canvas.off('mousemove.control');

			// off touch

		},

	}

	




	$(document).ready(function(){

		// preloader.init(); // if we write a preloader

		api.init();

		// menu.show_menu(); // PRODUCTION (normal functionality)

		menu.start_level('toronto') // DEVELOPMENT (shortcut to starting first level)

	})

// })(window);