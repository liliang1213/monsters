function StoneFly(x, y, dir, pusher) {
	this.src = "Stone";
	this.width = 45;
	this.speed = 15;
	this.dir = dir;
	this.pusher = pusher;
	this.hitCount = 0;
	this.x = x;
	this.y = y;
}

StoneFly.prototype = new Sprite();

StoneFly.prototype.draw = function() {
	mapCtx.drawImage(img, images[this.src][0], images[this.src][1], sourceW, sourceH, this.x, this.y, realW, realH);
}

StoneFly.prototype.fly = function(dir) {

	switch(dir) {
		case "Up": {
			if(this.flyUp()) {
				this.dir = "Up";
				mapCtx.clearRect(this.x, this.y, realW, realH);
				this.y -= this.speed;
				return true;
			}
			break;
		}
		case "Down": {
			if(this.flyDown()) {
				this.dir = "Down";
				mapCtx.clearRect(this.x, this.y, realW, realH);
				this.y += this.speed;
				return true;
			}
			break;
		}
		case "Left": {
			if(this.flyLeft()) {
				this.dir = "Left";
				mapCtx.clearRect(this.x, this.y, realW, realH);
				this.x -= this.speed;
				return true;
			}
			break;
		}
		case "Right": {
			if(this.flyRight()) {
				this.dir = "Right";
				mapCtx.clearRect(this.x, this.y, realW, realH);
				this.x += this.speed;

				return true;
			}
			break;
		}
		default:
			break;
	}
	return false;
}
StoneFly.prototype.flyDown = function() {
	var row = parseInt((this.y + 10) / 50) + 1;
	var col = parseInt(this.x / 50);
	if(row >= 12) {
		row = 11;
		map[row][col] = STONE;
		this.destroy();
		return false;
	}
	if(this.y >= 550) {
		map[row-1][col] = STONE;
		this.destroy();
		return false;
	}
	if(checkForStone(row, col)) {
		return true;
	} else {
		map[row-1][col] = STONE;
		this.destroy();
	}
	return false;
}

StoneFly.prototype.flyUp = function() {
	var row = parseInt((this.y - 10) / 50);
	var col = parseInt(this.x / 50);
	if(beyondTopBound(this)) {
		row = 1;
		map[row][col] = STONE;
		this.destroy();
		return false;
	}
	if(checkForStone(row, col)) {
		return true;
	} else {
		map[row+1][col] = STONE;
		this.destroy();
	}
	return false;
}

StoneFly.prototype.flyLeft = function() {
	var row = parseInt(this.y / 50);
	var col = parseInt(this.x / 50);
	if(this.x <= 0) {
		col = 1;
		map[row][col - 1] = STONE;
		this.destroy();
		return false;
	}
	if(checkForStone(row, col)) {
		return true;
	} else {
		map[row][col + 1] = STONE;
		this.destroy();
	}
	return false;
}
StoneFly.prototype.flyRight = function() {
	var row = parseInt((this.y + 10) / 50);
	var col = parseInt(this.x / 50) + 1;
	if(this.y >= 750) {
		map[row][col + 1] = STONE;
		this.destroy();
		return false;
	}
	if(checkForStone(row, col)) {
		return true;
	} else {
		map[row][col - 1] = STONE;
		this.destroy();
	}
	return false;
}

StoneFly.prototype.destroy = function() {
	this.speed = 0;
	stoneflys.splice(stoneflys.indexOf(this), 1);
	for(var i in stonefly) {
		if(stonefly[i] && stonefly[i].speed == 0) {
			stonefly[i] = null;
			delete stonefly[i];
		}
	}
	redrawMap();
}

StoneFly.prototype.hitMyMan = function() {
	var hit = false;

	for(var i = 0; i < myman.length; i++) {
		if(this.hitTestObject(myman[i]) && myman[i].state != "God" && myman[i].action != "Die") {
			myman[i].die(myman[i]);
			myman[i].action = 'Die';
			hit = true;
		}
	}
	return hit;
}

StoneFly.prototype.hitEnemy = function() {
	var hit = false;
	for(var i = 0; i < enemies.length; i++) {
		if(this.hitTestObject(enemies[i])) {
			if(enemies[i].action = "Birth") {
					try{
				map[enemies[i].row][enemies[i].col] = NONE;
				}
				catch(e){console.log(enemies[i].row,enemies[i].col);
					console.log(enemies[i].x,enemies[i].y)}
				mapCtx.clearRect(enemies[i].col * 50, enemies[i].row * 50, realW, realH);
			}
			this.hitCount++;
		
			addEnemyDie(enemies[i].x, enemies[i].y, this.hitCount, this.pusher);
			destroyEnemy(enemies[i]);
			hit = true;
		}
	}
	return hit;
}
StoneFly.prototype.hitOtherUFO = function() {
	var hit = false;

	for(var i = 0, l = stoneflys.length; i < l; i++) {
		if(stoneflys[i] != this && this.hitTestObject(stoneflys[i])) {
			this.dir = reverse(this.dir);
			stoneflys[i].dir = reverse(stoneflys[i].dir);
			hit = true;
		}
	}

	for(var j = 0, l = fireflys.length; j < l; j++) {
		if(this.hitTestObject(fireflys[j])) {
			this.dir = reverse(this.dir);
			fireflys[j].dir = reverse(fireflys[j].dir);
			hit = true;
		}
	}
	for(var j = 0, l = buoyflys.length; j < l; j++) {
		if(this.hitTestObject(buoyflys[j])) {
			this.dir = reverse(this.dir);
			buoyflys[j].dir = reverse(buoyflys[j].dir);
			hit = true;
		}
	}

	return hit;
}
function reverse(dir) {
	if(dir == 'Up') {
		return 'Down';
	} else if(dir == 'Down') {
		return 'Up';
	} else if(dir == 'Left') {
		return 'Right';
	} else if(dir == 'Right') {
		return 'Left';
	}
}


function drawStoneFly() {
	for(var i = 0; i < stoneflys.length; i++) {
		stoneflys[i].draw();
	}
}

function updateStoneFly() {
	if(stoneflys.length <= 0) {
		return;
	} else if(stoneflys.length > 0) {
		for(var i = 0; i < stoneflys.length; i++) {
			stoneflys[i].fly(stoneflys[i].dir);
			if(stoneflys[i]) {
				stoneflys[i].draw();
				if(stoneflys[i].hitOtherUFO()) {
				}
				if(stoneflys[i].hitEnemy()) {
				}
				if(stoneflys[i].hitMyMan()) {

				}
			}
		}
	}
}

function drawBuoyFly() {
	for(var i = 0; i < buoyflys.length; i++) {
		buoyflys[i].draw();
	}
}

function BuoyFly(x, y, dir, pusher) {
	StoneFly.call(this, x, y, dir, pusher);
	this.src = 'Buoy';
	this.isChanged = false;
}

BuoyFly.prototype = new StoneFly();
BuoyFly.prototype.destroy = function() {
	buoyflys.splice(buoyflys.indexOf(this), 1);
	this.speed = 0;
	buoyflys.splice(buoyflys.indexOf(this), 1);
	for(var i in buoyfly) {
		if(buoyfly[i] && buoyfly[i].speed == 0) {
			buoyfly[i] = null;
			delete buoyfly[i];
		}
	}
	redrawMap();
}

BuoyFly.prototype.flyDown = function() {
	var row = parseInt(this.y / 50) + 1;
	var col = parseInt(this.x / 50);
	if(row >= 12) {
		if(this.isChanged == false) {

			this.dir = reverse(this.dir);
			this.isChanged = true;
		} else {
			row = 11;
			map[row][col] = BUOY;
			this.destroy();

		}
		return false;
	} else if(this.y >= 550) {
		if(this.isChanged == false) {
			this.dir = reverse(this.dir);
			this.isChanged = true;
			return false;
		} else {
			map[row-1][col] = BUOY;
			this.destroy();

			return false;
		}
	}
	if(checkForStone(row, col)) {
		return true;
	} else {
		if(this.isChanged == false) {
			this.dir = reverse(this.dir);
			this.isChanged = true;
		} else {
			map[row-1][col] = BUOY;
			this.destroy();

		}
	}
	return false;

}
BuoyFly.prototype.flyUp = function() {
	var row = parseInt((this.y - 10) / 50);
	var col = parseInt(this.x / 50);

	if(beyondTopBound(this)) {
		if(this.isChanged == false) {
			this.dir = reverse(this.dir);
			this.isChanged = true;
			return false;
		} else {
			row = 1;
			map[row][col] = BUOY;
			this.destroy();

			return false;
		}
	}
	if(checkForStone(row, col)) {
		return true;
	} else {
		if(this.isChanged == false) {
			this.dir = reverse(this.dir);
			this.isChanged = true;
		} else {
			map[row+1][col] = BUOY;
			this.destroy();

		}
	}
	return false;

}

BuoyFly.prototype.flyLeft = function() {
	var row = parseInt(this.y / 50);
	var col = parseInt(this.x / 50);

	if(this.x <= 0) {
		if(this.isChanged == false) {
			this.dir = reverse(this.dir);
			this.isChanged = true;
			return false;
		} else {
			col = 1;
			map[row][col - 1] = BUOY;
			this.destroy();

			return false;
		}
	}
	if(checkForStone(row, col)) {
		return true;
	} else {
		if(this.isChanged == false) {
			this.dir = reverse(this.dir);
			this.isChanged = true;
		} else {
			map[row][col + 1] = BUOY;
			this.destroy();

			return false;
		}
	}
}
BuoyFly.prototype.flyRight = function() {
	var row = parseInt((this.y + 10) / 50);
	var col = parseInt(this.x / 50) + 1;

	if(this.y >= 750) {
		if(this.isChanged == false) {
			this.dir = reverse(this.dir);
			this.isChanged = true;
			return false;
		} else {
			map[row][col + 1] = BUOY;
			this.destroy();

			return false;
		}
	}

	if(checkForStone(row, col)) {
		return true;
	} else {
		if(this.isChanged == false) {
			this.dir = reverse(this.dir);
			this.isChanged = true;
		} else {
			map[row][col - 1] = BUOY;
			this.destroy();

			return false;
		}
	}

}
function updateBuoyFly() {
	if(buoyflys.length <= 0) {
		return;
	}
	if(buoyflys.length > 0) {

		for(var i = 0; i < buoyflys.length; i++) {
			buoyflys[i].fly(buoyflys[i].dir);
			if(buoyflys[i]) {
				buoyflys[i].draw();
				if(buoyflys[i].hitOtherUFO()) {

				}
				if(buoyflys[i].hitEnemy()) {

				}
				if(buoyflys[i].hitMyMan()) {

				}
			}

		}
	}
}