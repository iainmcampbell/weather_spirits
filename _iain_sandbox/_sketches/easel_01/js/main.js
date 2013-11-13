// (function(){

var Util = function(){
	(function($,sr){

	  // debouncing function from John Hann
	  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	  var debounce = function (func, threshold, execAsap) {
	      var timeout;

	      return function debounced () {
	          var obj = this, args = arguments;
	          function delayed () {
	              if (!execAsap)
	                  func.apply(obj, args);
	              timeout = null;
	          };

	          if (timeout)
	              clearTimeout(timeout);
	          else if (execAsap)
	              func.apply(obj, args);

	          timeout = setTimeout(delayed, threshold || 100);
	      };
	  }
	  // smartresize 
	  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

	})(jQuery,'smartresize');

}


// Easel ********************************************************

function Easel(){
	var canvas,
		stage,
		circle,
		testAnim;

		g = new createjs.Graphics();
}

Easel.prototype.init = function(){

	canvas = document.getElementById('game');
	stage = new createjs.Stage("game");
	
	// circle
	g.beginFill('#ff0000');
	g.drawCircle(0,0,3);

	circle = new createjs.Shape(g);
	circle.x = 100;
	circle.y = 100;

	// stage.addChild(circle);
	// stage.update();


	// sprite
	var data = {
		images: ['img/testSprite.png'],
		frames: { width: 167, height: 167 },
		animations: {
			run: [0,23]
		}
	}

	var testSpriteSheet = new createjs.SpriteSheet(data);
	testAnim = new createjs.BitmapAnimation(testSpriteSheet);
	stage.addChild(testAnim);
	


	// mousemove
	stage.onMouseMove = function(e){
		testAnim.x = e.stageX - 84;
		testAnim.y = e.stageY - 150;
	}

	stage.onMouseDown = function(e){
		testAnim.play('run');
	}

	stage.onMouseUp = function(e){
		testAnim.gotoAndStop('run');
	}


	// utils
	$(window).smartresize(this.resize);
	this.resize();

	console.log('init')

    createjs.Ticker.setFPS(25);
	createjs.Ticker.addEventListener('tick',this.tick)

}

Easel.prototype.tick = function(event){

	if(!event.paused) {

		circle.x += 10;
        //Will cause the circle to wrap back
        if (circle.x > stage.canvas.width) { circle.x = 0; }
        stage.update();

	} 

	else {
		
	}

	
}

// Easel.prototype.moveCircle = function(){
// 	circle.x += 1;
// 	if(circle.x > stage.canvas.width) circle.x = 0;
// }

Easel.prototype.resize = function(){
	console.log('resize')
	stage.canvas.width = window.innerWidth;
	stage.canvas.height = window.innerHeight;
}





// Toggle play/paused ********************************************************
// with option to force
Easel.prototype.playPause = function(force){
	if(force === true) createjs.Ticker.setPaused(true);
	else if(force === false) createjs.Ticker.setPaused(false);
	else {
		if(createjs.Ticker.getPaused() === true) createjs.Ticker.setPaused(false);
		else if(createjs.Ticker.getPaused() === false) createjs.Ticker.setPaused(true);
	}
}





// Interaction ********************************************************

var UI = function(){




}

UI.prototype.init = function(){

	$(document).on('keydown',function(e){

		switch(e.keyCode) {
			case 32:
				easel.playPause();		
				break;
			// case :
				
			// 	break;
		}
	})

}



// Main ********************************************************

var Main = function(){

	$(window).load(function(){

	})

	

	$(document).ready(function(){
		
		console.log('ready')

		easel.init();
		ui.init();

		resize();

	})


	// Window Resize ********************************************************
	resize = function(){
		
	};

	


}

var util = new Util();
var main = new Main();
var easel = new Easel();
var ui = new UI();

// })