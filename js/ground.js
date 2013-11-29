/**************************************************************************
	
	Paper: Ground

**************************************************************************/


var ground = {

	

	divisions : [],
	height : 0,
	amount : 5,
	groundpath : {},
	groundlevel: 0,
	zoom: 0,
	zoomY: 0,
	masterspawner: {},
	spawnclones: {},
	finish: undefined,
	frames: 200,
	spawnX: 0,
	spawnY: 0,
	point1: undefined,
	point2: undefined,
	point3: undefined,
	point4: undefined,
	point5: undefined,
	point6: undefined,
	point7: undefined,

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

		ground.height= randonum() * 10 + 50;
		ground.amount = 5;


		control.speed = 0;
		control.accelerating = false;
		control.distance = 0;

		ground.groundlevel= paper.view.size.height/3 * 2;

		
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

		// *******************************************************************************************

		ground.point1= [ground.groundpath.segments[0].point.x, ground.groundpath.segments[0].point.y];
		ground.point2= [ground.groundpath.segments[1].point.x, ground.groundpath.segments[1].point.y];
		ground.point3= [ground.groundpath.segments[2].point.x, ground.groundpath.segments[2].point.y];
		ground.point4= [ground.groundpath.segments[3].point.x, ground.groundpath.segments[3].point.y];
		ground.point5= [ground.groundpath.segments[4].point.x, ground.groundpath.segments[4].point.y];
		ground.point6= [ground.groundpath.segments[5].point.x, ground.groundpath.segments[5].point.y];
		ground.point7= [ground.groundpath.segments[6].point.x, ground.groundpath.segments[6].point.y];

		ground.masterspawner= new Path.Ellipse({
			point: [20, 20],
			size: [100, 100],
			fillColor: 'black'
		});

		// target to move to
		ground.finish = ground.groundpath.segments[6].point;
		
		// how many frame does it take to reach a target
		// var frames = 200;
		ground.current_frame = 0;
		ground.max_frames = 200

		
		// defined vars for onFrame
		ground.spawnX   = 0;
		ground.spawnY   = 0;
		
		// position circle on path
		ground.masterspawner.position.x = ground.finish.x;
		ground.masterspawner.position.y = ground.finish.y;

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
		// *******************************************************************************************

		// check if cricle reached its target
		if (Math.round(ground.masterspawner.position.x) == ground.finish[0] && Math.round(ground.masterspawner.position.y) == ground.finish[1]) 
		{
		    switch(ground.finish) {

		        case ground.point1:
		            ground.finish = ground.point2;
		            break;

		        case ground.point1.5:
		        case ground.point2:
		            ground.finish = ground.point3;
		            break;

		        case ground.point3:
		            ground.finish = ground.point4;
		            break;

		        case ground.point4:
		            ground.finish = ground.point5;
		            break;

		        case ground.point5:
		            ground.finish = ground.point6;
		            break;

		        case ground.point6:
		            ground.finish = ground.point7;
		            break;

		        case ground.point7:
		            ground.finish = ground.point1;
		            break;

		        default:

		        	break;
		    }
	
		}

		ground.current_frame += 1;
		if(ground.current_frame > ground.max_frames) ground.current_frame = 0;
		
		// calculate the dX and dY
		ground.spawnX = (ground.finish.x - ground.masterspawner.position.x) / ground.current_frame;
		ground.spawnY = (ground.finish.y - ground.masterspawner.position.y) / ground.current_frame;
	
		// do the movement
		ground.masterspawner.position.x += ground.spawnX;
		ground.masterspawner.position.y += ground.spawnY;

		console.log( ground.current_frame + ' ' + ground.max_frames )
		
		// *******************************************************************************************

		if(control.accelerating===true){
				control.spawnqeues= Math.round(control.distance/10);
				// console.log(control.spawnqeues);
				// console.log(api.data.toronto[control.spawnqeues]);
			}


		control.speedfixit();
		
		// console.log(control.speedfix);

		
		var setfallback= 100 - (control.distance/10);
		// ground.zoom=(100 - (control.speed * 20 ) );
		ground.zoom=(setfallback - ((control.speed/3)*10) );
		ground.zoomY=(control.distance);

			// ground.zoom1=(100-(control.distance * 0.1 ) );

			if( ground.zoom <= 40){
				ground.zoom=20;
				// return false;
			}

			// if( ground.zoomY >= 300 ){
			// 	ground.zoomY = 300;
			// 	// return false;
			// }

			// console.log('zoom=',ground.zoom,'zoomY=',ground.zoomY);

			if (ground.zoom> 40) {
				$('#background2,#background').css('background-size',''+ground.zoom+'% auto');
			};

			if (ground.zoomY<30) {
				$('#background').css('margin-top',''+ground.zoomY+'px');
				$('#background2').css('margin-top',''+ground.zoomY+'px');

			};
			
			// console.log(ground.zoomY);

		ground.accelerate();
		
		
		for (var i = 0; i <= ground.amount; i++) {
		
			var segment = ground.groundpath.segments[i];
			var sinus = Math.sin(control.distance + i) * (control.speed/10);
			control.distance += control.speed * 0.01;
			segment.point.y = sinus * ground.height + 400;
		
		}

		ground.groundpath.smooth();
	
	}

	
}
