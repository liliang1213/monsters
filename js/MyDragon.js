function MyDragon(name, x, y, speed,img) {
	this.x = x;
	this.y = y;
	this.dir = "Down";
	this.name = name;
	this.img=img;
	this.width=45;
	this.speed = speed;
	this.action = "Walk";
	this.isPush = false;
	this.pushDelay = 20;
	this.imageX=10;
	this.time = 0;
	this.gameover=10;
	this.pushTime = 0;
	this.godCount=0;
	this.state="Normal";
}
var godTime=300;
var myManDie={};
MyDragon.prototype=new Sprite();

function drawMyDragon() {
	if(playerNum == 1) {
		player1.draw(player1.x, player1.y);
	}
	if(playerNum == 2) {
		player1.draw(player1.x, player1.y);
		player2.draw(player2.x, player2.y);
	}
}

/*
 * 绘制角色的方法
 */
MyDragon.prototype.draw = function(x, y) {
	this.drawScoreImage();
	//根据角色当前的状态绘制角色
	if(this.action == "Walk") {
		if(this.time % 30 < 10) {
			mainCtx.drawImage(this.img, images[this.name+this.dir+'Stand'][0], images[this.name+this.dir+'Stand'][1], sourceW, sourceH, x, y, realW, realH);
		} else if(this.time % 30 > 20) {
			mainCtx.drawImage(this.img, images[this.name+this.dir+'Walk'][0], images[this.name+this.dir+'Walk'][1], sourceW, sourceH, x, y, realW, realH);
		} else {
			mainCtx.drawImage(this.img, images[this.name+this.dir+'Step'][0], images[this.name+this.dir+'Step'][1], sourceW, sourceH, x, y, realW, realH);
		}
	} else if(this.action == "Push") {
		mainCtx.drawImage(this.img, images[this.name+this.dir+this.action][0], images[this.name+this.dir+this.action][1], sourceW, sourceH, x, y, realW, realH);
	} else if(this.action == "Die") {
	} 
	//如果角色当前状态为无敌状态，则设置角色所在canvas的alpha值，使之透明显示
	 if(this.state == "God") {
		setAlpha(mainCtx,this.x, this.y,realW, realH,25);
	}
};


MyDragon.prototype.drawScoreImage = function() {
	if(this.name=='player1')
	{
		this.imageX=10;
		this.gameover=10;
		this.scoreX=this.imageX+150;
	}
	else{
		this.gameover=620;
		this.imageX=700;
		this.scoreX=this.imageX-70;
	}
	if(players[this.name].life>= 0) {
		mainCtx.drawImage(this.img, images[this.name+'DownStand'][0], images[this.name+'DownStand'][1], sourceW, sourceH, this.imageX, 7, scoreImageW, scoreImageH);
		mainCtx.shadowColor = "rgba(0, 0, 0, 0.5)";

		mainCtx.font = "25px Arial Black";
		mainCtx.fillStyle = "#D6D7D6";
		mainCtx.fillText("×",  this.imageX+45, 35);
		mainCtx.font = "30px Comic Sans MS";
		mainCtx.fillStyle = "blue";
		mainCtx.fillText(players[this.name].life, this.imageX+69, 37);
		mainCtx.fillStyle = "#FFBA18";
		mainCtx.fillText(players[this.name].score, this.scoreX, 37);
	} else {
		mainCtx.fillStyle = "blue";
		mainCtx.fillText('G', this.gameover, 37);
		mainCtx.fillStyle = "#DE0000";
		mainCtx.fillText('A', this.gameover+15, 37);
		mainCtx.fillStyle = "#00AE00";
		mainCtx.fillText('M', this.gameover+35, 37);
		mainCtx.fillText('E', this.gameover+59, 37);
		mainCtx.fillStyle = "#DE0000";
		mainCtx.fillText('O', this.gameover+89, 37);
		mainCtx.fillStyle = "blue";
		mainCtx.fillText('V', this.gameover+108, 37);
		mainCtx.fillStyle = "#00AE00";
		mainCtx.fillText('E', this.gameover+125, 37);
		mainCtx.fillStyle = "blue";
		mainCtx.fillText('R', this.gameover+140, 37);
	}
};


MyDragon.prototype.update = function() {
	if(this.action == "Push") {
		this.pushTime++;
		this.speed = 0;
		if(this.pushTime > this.pushDelay) {
			this.speed = 7;
			this.pushTime = 0;
			this.action = "Walk";
		}
	}
	if(this.state == "God") {
		this.godCount++;
		if(this.godCount > godTime) {
			this.godCount = 0;
			this.state="Normal";
		}
	}
}

MyDragon.prototype.checkXRemain = function() {
	if(this.x % 50 <= 20) {
		this.x -= this.x % 50;

	} else if(this.x % 50 > 20) {
		this.x += (50 - this.x % 50);
	}
}
MyDragon.prototype.checkYRemain = function() {
	if(this.y % 50 <= 20) {
		this.y -= this.y % 50;

	} else if(this.y % 50 > 20) {
		this.y += (50 - this.y % 50);
	}
}

/*
 * 移动角色的方法
 */
MyDragon.prototype.move = function(dir) {
    if(this.action=="Die"){
        return;
    }
    //根据角色当前的运动方向计算X、Y的剩余值
	if(dir==Up||dir==Down){
		this.checkXRemain();
	}
	else{
	    this.checkYRemain();
	};
	//根据角色当前的方向来判断角色应该变换x值还是y值
	switch(dir) {
		case Up: {
			this.dir = "Up";
			//判断角色上方是否有障碍物
			if(this.moveUp()) {
				this.y -= this.speed;
				this.time++;
				return true;
			}
			break;
		}
		case Down: {
			this.dir = "Down";
			if(this.moveDown()) {
				this.y += this.speed;
				this.time++;
				return true;
			}
			break;
		}
		case Left: {
			this.dir = "Left";
			if(this.moveLeft()) {
				this.x -= this.speed;
				this.time++;
				return true;
			}
			break;
		}
		case Right: {
			this.dir = "Right";
			if(this.moveRight()) {
				this.x += this.speed;
				this.time++;
				return true;
			}
			break;
		}
		default:
			break;
	}
	return false;
};

/*
 * 判断角色上方是否有障碍物的方法
 */
MyDragon.prototype.moveUp = function() {
    //获取角色当前所在位置坐标
	var row = parseInt((this.y-3) / 50);
	var col = parseInt(this.x / 50);
	//如果角色当前已经运动到界面的最顶端，则返回false，不能继续向上运动
	if(beyondTopBound(this))
	{
		return false;
	}
	//如果角色上方没有障碍物，则返回true，不能继续向上运动
	if(!check(row, col)) {
		return true;
	}
	return false;
}
MyDragon.prototype.moveDown = function() {
	var row = parseInt((this.y+3) / 50) + 1;
	var col = parseInt(this.x / 50);
	if(this.y+3 >= 550) {
		return false;
	}
	if(!check(row, col)) {
		return true;
	}
	return false;
}
MyDragon.prototype.moveLeft = function() {
	var row = parseInt(this.y / 50);
	var col = parseInt((this.x-3) / 50);
	if(this.x <= 0) {
		return false;
	}
	if(!check(row, col)) {
		return true;
	}
	return false;

}
MyDragon.prototype.moveRight = function() {
	var row = parseInt(this.y / 50);
	var col = parseInt((this.x+3) / 50) + 1;
	if(this.x > 750) {
		return false;
	}
	if(!check(row, col)) {
		return true;
	}
	return false;

}

MyDragon.prototype.push = function(dir) {
	
	if(this.action == "Die") {
		return;
	}
	if(this.isPush) {
		return;
	} else {
		this.isPush = true;
		this.action = "Push";
		switch(dir) {
			case "Up": {
				if(this.hasStoneUp(dir)) {
					this.time++;
					return true;
				}
				break;
			}
			case "Down": {
				this.dir = "Down";
				if(this.hasStoneDown(dir)) {
					this.time++;
					return true;
				}
				break;
			}
			case "Left": {
				this.dir = "Left";
				if(this.hasStoneLeft(dir)) {
					this.time++;
					return true;
				}
				break;
			}
			case "Right": {
				this.dir = "Right";
				if(this.hasStoneRight(dir)) {
					this.time++;
					return true;
				}
				break;
			}
			default:
				break;
		}
	}
	return false;
	}

MyDragon.prototype.hasStoneUp = function(dir) {
	var row = parseInt((this.y-3) / 50);
	var col = parseInt(this.x / 50);
	if(this.y < 0) {
		return false;
	}

	if(checkObstacle(row, col) == STONE) {
		map[row][col] = NONE;
		if(row == 1 || checkObstacle(row - 1, col)) {
			
			addStoneBreak(col, row);
		} else {
			
			addStoneFly(col, row, dir,this.name);
		}
		return true;
	}
	else if(checkObstacle(row, col) == BUOY) {
		map[row][col] = NONE;
		if(row == 1 || checkObstacle(row - 1, col)) {
			addStoneBreak(col, row);
		} else {
			addBuoyFly(col, row, dir,this.name);
		}
		
		return true;
	} 
	else if(checkObstacle(row, col) == FIREBALL) {
			map[row][col] = NONE;
		if(row == 1 || checkObstacle(row - 1, col)) {
			addFireBreak(col, row,0,this.name);
		} else {
			
			addFireFly(col, row, dir,this.name);
		}
		
		return true;
	}else if(checkObstacle(row, col) == ENEMY_STONE)
	{
		addStoneBreak(col, row);
		killEnemyInBorn(col,row,this.name);
		return true;
	}
	 else {
		pushSound.play();
	}
	return false;
}
MyDragon.prototype.hasStoneDown = function(dir) {
	var row = parseInt((this.y+3) / 50) + 1;
	var col = parseInt(this.x / 50);
	if(this.y > 560) {
	
		return false;
	}
	if(checkObstacle(row, col) == STONE) {
		map[row][col] = NONE;
		if(row == 11 || checkObstacle(row + 1, col)) {
			
			addStoneBreak(col, row);
		} else {
			addStoneFly(col, row, dir,this.name);
		}
		
		return true;
	}	else if(checkObstacle(row, col) == BUOY) {
			map[row][col] = NONE;
		if(row == 11 || checkObstacle(row + 1, col)) {
			addStoneBreak(col, row);
		} else {
			addBuoyFly(col, row, dir,this.name);
		}
	
		return true;
	} 
	 else if(checkObstacle(row, col) == FIREBALL) {
	 		map[row][col] = NONE;
		if(row == 11 || checkObstacle(row + 1, col)) {
			addFireBreak(col, row,0,this.name);
		} else {
			addFireFly(col, row, dir,this.name);
		}
		return true;
	} else if(checkObstacle(row, col)==ENEMY_STONE)
	{	map[row][col] = NONE;
		addStoneBreak(col, row);
		killEnemyInBorn(col,row,this.name);
		return true;
	}else {
			pushSound.play();
	}
	return false;
}

MyDragon.prototype.hasStoneLeft = function(dir) {
	var row = parseInt(this.y / 50);
	var col = parseInt((this.x-3) / 50);
	if(this.x < 0) {
		return false;
	}
	if(checkObstacle(row, col) == STONE) {
		map[row][col] = NONE;
		if(col == 0 || checkObstacle(row, col - 1)) {
			addStoneBreak(col, row);
		} else {
			addStoneFly(col, row, dir,this.name);
		}
		return true;
	}	else if(checkObstacle(row, col) == BUOY) {
		map[row][col] = NONE;
		if(col == 0 || checkObstacle(row , col-1)) {
			addStoneBreak(col, row);
		} else {
			addBuoyFly(col, row, dir,this.name);
		}
		return true;
	}  else if(checkObstacle(row, col) == FIREBALL) {
		map[row][col] = NONE;
		if(col == 0 || checkObstacle(row, col - 1)) {
			addFireBreak(col, row,0,this.name);
		} else {
			addFireFly(col, row, dir,this.name);
		}
		return true;
	}else if(checkObstacle(row, col) == ENEMY_STONE)
	{
		map[row][col] = NONE;
		addStoneBreak(col, row);
		killEnemyInBorn(col,row,this.name);
		return true;
	} else {
			pushSound.play();
	}
	return false;
}

MyDragon.prototype.hasStoneRight = function(dir) {
	var row = parseInt(this.y / 50);
	var col = parseInt((this.x+3) / 50) + 1;

	if(this.x > 760) {
		return false;
	}
	if(checkObstacle(row, col) == STONE) {
		map[row][col] = NONE;
		if(col == 15 || checkObstacle(row, col + 1)) {
			addStoneBreak(col, row);
		} else {
			addStoneFly(col, row, dir,this.name);
		}
		
		return true;
	}	else if(checkObstacle(row, col) == BUOY) {
		map[row][col] = NONE;
		if(row == 15 || checkObstacle(row, col+1)) {
			addStoneBreak(col, row);
		} else {
			addBuoyFly(col, row, dir,this.name);
		}
		return true;
	}  else if(checkObstacle(row, col) == FIREBALL) {
		map[row][col] = NONE;
		if(col == 15 || checkObstacle(row, col + 1)) {
			addFireBreak(col, row,0,this.name);
		} else {
			addFireFly(col, row, dir,this.name);
		}
		return true;
	}else if(checkObstacle(row, col) == ENEMY_STONE)
	{
		map[row][col] = NONE;
		addStoneBreak(col, row);
		killEnemyInBorn(col,row,this.name);
		return true;
	} else {
	pushSound.play();	}
	return false;
};

function updateMyDragon() {
	for(var j = 0;j< myman.length; j++) {
		myman[j].update(); 
	}
}

MyDragon.prototype.destroy = function() {
	if(this.name == 'player1') {
		player1 = null;
	} else {
		player2 = null;
	}
};

MyDragon.prototype.die = function(obj) {
	var i = 0;
	while(myManDie[i]) {
		i++;
	}
	myManDie[i] = new MyManDie(obj);
	if(!mymandie[myManDie[i]]) {
		mymandie.push(myManDie[i]);
	}
};
function redrawMyDragon(){
	clear(mainCtx);
	updateMyDragon();
	drawMyDragon();
}

function redrawMyDragonOnCondition() {
	for(var i = 0;i<  myman.length; i++) {
		if(myman[i].action == 'Push'||myman[i].action=='Die'||myman[i].state=='God') {
			redrawMyDragon();
		}
	}
}
