// (function(){


// Kinetic ********************************************************

var KTC = function(){

	var stage,
		messageLayer,
		shapeLayer,
		rect;
}

KTC.prototype.init = function(){
	stage = new Kinetic.Stage({
		container: 'container',
		width: window.innerWidth,
		height: window.innerHeight
	})

	layer = new Kinetic.Layer();

	rect = new Kinetic.Rect({
		x: 239,
        y: 75,
        width: 100,
        height: 50,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
	})

	layer.add(rect);
	
	stage.add(layer);



	rect
		.on('mouseover',function(){
			rect.setFill('blue')
			layer.draw();
		})
		.on('mouseout',function(){
			rect.setFill('red')
			layer.draw();
		})
}




// Main ********************************************************

var Main = function(){

	var that = this;

	// $(window).load(function(){

	// })

	$(document).ready(function(){
		
		console.log('ready')

		ktc.init();

		// that.UI();

	})

	// global UI
	// this.UI = function(){
	// 	$(document).on('keydown',function(e){

	// 		switch(e.keyCode) {
	// 			case 32: // space
					
	// 				break;
	// 			// case :
					
	// 			// 	break;
	// 		}
	// 	})
	// }


}

var utils = new Utils();
var main = new Main();
var ktc = new KTC();

// })