function FireBreak(x, y, hitCount, pusher) {
	FireFly.call(this, x, y);
	this.width = 50;
	this.src = "FireBreak";
	this.sourceH = 129;
	this.pusher = pusher;
	this.hitCount = hitCount;
	this.sourceW = 132;
	this.frame = 0;
}


FireBreak.prototype = new Sprite();
FireBreak.prototype = new FireFly();
var fireCicleTime = 30;
FireBreak.prototype.draw = function() {
	if(this.frame % fireCicleTime < 8 && this.frame % fireCicleTime >= 0) {
		if(this.frame == 0) {
			redrawMap();
			mapCtx.drawImage(img, images["Firebreak1"][0], images["Firebreak1"][1], sourceW, sourceH, this.x, this.y, this.width, this.width);
		}
	} else if(this.frame % fireCicleTime >= 8 && this.frame % fireCicleTime < 12) {
		if(this.frame == 8) {
			redrawMap();
			mapCtx.drawImage(img, images["Firebreak2"][0], images["Firebreak2"][1], sourceW, sourceH, this.x, this.y, this.width, this.width);
		}
	} else if(this.frame % fireCicleTime == 12) {
		this.hasFireAround();
		this.width = 130;
		this.x -= 50;
		this.y -= 50;
		redrawMap();
		mapCtx.drawImage(img, images["Firebreak3"][0], images["Firebreak3"][1], this.sourceW, this.sourceH, this.x, this.y, this.width, this.width);
	} else if(this.frame % fireCicleTime > 12 && this.frame % fireCicleTime < 20) {

	} else if(this.frame % fireCicleTime >= 20 && this.frame % fireCicleTime <= 30) {
		if(this.frame == 20) {
			redrawMap();
			mapCtx.drawImage(img, images["Firebreak4"][0], images["Firebreak4"][1], this.sourceW, this.sourceH, this.x, this.y, this.width, this.width);
		}

	}
}

FireBreak.prototype.update = function() {
	this.frame++;
}

FireBreak.prototype.hasFireAround = function() {
	var row = parseInt((this.y + 10) / 50);
	var col = parseInt((this.x + 10) / 50);
	for(var i = row - 1; i <= row + 1; i++) {
		for(var j = col - 1; j <= col + 1; j++) {

			if(j == col && i == row) {
			} else if(checkObstacle(i, j) == FIREBALL) {
				addFireBreak(j, i, this.hitCount, this.pusher);
				map[i][j] = NONE;
			}
		}
	}
}

FireBreak.prototype.destroy = function() {
	this.frame = fireCicleTime - 1;
	firebreaks.splice(firebreaks.indexOf(this), 1);
	for(var i in firebreak) {
		if(firebreak[i] && firebreak[i].frame == fireCicleTime - 1) {
			firebreak[i] = null;
			delete firebreak[i];
		}
	}
	redrawMap();
}
function updateFireBreak() {
	if(firebreaks.length <= 0) {
		return;
	}
	for(var i = 0;i<firebreaks.length;i++) {
		if(firebreaks[i].frame == 1) {
			firebreakSound.play();
		}
		if(firebreaks[i].frame < fireCicleTime - 1) {
			firebreaks[i].update();
			firebreaks[i].draw();
			if(firebreaks[i].hitEnemy()) {
			}
			if(firebreaks[i].hitMyMan()) {
			}
		} else {
			firebreaks[i].destroy();
			firebreaks.shift(0);
		}
	}
};