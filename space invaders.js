var canvas;
var ctx;
var fps = 30;
var numStars = 100;
var lost = false;
var startgame = false;
var won = false;  
var imgP = document.getElementById("imgP");
var stars = [];
var player1 = [];
var playerW = playerH = 60;
var shots = [];
var lastpressed = 0;
var numEnemy = 9;
var invader = [];
var invaderX = invaderY = 80;
var eshots = [];
//var imgEE = new Image();
//imgEE.src = "invader.png";
var ss=0;
var rr=0;
var reSS = false;
var reRR = false;
var HP = 100;
var HPrect = 200;
var soundM = new Audio();
var soundShot = new Audio();
var soundWin = new Audio();
var soundLose = new Audio();

window.onload = function(){
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = 800;
	canvas.height = 600;
	setInterval(draw,1000/fps);
	canvas.addEventListener("mousedown",clickStart);
	document.addEventListener("keydown",keyPP);
	document.addEventListener("keyup",keyupp);
}

function keyupp(e){
	if(startgame){
		if(e.keyCode != 32){
		player1.setD(0);
		}
	}
}

function keyPP(e){
	if(startgame){
		var now = new Date();
		if(e.keyCode == 32 && now - lastpressed > 300){
			var shot = new Shots(player1.pX+17,player1.pY);
			shots.push(shot);
			lastpressed = now;
			soundShot.src = "sounds/shot.mp3";
			soundShot.volume = 0.3;
			soundShot.play();
		}
		if(e.keyCode == 37){
			player1.setD(-1);
		}
		if(e.keyCode == 39){
			player1.setD(1);
		}
	}
}

function draw(){
	mainF();
	
}

function clickStart(e){
	if(startgame){
		return;
	}
	numEnemy = 9;
	numStars = 100;
	stars = [];
	for(var i=0;i<numStars;i++){
		stars[i] = new Stars();
	}
	player1 = new Player();
	startgame = true;
	lost = false;
	won = false;
	shots = [];
	invader = [];
	for(var a=0;a<numEnemy;a++){
		invader[a] = new Enemy(a*invaderX,invaderY,50,50);
	//	invader[a].imgEE.src = "invader.png";
	}
//	imgEE = new Image();
//	imgEE.src = "invader.png";
	eshots = [];
	ss = Math.floor(Math.random()*9);
	rr = Math.floor(Math.random()*9);
	reSS = false;
	reRR = false;
	HP = 100;
	HPrect = 200;
	soundLose.src = "sounds/lose.mp3";
	soundWin.src = "sounds/win.mp3";
		soundM.src = "sounds/music2.mp3";
		soundM.volume = 0.15;
		soundM.play();
}
//MAIN
function mainF(){
	drawRect(0,0,canvas.width,canvas.height,"black");
	ctx.fillStyle = "white";
	ctx.font = "20px Ariel";
	ctx.fillText("CLICK TO START",300,300);
	if(startgame){
		drawRect(0,0,canvas.width,canvas.height,"black");
		for(var i=0;i<stars.length;i++){
			stars[i].drawStars();
		}
		player1.showP();
		player1.move();
		for(var j=0;j<shots.length;j++){
			shots[j].show();
			shots[j].shoot();
			for(var b=0;b<invader.length;b++){
		//if invader is dead dont check to del the projectile or the invader
				if(!invader[b].killed){
				if(shots[j].hits(invader[b])){
					shots[j].del();
					invader[b].imgEE.src = "hurt.png";
					invader[b].hitsToSurvive++;
					//hits required to destroy the invader
					if(invader[b].hitsToSurvive == 2){	
					invader[b].ded();
					numEnemy--;
					//del the shot and the invader 
						}
					}
				}
			}
		}
		//remove shot if toDel is true
		for(var f=shots.length-1;f>=0;f--){
			if(shots[f].toDel){
				shots.splice(f,1);
			}
		}
		var edge = false;
		for(var a=0;a<invader.length;a++){
			if(!invader[a].killed){
		invader[a].show();
		invader[a].move();
			}
		if(invader[a].eX > canvas.width-invader[a].eW || invader[a].eX < 0){
			edge = true;
			}
		}
		if(edge){
		for(var c=0;c<invader.length;c++){
				invader[c].turn();
			}
		}
		
	//random spawns x2 drawn
		for(var u=0;u<invader.length;u++){
				var eshot = new EnemyShots(invader[u].eX+20,invaderY+(invader[u].eY/2));
				eshots.push(eshot);
				//FIX STARTING POINT GREEN LASER SHOTS
				if(ss < eshots.length 
				&& eshots[ss].esY >= canvas.height 
				|| reSS){
					reSS=false;
					ss = Math.floor(Math.random()*invader.length);
					if(!invader[ss].killed && ss != rr){
						eshots[ss].esY = invaderY+(invader[ss].eY/2);
						eshots[ss].esX = invader[ss].eX+20;
					}
				}	
				if(rr < eshots.length 
				&& eshots[rr].esY >= canvas.height 
				|| reRR){
					reRR=false;
					rr = Math.floor(Math.random()*invader.length);
					if(!invader[rr].killed && rr != ss){
						eshots[rr].esY = invaderY+(invader[rr].eY/2);
						eshots[rr].esX = invader[rr].eX+20;	
					}
					
				}
		}
		if(eshots[ss].ehits(player1)){
			player1.hitsToDie++;
			HP-=20;
			HPrect-=40;
			reSS=true;
		}
		if(eshots[rr].ehits(player1)){
			player1.hitsToDie++;
			HP-=20;
			HPrect-=40;
			reRR=true;
		}
		
		eshots[ss].eshow();
		eshots[ss].eshoot(10);
		
		eshots[rr].eshow();
		eshots[rr].eshoot(8);
	
		if(player1.hitsToDie >= 5){
			lost = true;
			startgame = false
		}
		if(numEnemy == 0){
			won = true;
			startgame=false;
		}
		//HP PLAYER.
		ctx.fillStyle = "red";
		ctx.fillText("Player HP "+HP+"%",canvas.width-170,17);
		drawRect(canvas.width-230,20,HPrect,20,"red");
	}
	
	if(won){
		soundM.pause();
		soundM.currentTime = 0;
		if(!soundWin.ended){
			soundWin.volume = 0.5;
			soundWin.play();
		}
			drawRect(0,0,canvas.width,canvas.height,'black');
			ctx.fillStyle = 'white';
			ctx.font = '20px Arial';
			ctx.fillText('YOU WON WOW',300,200);
			ctx.fillText('click to start again',300,250)
	}
	
	if(lost){
		soundM.pause();
		soundM.currentTime = 0;
		if(!soundLose.ended){
			soundLose.volume = 0.4;
			soundLose.play();
		}
			drawRect(0,0,canvas.width,canvas.height,'black');
			ctx.fillStyle = 'white';
			ctx.font = '20px Arial';
			ctx.fillText('GAME OVER',300,200);
			ctx.fillText('click to start again',280,250)
	}
}


function Stars(){
	this.x = Math.floor(Math.random()*canvas.width);
	this.y = Math.floor(Math.random()*canvas.height);
	this.radius = Math.floor(Math.random()*3);
	this.v = 10;
	this.drawStars = function(){
		this.y+=this.v;
		if(this.y >= canvas.height){
			this.y = 0;
		}
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
		ctx.fill();
	};
}

function drawRect(x,y,w,h,color){
	ctx.fillStyle = color;
	ctx.fillRect(x,y,w,h);
}

function Shots(sX,sY){
	this.sX = sX;
	this.sY = sY;
	this.sW = 8;
	this.sH = 13;
	this.toDel = false;
	//sets to del so i can remove shots later
	this.del = function(){
		this.toDel = true;
	};
	this.show = function(){
		ctx.fillStyle = "red";
		ctx.fillRect(this.sX,this.sY,this.sW,this.sH);
	};
	this.shoot = function(){
		this.sY-=8;
	};
	this.hits = function(Enemy){
		if(this.sX+this.sW >= Enemy.eX 
		&& this.sX <= Enemy.eX+Enemy.eW-5
		&& this.sY <= Enemy.eY+45 
		&& this.sY >= invaderY){
		return true;
		} else return false;
	};
}

function Player(){
	this.pX = canvas.width/2-40;
	this.pY = canvas.height*0.9;
	this.pV = 10;
	this.xdir = 0;
	this.hitsToDie = 0;
	this.showP = function(){
		drawChar(this.pX,this.pY,playerW,playerH);
	};
	this.setD = function(dd){
		this.xdir = dd;
	};
	this.move = function(){
		this.pX += this.xdir*this.pV;
		if(this.pX >= canvas.width-55){
			this.pX = canvas.width-55;
		}
		if(this.pX <= 10){
			this.pX = 10;
		}
	};
}

function drawChar(x,y,w,h){
	imgP.style.position = "absolute";
	imgP.style.left = x;
	imgP.style.top = y;
	imgP.width = w;
	imgP.height = h;
	imgP.src = "ship.png";
}

function Enemy(x,y){
	this.imgEE = new Image();
	this.imgEE.src = "invader.png";
	this.eX = x;
	this.eY = y;
	this.eW = 50;
	this.eH = 50;
	this.dirX = 1;
	this.hitsToSurvive = 0;
	this.killed = false;
	this.ded = function(){
		this.killed = true;
	};
	this.show = function(){
		ctx.drawImage(this.imgEE,this.eX,this.eY,this.eW,this.eH);
	};
	this.move = function(){
		this.eX+=this.dirX;
	};
	this.turn = function(){
		this.dirX *= -1;
	};
}

function EnemyShots(esX,esY){
	this.esX = esX;
	this.esY = esY;
	this.esW = 8;
	this.esH = 13;
	this.toDel = false;
	//sets to del so i can remove shots later
	this.edel = function(){
		this.toDel = true;
	};
	this.eshow = function(){
		ctx.fillStyle = "#21FF21";
		ctx.fillRect(this.esX,this.esY,this.esW,this.esH);
	};
	this.eshoot = function(spd){
		this.esY+=spd;
	};
	this.ehits = function(Player){
		if(this.esX+this.esW >= Player.pX 
		&& this.esX <= Player.pX+playerW-5
		&& this.esY >= Player.pY-20 
		&& this.esY <= Player.pY){
		return true;
		} else return false;
	};
	
}