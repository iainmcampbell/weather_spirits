
	// /**************************************************************************
		
	// 	Paper: Particles
	
	// **************************************************************************/
	
	// var particles = {

	// 	p : [], // the particle array
	// 	t : [], // the tails array

	// 	numParticles : 50,

	// 	rowLength : 10,
	// 	numRows : null,

	// 	mx : null,
	// 	my : null,

	// 	init : function(){

	// 		console.log(paper.view)

	// 		var h = paper.view.size.height,
	// 			w = paper.view.size.width,
	// 			rows = 0,
	// 			rowCounter = 0;

	// 		particles.numRows = Math.ceil(particles.numParticles/particles.rowLength);

	// 		for (var i = 0; i < particles.numParticles; i++) {
	// 			particles.p[i] = new paper.Path.Circle([0,0], 10);
	// 			particles.p[i].fillColor = 'black';				
	// 		};

	// 		particles.resize();

	// 	},


	// 	update : function(){

	// 		// Very simple proximity detection

	// 		var r = paper.view.size.width/15,
	// 			mx = particles.mx,
	// 			my = particles.my;

	// 		for (var i = particles.p.length-1; i>=0; i--) {
	// 			var px = particles.p[i].position.x,
	// 				py = particles.p[i].position.y;

	// 			// if within range (+/-r)
	// 			if(mx < px+r && mx > px-r  &&  my < py+r && my > py-r) {
	// 				particles.p[i].fillColor = 'red';
	// 			} else {
	// 				particles.p[i].fillColor = 'black';
	// 			}
	// 		};

	// 	},


	// 	resize : function(){

	// 		var h = paper.view.size.height,
	// 			w = paper.view.size.width,
	// 			rows = 0,
	// 			rowCounter = 0,
	// 			xSpacing = w/particles.rowLength,
	// 			ySpacing = h/particles.numRows;

	// 		for (var i = 0; i < particles.numParticles; i++) {

	// 			var x = ((rowCounter*xSpacing) * 0.8) + (w*0.1); // (position * overall_width) + left
	// 			var y = ((rows*ySpacing ) * 0.8) + (h*0.1);      // (position * overall_height) + top

	// 			particles.p[i].position = [x,y];

	// 			rowCounter++;
	// 			if(rowCounter > particles.rowLength) {
	// 				rows++;
	// 				rowCounter = 0;
	// 			}
	// 		};

	// 	},



	// }
