let canvas;
let ctx;
let fps = 45;
let numStars;
let shootDelayMs = 300;
let lost;
let startGame;
let won;
let imgP = document.getElementById("imgP");
let stars;
let player1;
let playerW = playerH = 60;
let shots;
let lastPressed = 0;
let numEnemy;
let invader;
let invaderX = invaderY = 80;
let eShots1;
let enemyShot1;
let enemyShotLanded1;
let soundM = new Audio();
let soundShot = new Audio();
let soundWin = new Audio();
let soundLose = new Audio();

window.onload = function () {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	canvas.width = 800;
	canvas.height = 600;
	setInterval(draw, 1000 / fps);
	canvas.addEventListener("mousedown", clickStart);
	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);
}

function onKeyUp(e) {
	if (startGame) {
		if (e.keyCode != 32) {
			player1.setD(0);
		}
	}
}

function onKeyDown(e) {
	if (startGame) {
		const now = new Date();
		if (e.keyCode == 32 && now - lastPressed > shootDelayMs) {
			const shot = new Shots(player1.pX + 17, player1.pY);
			shots.push(shot);
			lastPressed = now;
			soundShot.src = "sounds/shot.mp3";
			soundShot.volume = 0.3;
			soundShot.play();
		}
		if (e.keyCode == 37) {
			player1.setD(-1);
		}
		if (e.keyCode == 39) {
			player1.setD(1);
		}
	}
}

function draw() {
	mainF();
}

function clickStart(e) {
	if (startGame) {
		return;
	}
	numEnemy = 9;
	numStars = 80;
	stars = [];
	for (let i = 0; i < numStars; i++) {
		stars[i] = new Stars();
	}
	player1 = new Player();
	startGame = true;
	lost = false;
	won = false;
	shots = [];
	invader = [];
	for (let a = 0; a < numEnemy; a++) {
		invader[a] = new Enemy(a * invaderX, invaderY, 50, 50);
	}
	eShots1 = [];
	enemyShot1 = Math.floor(Math.random() * numEnemy);
	enemyShotLanded1 = false;
	soundLose.src = "sounds/lose.mp3";
	soundWin.src = "sounds/win.mp3";
	soundM.src = "sounds/music2.mp3";
	soundM.volume = 0.15;
	soundM.play();
}

function mainF() {
	drawRect(0, 0, canvas.width, canvas.height, "black");
	ctx.fillStyle = "white";
	ctx.font = "20px Ariel";
	ctx.fillText("CLICK TO START", 300, 300);
	if (startGame) {
		drawRect(0, 0, canvas.width, canvas.height, "black");
		for (let i = 0; i < stars.length; i++) {
			stars[i].drawStars();
		}
		player1.showPlayer();
		player1.move();
		for (let j = 0; j < shots.length; j++) {
			shots[j].show();
			shots[j].shoot();
			for (let b = 0; b < invader.length; b++) {
				if (!invader[b].killed && shots[j].hits(invader[b])) {
					shots[j].del();
					invader[b].imgEE.src = "hurt.png";
					invader[b].hitsToSurvive++;
					if (invader[b].hitsToSurvive == 2) {
						invader[b].ded();
						numEnemy--;
					}
				}
			}
		}

		for (let f = shots.length - 1; f >= 0; f--) {
			if (shots[f].toDel) {
				shots.splice(f, 1);
			}
		}

		let edge = false;
		for (let a = 0; a < invader.length; a++) {
			if (!invader[a].killed) {
				invader[a].show();
				invader[a].move();
			}
			if (invader[a].eX > canvas.width - invader[a].eW || invader[a].eX < 0) {
				edge = true;
			}
		}

		if (edge) {
			for (let c = 0; c < invader.length; c++) {
				invader[c].turn();
			}
		}

		if (eShots1.length < invader.length) {
			let eShot1 = new EnemyShots(invader[enemyShot1].eX + 20, invaderY + (invader[enemyShot1].eY / 2));
			eShots1.push(eShot1);
		}

		if (eShots1[enemyShot1]) {
			eShots1[enemyShot1].eShow();
			eShots1[enemyShot1].eShoot(12);
			if (eShots1[enemyShot1].eHits(player1)) {
				player1.gotHit(20, 40);
				enemyShotLanded1 = true;
			}
			if (eShots1[enemyShot1].esY >= canvas.height || enemyShotLanded1) {
				enemyShotLanded1 = false;
				enemyShot1 = Math.floor(Math.random() * invader.length);
				if (!invader[enemyShot1].killed) {
					eShots1[enemyShot1].esY = invaderY + (invader[enemyShot1].eY / 2);
					eShots1[enemyShot1].esX = invader[enemyShot1].eX + 20;
				}
			}
		}

		if (player1.HP <= 0) {
			lost = true;
			startGame = false
		}
		if (numEnemy == 0) {
			won = true;
			startGame = false;
		}

		ctx.fillStyle = "red";
		ctx.fillText("Player HP " + player1.HP + "%", canvas.width - 170, 17);
		drawRect(canvas.width - 230, 20, player1.HPrect, 20, "red");
	}

	if (won) {
		soundM.pause();
		soundM.currentTime = 0;
		if (!soundWin.ended) {
			soundWin.volume = 0.5;
			soundWin.play();
		}
		drawRect(0, 0, canvas.width, canvas.height, 'black');
		ctx.fillStyle = 'white';
		ctx.font = '20px Arial';
		ctx.fillText('YOU WON WOW', 300, 200);
		ctx.fillText('click to start again', 300, 250);
	}

	if (lost) {
		soundM.pause();
		soundM.currentTime = 0;
		if (!soundLose.ended) {
			soundLose.volume = 0.4;
			soundLose.play();
		}
		drawRect(0, 0, canvas.width, canvas.height, 'black');
		ctx.fillStyle = 'white';
		ctx.font = '20px Arial';
		ctx.fillText('GAME OVER', 300, 200);
		ctx.fillText('click to start again', 280, 250)
	}
}

function Stars() {
	this.x = Math.floor(Math.random() * canvas.width);
	this.y = Math.floor(Math.random() * canvas.height);
	this.radius = Math.floor(Math.random() * 3);
	this.v = 10;
	this.drawStars = function () {
		this.y += this.v;
		if (this.y >= canvas.height) {
			this.y = 0;
		}
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.fill();
	};
}

function drawRect(x, y, w, h, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

function Shots(sX, sY) {
	this.sX = sX;
	this.sY = sY;
	this.sW = 8;
	this.sH = 13;
	this.toDel = false;
	this.del = function () {
		this.toDel = true;
	};
	this.show = function () {
		ctx.fillStyle = "red";
		ctx.fillRect(this.sX, this.sY, this.sW, this.sH);
	};
	this.shoot = function () {
		this.sY -= 10;
	};
	this.hits = function (Enemy) {
		if (this.sX + this.sW >= Enemy.eX
			&& this.sX <= Enemy.eX + Enemy.eW - 5
			&& this.sY <= Enemy.eY + 45
			&& this.sY >= invaderY) {
			return true;
		} else return false;
	};
}

function Player() {
	this.HP = 100;
	this.HPrect = 200;
	this.pX = canvas.width / 2 - 40;
	this.pY = canvas.height * 0.9;
	this.pV = 10;
	this.xdir = 0;
	this.showPlayer = function () {
		drawChar(this.pX, this.pY, playerW, playerH);
	};
	this.setD = function (dd) {
		this.xdir = dd;
	};
	this.move = function () {
		this.pX += this.xdir * this.pV;
		if (this.pX >= canvas.width - 55) {
			this.pX = canvas.width - 55;
		}
		if (this.pX <= 10) {
			this.pX = 10;
		}
	};
	this.gotHit = function (dmg, percentDmg) {
		this.HP -= dmg;
		this.HPrect -= percentDmg;
	}
}

function drawChar(x, y, w, h) {
	imgP.style.position = "absolute";
	imgP.style.left = x;
	imgP.style.top = y;
	imgP.width = w;
	imgP.height = h;
	imgP.src = "ship.png";
}

function Enemy(x, y) {
	this.imgEE = new Image();
	this.imgEE.src = "invader.png";
	this.eX = x;
	this.eY = y;
	this.eW = 50;
	this.eH = 50;
	this.dirX = 2;
	this.hitsToSurvive = 0;
	this.killed = false;
	this.ded = function () {
		this.killed = true;
	};
	this.show = function () {
		ctx.drawImage(this.imgEE, this.eX, this.eY, this.eW, this.eH);
	};
	this.move = function () {
		this.eX += this.dirX;
	};
	this.turn = function () {
		this.dirX *= -1;
	};
}

function EnemyShots(esX, esY) {
	this.esX = esX;
	this.esY = esY;
	this.esW = 8;
	this.esH = 13;
	this.eShow = function () {
		ctx.fillStyle = "#21FF21";
		ctx.fillRect(this.esX, this.esY, this.esW, this.esH);
	};
	this.eShoot = function (spd) {
		this.esY += spd;
	};
	this.eHits = function (Player) {
		if (this.esX + this.esW >= Player.pX
			&& this.esX <= Player.pX + playerW - 5
			&& this.esY >= Player.pY - 20
			&& this.esY <= Player.pY) {
			return true;
		} else return false;
	};
}
