
// (function(window){


	/**************************************************************************
		
		Menu
		- controls which stage of the experience we are on: menu or level,
		  and which level
	
	**************************************************************************/
	
	var menu = {

		show_menu : function(){

			// show the menu and bind click event handlers

		},

		start_level : function(which_level){

			// hide the menu and unbind all its event handlers

			// show the canvas object and bind its event handlers
			control.init();
			// ground.init();

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

		data : {},

		init : function(){
			// load the data



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
		
		Paper: Master paperscript controller
		- holds the canvas object
		- any global paperjs config goes here

		update()
		- calls all the draw functions from different modules
		- runs the actual paperjs draw frame function

	
	**************************************************************************/
	
	var paper = {
		canvas : document.getElementById('paper'),
		
		init : function(){
			paper.setup(canvas);
		},

		update : function(){

			// particles.update();
			// ground.update();

			paper.view.draw();
		}

	}



	


	/**************************************************************************
		
		Paperscript Objects:
		> Ground
	
	**************************************************************************/
	

	var ground = {

		init : function(){

		},

		update : function(){

		}
	}






	/**************************************************************************
		
		Control (for the game)
		- input handlers -> speed variable
	
	**************************************************************************/

	var control = {

		speed : 0,

		init : function(){

			$(document).keydown(function(e){
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

		// Process the running action ********************************************************

		go : function(){

		}


	}





	$(document).ready(function(){

		// api.init();
		// // preloader.init(); // if we write a preloader


		// PRODUCTION

		menu.show_menu();

		// DEVELOPMENT

		menu.start_level('toronto')

	})

// })(window);