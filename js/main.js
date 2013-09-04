
// (function(window){


	var api = {

		init : function(){
			console.log('weather api')
		}

	}



	



	var app = {
		init : function(){

			myCanvas.width = document.body.clientWidth; //document.width is obsolete
			myCanvas.height = document.body.clientHeight;
			
			var c=document.getElementById("myCanvas");
			var ctx=c.getContext("2d");
			
			function randonum(){
			    	return Math.floor((Math.random()*10)*(Math.random()*100)+100);
			    }
			
			var randomNUM= randonum();
			
			var randomHI= randonum();
			
			var finalpoint = randomNUM + xwee;
			
			var xwee=0;
			
			var items = [[xwee,400],[randomNUM,randomHI],[finalpoint,400]];
			console.log(items[0][1]); // 1
			
			console.log(randonum);
			
			
			
			
			function onFrame(event) {
				xwee+=5;
				randomNUM+=5;
			
				if(xwee>myCanvas.width+200) {
					xwee=0;
					randomHI= randonum();
					randomNUM= randonum();
				}
			
				myPath = new Path();
				myPath.strokeColor = 'black';
				myPath.add(new Point(-200, 400));
				myPath.add(new Point(xwee, items[0][1]), new Point( (randomNUM/2) + xwee, randomHI), new Point((randomNUM + xwee), items[2][1]));
				myPath.add(new Point(myCanvas.width+200, 400));
			
			    context.clearRect ( 0 , 0 , myCanvas.width , myCanvas.height );
			
				console.log(xwee , randomNUM , randomHI);
			
			}
			api.init();
		}
	}

	$(document).ready(function(){
		app.init();
	})



// })(window);