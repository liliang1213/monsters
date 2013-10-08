function StoneBreak(x, y) {
	this.src = "Stonebreak";
	this.frame = 0;
	this.x = x;
	this.y = y;

}

StoneBreak.prototype.draw = function() {
	mapCtx.clearRect(this.x,this.y,realW,realH);
	mapCtx.drawImage(img, images[this.src][0], images[this.src][1], sourceW, sourceH, this.x, this.y, realW, realH);
}
StoneBreak.prototype.destroy = function() {
	this.frame = 3;
	stonebreaks.splice(stonebreaks.indexOf(this), 1);
	for(var i in stonebreak) {
		if(stonebreak[i] && stonebreak[i].frame >= 2) {
			stonebreak[i] = null;
			delete stonebreak[i];
		}
	}
	redrawMap();
}


StoneBreak.prototype.update = function() {
	this.frame++;
}
function drawStoneBreak() {
	for(var i = 0,l= stonebreaks.length; i<l;i++) {
		stonebreaks[i].draw();
	}
}

function updateStoneBreak() {
	if(stonebreaks.length<=0){
		return;
	}
	for(var i = 0;i<stonebreaks.length;i++) {
		if(stonebreaks[i].frame < 2) {
			stonebreaks[i].frame++;
			stonebreaks[i].draw();
		} else {
			redrawMap();
			stonebreaks[i].destroy();
			stonebreaks.shift(0);
			
		}
	}
};