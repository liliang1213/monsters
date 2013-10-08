function FireFly(x, y, dir,pusher) {
	StoneFly.call(this, x, y, dir,pusher)
	this.src = "Fireball";
	this.width = 45;
	this.hitCount=0;
	this.speed = 15;
}

FireFly.prototype = new Sprite();
FireFly.prototype = new StoneFly();

FireFly.prototype.flyDown = function() {
	var row = parseInt((this.y + 10) / 50) + 1;
	var col = parseInt(this.x / 50);
	if(row >= 12) {
		row = 11;
			this.turnTofireBurst(this.x,this.y,this.hitCount,this.pusher);
		return false;
	}
	if(this.y >= 550) {

		this.turnTofireBurst(this.x,this.y,this.hitCount,this.pusher);
		return false;
	}

	if(!check(row, col)) {
		return true;
	} else {
			this.turnTofireBurst(this.x,this.y,this.hitCount,this.pusher);
	}
	return false;

}
FireFly.prototype.flyUp = function() {
	var row = parseInt((this.y - 10) / 50);
	var col = parseInt(this.x / 50);

	if(beyondTopBound(this)) {
		row = 1;
		this.turnTofireBurst(this.x,this.y,this.hitCount,this.pusher);
		return false;
	}
	if(!check(row, col)) {
		return true;
	} else {
			this.turnTofireBurst(this.x,this.y,this.hitCount,this.pusher);
	}
	return false;
}

FireFly.prototype.flyLeft = function() {
	var row = parseInt(this.y / 50);
	var col = parseInt(this.x / 50);
	if(this.x <= 0) {
		col = 1;
			this.turnTofireBurst(this.x,this.y,this.hitCount,this.pusher);
		return false;
	}
	if(!check(row, col)) {
		return true;
	} else {
			this.turnTofireBurst(this.x,this.y,this.hitCount,this.pusher);
	}
	return false;

}
FireFly.prototype.flyRight = function() {
	var row = parseInt((this.y + 10) / 50);
	var col = parseInt(this.x / 50) + 1;
	if(this.y >= 750) {
			this.turnTofireBurst(this.x,this.y,this.hitCount,this.pusher);
		return false;
	}
	if(!check(row, col)) {
		return true;
	} else {
		this.turnTofireBurst(this.x,this.y,this.hitCount,this.pusher);
	}
	return false;

}

FireFly.prototype.destroy=function(){
	this.speed = 0;
			fireflys.splice(fireflys.indexOf(this),1);
			for(var i in firefly) {
			if(firefly[i] && firefly[i].speed == 0) {
			firefly[i] = null;
			delete firefly[i];
		}
	}
	redrawMap();
}

FireFly.prototype.turnTofireBurst=function(x,y,hitCount,pusher){
		var fireBreak=new FireBreak(x,y,hitCount,pusher);
		this.destroy();
		firebreaks.push(fireBreak);
}

function drawFireFly() {
	for(var i = 0;i<fireflys.length;i++) {
		fireflys[i].draw();
	}
}

function updateFireFly() {
	if(fireflys.length <= 0) {
		return;
	} else if(fireflys.length > 0) {
		for(var i = 0;i< fireflys.length; i++) {
			fireflys[i].fly(fireflys[i].dir);
			if(fireflys[i]) {
				fireflys[i].draw();
				if(fireflys[i].hitOtherUFO()) {
				}
				if(fireflys[i].hitEnemy()) {
				}
				if(fireflys[i].hitMyMan()) {
				}
			}
		}
	}
}
