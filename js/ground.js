

var ground = {

	

	divisions : [],
	height : 0,
	amount : 5,
	groundpath : {},
	groundlevel: 0,
	masterspawner: {},
	spawnclones: {},
	finish: undefined,

	spawnX: 0,
	spawnY: 0,
	point1: undefined,
	point2: undefined,
	point3: undefined,
	point4: undefined,
	point5: undefined,
	point6: undefined,
	point7: undefined,

	current: undefined,
	scrollSpeed: undefined,
	direction: undefined,

	bgheight: 0,
	bgOldheight: 100,



	bgscroll: function(){
		switch(control.walkspeed){
			case 1:
				ground.current -= 0;
			break;
			case 2:
				ground.current -= 1;
			break;
			case 3:
				ground.current -= 2;
			break;
			case 4:
				ground.current -= 3;
			break;
			case 5:
				ground.current -= 4;
			break;
		};
		$('div.bg1').css("backgroundPosition", (ground.direction == 'h') ? ground.current+"px 0" : "0 " + ground.current+"px");

		$('div.bg2').css("backgroundPosition", (ground.direction == 'h') ? (ground.current*2)+"px 0" : "0 " + ground.current+"px");
			
		
	},

	raise: function(){
		

		if(control.accelerating===true){
			if(ground.bgheight<50){

				ground.bgheight+=.1;

				var bob=(ground.bgOldheight-ground.bgheight);

				$('div.bg1,div.bg2').css({
					'backgroundSize': ''+bob+'% auto'
				});
				// ground.height-=.1;
			}else {
							
				// ground.height+=.1;
			}
			
		}else{

			if(ground.bgheight>=0){
					ground.bgheight-=1;

					var bob=(ground.bgOldheight-ground.bgheight);

					$('div.bg1,div.bg2').css({
						'backgroundSize': ''+bob+'% auto'
					});
				}else{
					$('div.bg1,div.bg2').css({
						'backgroundSize': '100% auto'
					});
				}	
			// $('div.bg1,div.bg2').css({
			// 	'backgroundSize': '100% auto'
			// });
		}
	},

	init : function(){


		// speed in milliseconds
		ground.scrollSpeed = 50;
		
		// set the default position
		ground.current = 0;

		// set the direction
		ground.direction = 'h';


		//Calls the scrolling function repeatedly
		setInterval("ground.bgscroll()", ground.scrollSpeed);	



		var windowwidth= $(window).width();
	
		function dividewidth(){
			for (var i = 0; i <= 5; i++) {
				var x= i/5 * windowwidth;
				ground.divisions.push(x);
			}
	
		};

		// function randonum(){
		// 	return Math.floor((Math.random()*10));
		// };
	
		dividewidth();

		// ground.height= randonum() * 5 + 50;
		ground.height= [util.rand(5,40),util.rand(5,40),util.rand(5,40),util.rand(5,40),util.rand(5,40),util.rand(5,40),util.rand(5,40)];


		ground.amount = 5;


		control.speed = 0;
		control.accelerating = false;
		control.distance = 0;

		ground.groundlevel= (paper.view.size.height/10) * 8;

		
		ground.groundpath = new paper.Path({
			fillColor: [0.5],
		});


		ground.groundpath.add(new paper.Point(-100, ground.groundlevel));
		

		for (var i = 0; i <= ground.amount; i++) {
			var x= i/ground.amount * paper.view.size.width;

			ground.groundpath.add(new paper.Point(x, ground.groundlevel) );
		}

		ground.groundpath.add(new paper.Point((paper.view.size.width+100), ground.groundlevel ));
		ground.groundpath.add(new paper.Point((paper.view.size.width+100), paper.view.size.height));
		ground.groundpath.add(new paper.Point(-100, paper.view.size.height));

		ground.groundpath.selected=true;
		// unite(ground.groundpath);

		// *******************************************************************************************

		ground.point1= [ground.groundpath.segments[0].point.x, ground.groundpath.segments[0].point.y];
		ground.point2= [ground.groundpath.segments[1].point.x, ground.groundpath.segments[1].point.y];
		ground.point3= [ground.groundpath.segments[2].point.x, ground.groundpath.segments[2].point.y];
		ground.point4= [ground.groundpath.segments[3].point.x, ground.groundpath.segments[3].point.y];
		ground.point5= [ground.groundpath.segments[4].point.x, ground.groundpath.segments[4].point.y];
		ground.point6= [ground.groundpath.segments[5].point.x, ground.groundpath.segments[5].point.y];
		ground.point7= [ground.groundpath.segments[6].point.x, ground.groundpath.segments[6].point.y];


		// target to move to
		ground.finish = ground.groundpath.segments[7].point.x;
		
	
		
		// defined vars for onFrame
		ground.spawnX   = ground.groundpath.segments[1].point.x;
		ground.spawnY   = ground.groundpath.segments[1].point.y;

		ground.masterspawner= new Path.Ellipse({
			point: [ground.spawnX, ground.spawnY],
			size: [20, 20],
			fillColor: 'black'
		});


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


		ground.raise();



		ground.spawnY=ground.groundpath.segments[2].point.y;


		if(ground.spawnX<=ground.finish){
			ground.spawnX-=control.speed;
			if(ground.spawnX<=ground.groundpath.segments[1].point.x){
				ground.spawnX=ground.finish;
			}
		}
		

		var newpos=[ground.spawnX,ground.spawnY];

		ground.masterspawner.position=newpos;

		if(control.accelerating===true){
				control.spawnqeues= Math.round(control.distance/10);
				
			}
		

		ground.accelerate();
		
		
		for (var i = 0; i <= ground.amount+1; i++) {
		
			var segment = ground.groundpath.segments[i];
			// var sinus = Math.sin(control.distance + i) * (control.speed/10);
			var sinus = Math.sin(control.distance + i);
			control.distance += control.speed * 0.01;
			// ground.height= util.rand(25,35);
			segment.point.y = sinus * ground.height[i] + ground.groundlevel;
			if (segment.point.y < ground.groundlevel+.5 && segment.point.y < ground.groundlevel-.5){
				ground.height[i]=util.rand(5,40);
			}
		
		}

		ground.groundpath.smooth();
	
	}

	
}