var stage,ball;
var bricks = [];
var started = false;
var _pad;
var paused = false;
var map1 = {scv:"1,1,1,1,1,1,1,"+
               "1,1,1,1,1,1,0,"+
			   "1,1,1,1,1,0,0,"+
			   "1,1,1,1,0,0,0,"+
			   "1,1,1,0,0,0,0,"+
			   "1,1,0,0,0,0,0," + 
			   "1,0,0,0,0,0,0",rows:6,cols:7,margin:3}

map2 = {scv:"1,1,1,0,1,1,1,0,1,1,1,"+
		   "1,0,0,0,1,0,0,0,1,0,0,"+
		   "1,0,0,0,1,0,0,0,1,1,1,"+
		   "1,0,0,0,1,0,0,0,0,0,1,"+
		   "1,1,1,0,1,1,1,0,1,1,1,"+
		   "0,0,0,0,0,0,0,0,0,0,0,"+
		   "0,0,0,0,1,1,1,0,0,0,0,"+
		   "0,0,0,0,0,0,1,0,0,0,0,"+
		   "0,0,0,0,1,1,1,0,0,0,0,"+
		   "0,0,0,0,0,0,1,0,0,0,0,"+
		   "0,0,0,0,1,1,1,0,0,0,0",cols:11,rows:11,margin:1}
            
var map = Math.random() > 0.5 ? map1 : map2
			
function init(){
stage = {el:document.querySelector(".stage")};
ball = {el:document.querySelector(".ball"),xOffset:180,yOffset:350,vx:0,vy:0,defaultvx:3};
	
stage.getAbsoluteCoords = function(){
return {x:this.el.offsetLeft,y:this.el.offsetTop}; 
}

stage.getSize = function(){
return {width:this.el.offsetWidth,height:this.el.offsetHeight}; 	
}	

ball.getAbsoluteCoords = function(){
return {x:this.el.offsetLeft + this.xOffset,y:this.el.offsetTop + this.yOffset}; 	
}

ball.launch = function(){
	ball.vx = 3;
	ball.vy = 4;
}

ball.getRelativeCoords = function(){
	var ballAbs = this.getAbsoluteCoords();
	var stageAbs = stage.getAbsoluteCoords();
	return {x:stageAbs.x-ballAbs.x,y:stageAbs.y-ballAbs.y};
}

stage["size"] = stage.getSize();
ball.r = ball.el.offsetWidth;	
}

class pad{
	
	createElement(){
		var el = document.createElement("div");
		el.className = "pad";
		stage.el.appendChild(el);
		this.el = el;
		this.el.style.width = this.width + "px";
		this.el.style.height = this.height + "px";
	}
	
	constructor(x,y,w,h){
		this.xOffset = x;
		this.yOffset = y;
		this.width = w;
		this.height = h;
		this.speed = 4;
		this.keys = {};
		this.createElement();	
	}
	
	registerKeyBoardListener(){
		document.addEventListener("keypress",this.onKeyPressed.bind(this));
		document.addEventListener("keyup",this.onKeyUp.bind(this));
	}
	
	
	unregisterEvent(){
		document.removeEventListener("keydown",this.onKeyPressed);
	}
	
	handleMove(){
		if(this.keys["a"]) this.xOffset -= this.speed;
		else if(this.keys["d"]) this.xOffset += this.speed;
		if(this.xOffset + this.width > stage.size.width){
			this.xOffset = stage.size.width - this.width - 1;
		}
		
		if(this.xOffset < 0){
			this.xOffset = 1;
		}
	}
	
	onKeyPressed(k){
		this.keys[k.key] = true;
	}
	
	onKeyUp(k){
		this.keys[k.key] = false;
	}
	
	getWidth(){
		return this.el.offsetWidth;
	}
	
	getHeight(){
		return this.el.offsetHeight;
	}

}

class brick{
	
	createElement(){
		var el = document.createElement("div");
		el.className = "brick";
		stage.el.appendChild(el);
		this.el = el;
		this.el.style.width = this.width + "px";
		this.el.style.height = this.height + "px";
		this.alive = true;
	}
	
	getWidth(){
		return this.el.offsetWidth;
	}
	
	getHeight(){
		return this.el.offsetHeight;
	}

	constructor(x,y,w,h){
		this.xOffset = x;
		this.yOffset = y;
		this.width = w;
		this.height = h;
		this.createElement();
	}
		
	destroy(){
		this.el.style.opacity = 0;
		this.el.addEventListener("transitionend",()=>{stage.el.removeChild(this.el)
		})
		this.alive = false;
	}	
	
}





document.body.onload = function(){
	init();
	
	var mp = new mapLoader(map);
	mp.load();
	
	var w = stage.size.width * 0.25;
	var h = w * 0.2;
	var margin = 2;
	_pad = new pad(stage.size.width/2 - w/2,stage.size.height - h - margin,w,h);
	_pad.registerKeyBoardListener();
	
	var onkeypr = function(){
		started = true;
		ball.launch();
		document.removeEventListener("keypress",onkeypr);
	}
	
	document.addEventListener("keypress",onkeypr);
	//stage.el.onclick = function(e){
    //if(!started)
	//	ball.launch();
	//started = true;
	//}
	
	animLoop();

}

class mapLoader{
	//map {scv:"",rows:,cols:}
	constructor(map){
		this.mapdata = map.scv.split(",");
		this.rows = map.rows;
		this.cols = map.cols;
		this.bw = stage.size.width/this.cols;
		this.bh = this.bw * 0.40;
		this.margin = map.margin;
	}
	
	load(){
		var x = 0;
		var y = 0;
		var margin = this.margin != undefined ? this.margin : 10;
		for(var i=0;i<this.mapdata.length;i++){
			if(i%this.cols == 0 && i != 0){
				x = 0;
				y += this.bh;
			}
			if(this.mapdata[i] === "1"){
				bricks.push(new brick(x,y,this.bw - margin,this.bh - margin));
			}
			x += this.bw;
		}
	}
}

function gameReset(){
	map = Math.random() > 0.5 ? map1 : map2;
	for(var i=0;i<bricks.length;i++){
		bricks[i].destroy();
	}
	init();
	bricks = [];
	var mp = new mapLoader(map);
	mp.load();
	
	var w = stage.size.width * 0.25;
	var h = w * 0.2;
	var margin = 2;
	_pad.xOffset = stage.size.width/2 - w/2;
	_pad.yOffset = stage.size.height - h - margin;
	started = false;
	paused = false;

	var onkeypr = function(){
		started = true;
		ball.launch();
		document.removeEventListener("keypress",onkeypr);
	}
	
	document.addEventListener("keypress",onkeypr);
	
}

function startMsg(){
	
}

function gameLoop(dt){
	
	if(!paused){
		
	_pad.handleMove();
	
	//handle hit test
	 if(ball.xOffset + ball.r >= _pad.xOffset && ball.xOffset < _pad.xOffset + _pad.getWidth() && ball.yOffset + ball.r 
		 > _pad.yOffset && ball.yOffset < _pad.yOffset + _pad.getHeight() && ball.vy > 0){
			 var dx = _pad.xOffset + _pad.getWidth()/2 - ball.xOffset; 
			 ball.vy *= -1;
			 if(ball.vx == 0)
				 ball.vx = ball.defaultvx;
			 var res = (ball.vx > 0) ? (dx < 0 ? 1 : -1) : (dx > 0 ? 1 : -1);
			 if(Math.abs(dx) < ((Math.random()*5) + 10)){
			if(Math.random() < 0.5)
			 ball.vx *= 0;
			 }else{
			 ball.vx *= res;
			 }
		 }
	
	
	//remove dead ones
	bricks = bricks.filter((e)=>{return e.alive})
	
	if(bricks.length == 0){
		paused = true;
		document.querySelector(".win-menu").className = "win-menu";
			document.querySelector(".btn-play-again").onclick =()=>{
				document.querySelector(".win-menu").className = "win-menu hide";	
				gameReset();
			}
		return;
	}
	
	for(var i=0;i<bricks.length;i++){
		var cb = bricks[i];
		if(cb.alive === false) continue;
	     if(ball.xOffset + ball.r >= cb.xOffset && ball.xOffset < cb.xOffset + cb.getWidth() && ball.yOffset + ball.r 
		 > cb.yOffset && ball.yOffset < cb.yOffset + cb.getHeight()){
			 var dx = cb.xOffset + cb.getWidth()/2 - ball.xOffset; 
			 ball.vy *= -1;
			 if(ball.vx == 0){
				 ball.vx = ball.defaultvx;
			 }
			 ball.vx *= dx > 0 ? 1 : -1;
			 cb.destroy();
			 break;
		 }
   }
	
	//update ball
	
	ball.xOffset += ball.vx;
	ball.yOffset += ball.vy;
	if(ball.xOffset  + ball.r > stage.size.width || ball.xOffset < 0){
		ball.vx *= -1;
		if(ball.vx < 0){
			ball.xOffset = stage.size.width - ball.r;
		}else{
			ball.xOffset = ball.r;
		}
	}
	if(ball.yOffset  + ball.r > stage.size.height || ball.yOffset < 0){
		ball.vy *= -1;
		if(ball.vy > 0){
			ball.yOffset = ball.r;
		} else{
			//dead ball
			paused = true;
			document.querySelector(".lose-menu").className = "lose-menu";
			document.querySelector(".btn-lose").onclick =()=>{
				document.querySelector(".lose-menu").className = "lose-menu hide";	
				gameReset();
			}
		}
	}
   //render
   ball.el.style.transform = "translateX("+ball.xOffset+"px"+") translateY("+ball.yOffset+"px"+")";

   for(var i=0;i<bricks.length;i++){
	     bricks[i].el.style.transform = "translateX("+bricks[i].xOffset+"px"+") translateY("+bricks[i].yOffset+"px"+")";
   }
   
   //render pad
   _pad.el.style.transform = "translateX("+_pad.xOffset+"px"+") translateY("+_pad.yOffset+"px"+")";

	}
}


function animLoop( render ) {
    lastFrame = +new Date;
	//	gameLoop();
    
    function loop( now ) {
        // stop the loop if render returned false
		
	    var deltaT = now - lastFrame;
		requestAnimationFrame( loop );
            // do not render frame when deltaT is too high
            if ( deltaT < 160 ) {
                gameLoop(deltaT);
            }
			
    }
    loop( lastFrame );
}

