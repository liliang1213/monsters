function MyManDie(obj) {
	this.obj=obj;
	this.time = 0;
}

var circleTime = 160;

MyManDie.prototype.draw = function(x, y) {
	if(this.time  == 0) {
		mandieCtx.clearRect(this.obj.x, this.obj.y, realW, realH);
		this.obj.action = "Die";
		mandieCtx.drawImage(this.obj.img, images[this.obj.name+'DownStand'][0], images[this.obj.name+'DownStand'][1], sourceW, sourceH, this.obj.x, this.obj.y, realW, realH);
	} else if(this.time  == 7) {
		mandieCtx.clearRect(this.obj.x, this.obj.y, realW, realH);
		mandieCtx.drawImage(this.obj.img, images[this.obj.name+'Left'][0], images[this.obj.name+'Left'][1], sourceW, sourceH, this.obj.x, this.obj.y, realW, realH);
	} else if(this.time  == 12) {
		mandieCtx.clearRect(this.obj.x, this.obj.y, realW, realH);
		mandieCtx.drawImage(this.obj.img, images[this.obj.name+'Right'][0], images[this.obj.name+'Right'][1], sourceW, sourceH, this.obj.x, this.obj.y, realW, realH);
	} else if(this.time  == 18) {
		mandieCtx.clearRect(this.obj.x, this.obj.y, realW, realH);
		mandieCtx.drawImage(this.obj.img, images[this.obj.name+'Fall'][0], images[this.obj.name+'Fall'][1], sourceW, sourceH, this.obj.x, this.obj.y, realW, realH);
	} else if(this.time  == 24) {
		mandieCtx.clearRect(this.obj.x, this.obj.y, realW, realH);
		mandieCtx.drawImage(this.obj.img, images[this.obj.name+'Lean'][0], images[this.obj.name+'Lean'][1], sourceW, sourceH, this.obj.x, this.obj.y, realW, realH);
	} else if(this.time  == 30) {
		mandieCtx.clearRect(this.obj.x, this.obj.y, realW, realH);
		mandieCtx.drawImage(this.obj.img, images[this.obj.name+'Down'][0], images[this.obj.name+'Down'][1], sourceW, sourceH, this.obj.x, this.obj.y, realW, realH);
	} else if((this.time == 48 ) || (this.time  == 72 ) || (this.time  == 96)) {
		mandieCtx.clearRect(this.obj.x, this.obj.y, realW, realH);
	
	} else if((this.time == 60 ) || (this.time  == 84) || (this.time== 108)) {
		mandieCtx.drawImage(this.obj.img, images[this.obj.name+'Down'][0], images[this.obj.name+'Down'][1], sourceW, sourceH, this.obj.x, this.obj.y, realW, realH);
		
	} else if(this.time == 159) {
		mandieCtx.clearRect(this.obj.x, this.obj.y, realW, realH);
	}
}



MyManDie.prototype.update = function() {
	this.time++;
}
MyManDie.prototype.destroy = function() {
	this.time=circleTime;
	mymandie.splice(mymandie.indexOf(this), 1);
	for(var i in myManDie) {
		if(myManDie[i] && myManDie[i].time == circleTime) {
			myManDie[i] = null;
			delete myManDie[i];
		}
	}
	
}



function updateMyManDie() {
	if(mymandie.length > 0) {
		for(var i = 0;i<  mymandie.length;i++) {
			mymandie[i].draw(mymandie[i].obj.x, mymandie[i].obj.y);
			mymandie[i].update();
			if(mymandie[i].time == 1) {
				mymandieSound.play();
			}
			if(mymandie[i].time >= circleTime) {
				
				if(players[mymandie[i].obj.name].life >= 0) {
					players[mymandie[i].obj.name].life--;
					rectPosition(mymandie[i].obj);
					mymandie[i].obj.action = "Push";
					mymandie[i].obj.dir = "Down";
					mymandie[i].obj.state = "God";
				} 
				 if(players[mymandie[i].obj.name].life < 0) {
				 	mymandie[i].obj.action = "Die";
						if(mymandie[i].obj.name=='player1')
						{
							player1Dead=true;
						}else if(mymandie[i].obj.name=='player2'){
							player2Dead=true;
						}
				}
				mymandie[i].destroy();
			}
		}
	}
}


