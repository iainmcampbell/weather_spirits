Boids = function (canvasid) {
    this.canvas = document.getElementById(canvasid);
    this.context = this.canvas.getContext("2d");
    
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.fps = 25;
    
    this.speed = 20;
    
    this.autoPxPerBoid = 40;
    
    this.debug = false;
    this.showPoi = true;
    this.showFps = false;
    this.autoFps = true;
    
    this.timeout = null;
    this.fpsAutoAdjTimeout = null;
    
    this.boids = [];
    this.poi = [];
    
    this.startTime = null;
    this.lastCalc = new Date().getTime();

    this.factor_scale = 1; 
    this.factor_separation = 2; // 0.1 - 10 approx
    this.factor_alignment = 1;
    this.factor_cohesion = 1;
    this.factor_poi = 10; // 1-100 approx
    
    this.resize();
};

Boids.prototype.autoAdjustFps = function (stage) {
    if (!this.autoFps) {
        window.clearTimeout(this.fpsAutoAdjTimeout);
        this.fpsAutoAdjTimeout = null;
        return;
    }
    if (this.fpsAutoAdjTimeout && !stage) {
        window.clearTimeout(this.fpsAutoAdjTimeout);
    }
    if (!stage) {
        this.fps = 1000;
        this.resetFps();
        this.fpsAutoAdjTimeout = window.setTimeout(function (thisObj) {
            thisObj.autoAdjustFps(1)}, 1000*2, this);
    } else if (stage == 1) {
        this.resetFps();
        this.fpsAutoAdjTimeout = window.setTimeout(function (thisObj) {
            thisObj.autoAdjustFps(2)}, 1000*3, this);
    } else {
        this.fpsAutoAdjTimeout = null;
        var fps_dur = (new Date().getTime() - this.startTime) / 1000;
        var fps = Math.min(Math.floor(this.ticks / fps_dur / 4), 25);
        if (fps < 1) {
            this.stop();
            // alert("Sorry, your system is waaaay to slow for this.");
            return;
        } else {
            this.fps = fps;
            this.resetFps();
        }
    }
};

Boids.prototype.resetFps = function () {
    this.startTime = new Date().getTime();
    this.ticks = 0;
};

Boids.prototype.resize = function (width, height) {
    // if (width)  this.canvas.width  = width;
    // if (height) this.canvas.height = height;
    
    // this.autoPxPerBoid && this.numBoids(Math.floor(Math.sqrt(
    //         this.canvas.width*this.canvas.height /
    //         Math.pow(this.autoPxPerBoid, 2))));
    
    // for (var i in this.poi) {
    //     this.poi[i].x = 800 //normWhatever(this.canvas.width,  this.poi[i].x);
    //     this.poi[i].y = 400 //normWhatever(this.canvas.height, this.poi[i].y);
    // }

    this.autoAdjustFps();
};

Boids.prototype.addBoids = function (num) {
    for (var i = 0 ; i < num ; i++) {
        this.boids.push(this.genBoid(
                Math.random()*this.canvas.width,
                Math.random()*this.canvas.height,
                Math.random()*Math.PI*2));
    }
};

Boids.prototype.numBoids = function (num) {
    while (this.boids.length < num) this.addBoids(1);
    while (this.boids.length > num) this.removeBoids(1);
};

Boids.prototype.numPoi = function (num) {
    while (this.poi.length < num) this.addPoi(1);
    while (this.poi.length > num) this.removePoi(1);
};

Boids.prototype.addPoi = function (num) {
    for (var i = 0 ; i < num ; i++) {
        this.poi.push({
                'x':Math.random()*this.canvas.width,
                'y':Math.random()*this.canvas.height
            });
    }
};

Boids.prototype.addPoiAtPoint = function (_x,_y) {
    this.poi.push({ 'x': _x, 'y': _y });
};

Boids.prototype.removeBoids = function (num) {
    this.boids.splice(0,num);
};

Boids.prototype.removePoi = function (num) {
    this.poi.splice(0,num);
};




// Calculate ********************************************************

Boids.prototype.calc = function () {
    var lastDur = (new Date().getTime() - this.lastCalc) / 1000;
    this.lastCalc = new Date().getTime();
    
    var factor_separation = this.factor_separation; // 0.1 - 10 approx
    var factor_alignment  = this.factor_alignment;
    var factor_cohesion   = this.factor_cohesion;
    var factor_poi        = this.factor_poi; // 1-100 approx
    
    var max_turn = 3 * lastDur;
    var max_diff = 1 * lastDur;
    
    var speed = (this.speed * lastDur);

    var newBoids = [];
    
    for (var i in this.boids) {
        
        var avg_sum = 0.00001;
        var avg_separation = 0;
        var avg_alignment = 0;
        
        var avg_distanceSum = 0;
        var avg_distanceX = 0;
        var avg_distanceY = 0;
        
        var avg_poiSum = 0.00001;
        var avg_poiX = 0;
        var avg_poiY = 0;
        
        for (var j in this.poi) {
            var distanceX = this.getDistX(this.boids[i].x, this.poi[j].x);
            if (distanceX == 0) distanceX = 0.001;
            var distanceY = this.getDistY(this.boids[i].y, this.poi[j].y);
            if (distanceY == 0) distanceY = 0.001;
            
            var distance = Math.sqrt(
                    Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
            
            var score = Math.pow(100 / distance, 1);
            
            avg_poiSum += score;
            avg_poiX += score * distanceX;
            avg_poiY += score * distanceY;
        }
        
        for (var j in this.boids) {
            if (j==i) continue;
            
            var distanceX = this.getDistX(this.boids[i].x, this.boids[j].x);
            if (distanceX == 0) distanceX = 0.001;
            var distanceY = this.getDistY(this.boids[i].y, this.boids[j].y);
            if (distanceY == 0) distanceY = 0.001;
            
            var distance = Math.sqrt(
                    Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
            var angle = XYtoAngle(distanceX, distanceY);
            //console.log(angle);
            
            var score = Math.pow(100 / distance, 4); // "localness"
            var distScore = Math.min(200 / distance, 4); // "localness"
            
            
            avg_sum += score;
            avg_distanceSum += distScore;
            
            // separation
            avg_separation += score * diffAngle(this.boids[i].d, normAngle(angle + Math.PI));

            // alignment
            avg_alignment += score * diffAngle(this.boids[i].d, this.boids[j].d);
            
            // cohesion
            avg_distanceX += distScore * distanceX;
            avg_distanceY += distScore * distanceY;
        }
        
        // average avg's
        avg_separation = avg_separation / avg_sum;
        avg_alignment = avg_alignment / avg_sum;
        
        avg_distanceX /= avg_distanceSum;
        avg_distanceY /= avg_distanceSum;
        
        avg_poiX /= avg_poiSum;
        avg_poiY /= avg_poiSum;
        
        var cohesion = diffAngle(this.boids[i].d,
                XYtoAngle(avg_distanceX, avg_distanceY));

        if (avg_distanceSum == 0)
            cohesion = 0;
        
        var poidowant = diffAngle(this.boids[i].d,
                XYtoAngle(avg_poiX, avg_poiY));
        
        // debug
        
        // this.context.fillStyle = "rgba(0,0,255,0.7)";
        // this.debug && drawDot(this.context,
        //         this.boids[i].x + avg_distanceX,
        //         this.boids[i].y + avg_distanceY, 5);
        
        
        // this.context.strokeStyle = "rgba(0,255,0,0.9)";
        // this.context.lineWidth = 2;
        // this.debug && drawVector(this.context, this.boids[i].x,
        //         this.boids[i].y, 30, this.boids[i].d + avg_separation);
        
        // this.context.strokeStyle = "rgba(255,0,0,0.9)";
        // this.context.lineWidth = 2;
        // this.debug && drawVector(this.context, this.boids[i].x,
        //         this.boids[i].y, 30, this.boids[i].d + avg_alignment);
        
        // this.context.strokeStyle = "rgba(0,0,255,0.9)";
        // this.context.lineWidth = 2;
        // this.debug && drawVector(this.context, this.boids[i].x,
        //         this.boids[i].y, 30, this.boids[i].d + cohesion);
        
        // this.context.strokeStyle = "rgba(255,255,0,0.9)";
        // this.context.lineWidth = 2;
        // this.debug && drawVector(this.context, this.boids[i].x,
        //         this.boids[i].y, 30, this.boids[i].d + poidowant);
        
        //break;
        
        var turn = (
                factor_separation * avg_separation +
                factor_alignment * avg_alignment +
                factor_cohesion * cohesion + 
                factor_poi * poidowant) /
                (factor_separation + factor_alignment + factor_cohesion + 
                factor_poi);
        
        this.context.strokeStyle = "rgba(255,255,255,0.8)";
        this.context.lineWidth = 2;
        this.debug && drawVector(this.context, this.boids[i].x,
                this.boids[i].y, 40, normAngle(this.boids[i].d+turn));

        turn = Math.max(Math.min(turn,max_turn),-max_turn);
        turn = Math.max(Math.min(turn, this.boids[i].ot+max_diff),
                                       this.boids[i].ot-max_diff);
        
        var totalAngle = normAngle(this.boids[i].d + turn);
        
        newBoids.push(this.genBoid(
            this.boids[i].x + Math.cos(totalAngle)*speed,
            this.boids[i].y + Math.sin(totalAngle)*speed,
            totalAngle,
            turn));
        
    }
    
    this.boids = newBoids;

};

Boids.prototype.genBoid = function (x,y,d,ot) {
    
    return {
            'x':normWhatever(this.canvas.width, x),
            'y':normWhatever(this.canvas.height, y),
            'd':d,
            'ot':ot || 0
        };
};

Boids.prototype.getDistX = function (a, b) {
    foo = b - a;
    bar = b + this.canvas.width - a;
    baz = b - this.canvas.width - a;
    return Math.abs(foo) < Math.abs(bar) ?
            (Math.abs(foo) < Math.abs(baz) ? foo : baz) : bar;
};

Boids.prototype.getDistY = function (a, b) {
    foo = b - a;
    bar = b + this.canvas.height - a;
    baz = b - this.canvas.height - a;
    return Math.abs(foo) < Math.abs(bar) ?
            (Math.abs(foo) < Math.abs(baz) ? foo : baz) : bar;
};

Boids.prototype.draw = function () {

    this.context.fillStyle = "rgba(0,0,0,0)";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.save();
    
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    var imageObj = new Image();
    imageObj.src = "images/pruitt-igoe/smoke_white.png";

    this.context.fillStyle = 'rgba(255,255,255,0.5)'
    var scale = this.factor_scale;

    for (var i in this.boids) {

        this.context.drawImage(imageObj, this.boids[i].x-(scale*128), this.boids[i].y-(scale*128), 256*scale, 256*scale)

        // // Arc for debugging
        // this.context.beginPath()
        // this.context.arc(this.boids[i].x,this.boids[i].y, 3, 0, 2 * Math.PI, false)
        // this.context.fill()
        // this.context.closePath()
    }

    
    if (this.debug || this.showPoi) {
        this.context.fillStyle = "rgba(255,0,255,0.8)";
        for (var i in this.poi) {
            drawDot(this.context, this.poi[i].x, this.poi[i].y, 20);
        }
    }
    
    // if (this.debug || this.showFps) {
    //     var fps_dur = (new Date().getTime() - this.startTime) / 1000;
    //     var fps = String(this.ticks / fps_dur).substr(0,5);
    //     while (fps.length < 4) fps += " ";
        
    //     this.context.fillStyle = "rgba(255,255,255," + 
    //             (this.fpsAutoAdjTimeout ? 0.5 :
    //             Math.max(0.5, Math.min(1, fps_dur / 4))) + ")";
    //     this.context.font = "bold 14px monospace";
    //     this.context.textAlign = "end";
    //     this.context.textBaseline = "top";
    //     this.context.fillText("FPS: " + fps, this.canvas.width -15,8);
    //     this.fpsAutoAdjTimeout && this.context.fillText(
    //         "(auto-adjusting...)", this.canvas.width -15,23);
    // }

    this.context.restore();
};

Boids.prototype.run = function () {
    this.draw();
    this.calc();
    //this.draw();
    
    this.ticks += 1;
    
    this.timeout = window.setTimeout(function (thisObj) {
        thisObj.run(); }, 1000/this.fps, this);
};

Boids.prototype.stop = function () {
    window.clearTimeout(this.timeout);
    this.timeout = null;
};


function drawDot (context, x,y, r) {
    context.beginPath();
    context.arc(x,y, r, 0,Math.PI*2, false);
    context.fill();
};

function drawVector (context, x,y, r, d) {
    context.beginPath();
    context.moveTo(x,y);
    context.lineTo(x+Math.cos(d)*r, y+Math.sin(d)*r);
    context.stroke();
};

function XYtoAngle (distanceX, distanceY) {
    return Math.atan(distanceY/(distanceX != 0 ? distanceX : 0.00001)) +
                        (distanceX < 0 ? Math.PI :
                            (distanceY < 0 ? Math.PI*2 : 0));
};

function normAngle (angle) {
    while (angle < 0) angle += Math.PI*2;
    while (angle > Math.PI*2) angle -= Math.PI*2;
    return angle;
};

function normWhatever (foo, bar) {
    while (bar < 0) bar += foo;
    while (bar > foo) bar -= foo;
    return bar;
};

function diffAngle (a, b) {
    foo = b - a;
    return foo <= Math.PI && foo > -Math.PI ? foo : foo - Math.PI*2;
};