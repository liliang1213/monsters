function EnemyDie(x, y, hitCount, pusher) {
	this.x = x;
	this.y = y;
	this.pusher=pusher;
	this.hitCount = hitCount;
	this.time = 0;
}

EnemyDie.prototype.draw = function(x, y) {

	if(this.time == 89) {
			mandieCtx.clearRect(this.x,this.y,realW,realH);
	}if(this.time==1){
		enemydieSound.play();
		chooseOneToBorn();
	}
	if(this.time  == 1&&(this.pusher=="player1"||this.pusher=="player2")) {
		players[this.pusher].score += this.hitCount * 250;
		
	}
	if(this.time == 3) {
		mandieCtx.clearRect(this.x,this.y,realW,realH);
		mandieCtx.drawImage(img, images['enemyBurst'][0], images['enemyBurst'][1], sourceW, sourceH, this.x, this.y, realW, realH);
	} else if(this.time % 90==4) {
		mandieCtx.clearRect(this.x,this.y,realW,realH);
		mandieCtx.drawImage(img, images['enemyShine'][0], images['enemyShine'][1], sourceW, sourceH, this.x, this.y, realW, realH);
		mandieCtx.clearRect(this.x,this.y,realW,realH);
	} else if(this.time % 90 ==11) {
		if(this.pusher=="player1"||this.pusher=="player2"){
		mandieCtx.clearRect(this.x,this.y,realW,realH);
		mandieCtx.shadowBlur = 2;
		mandieCtx.shadowColor = "rgba(225, 225, 225,3)";
		mandieCtx.font = "23px Comic Sans MS";
		mandieCtx.fillStyle = "#F74DF7";
		mandieCtx.fillText(this.hitCount * 250, this.x, this.y + 30);
		mandieCtx.shadowOffsetX = 0;
		mandieCtx.shadowOffsetY = 0;
		mandieCtx.shadowBlur = 0;
	}
	}
}

EnemyDie.prototype.destroy = function() {
	this.time = 90;
	enemiesdie.splice(enemiesdie.indexOf(this), 1);
	for(var i in enemydie) {
		if(enemydie[i] && enemydie[i].time == 90) {
			enemydie[i] = null;
			delete enemydie[i];
		}
	}
}

EnemyDie.prototype.update = function() {
	this.time++;
}
function updateEnemyDie() {
	if(enemiesdie.length > 0) {
		for(var i = 0; i < enemiesdie.length;i++) {
			enemiesdie[i].draw(enemiesdie[i].x, enemiesdie[i].y);
			enemiesdie[i].update();

			if(enemiesdie[i].time >= 90) {
				
				enemiesdie[i].destroy();

			}

		}
	}
}