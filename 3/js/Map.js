/*
 * Map构造函数
 */
function Map() {
    //Map内部计时器
	this.time = 0;
}

/*
 * 绘制地图的方法
 */
Map.prototype.drawMap = function(map) {

	this.time++;
    //遍历地图数组
	for(var i = 0; i < 12; i++) {
		for(var j = 0; j <= 15; j++) {
		    //根据地图数组绘制地图
			if(map[i][j] == STONE||map[i][j]==ENEMY_STONE) {
			mapCtx.drawImage(img, images['Stone'][0], images['Stone'][1], sourceW, sourceH, j * 50 , i * 50, realW, realH);
			}
			else if(map[i][j] == BUOY) {
			mapCtx.drawImage(img, images['Buoy'][0], images['Buoy'][1], sourceW, sourceH, j * 50 , i * 50, realW, realH);
			}
		}
	}
}

function redrawMap() {
	if(isRedrawingMap) {
			return;
		} else {
			isRedrawingMap = true;
			clear(mapCtx);
			mapObj.drawMap(map);
			isRedrawingMap = false;
		}
	
}

function DrawFire(){
	this.time=0;
}
var fireTime=30;
DrawFire.prototype.draw=function(map) {
	this.time++;

	for(var i = 0; i < 12; i++) {
		for(var j = 0; j <= 15; j++) {
			if(map[i][j] == FIREBALL) {
				if(this.time % fireTime < fireTime/3) {
					if(this.time%fireTime==0)
					{
						fireCtx.clearRect(j * 50 + 1, i * 50 + 1,50, 50);
					}
					fireCtx.drawImage(img, images['Fireballright'][0], images['Fireballright'][1], sourceW, sourceH, j * 50 + 1, i * 50 + 1, realW, realH);
				} else if(this.time % fireTime <= fireTime/3*2) {
						if(this.time%fireTime==fireTime/3)
					{
						fireCtx.clearRect(j * 50 + 1, i * 50 + 1,50, 50);
					}
					fireCtx.drawImage(img, images['Fireball'][0], images['Fireball'][1], sourceW, sourceH, j * 50 + 1, i * 50 + 1, realW, realH);
				} else if(this.time % fireTime > fireTime/3*2) {
						if(this.time%fireTime==fireTime/3*2+1)
					{
						fireCtx.clearRect(j * 50 + 1, i * 50 + 1,50, 50);
					}
					fireCtx.drawImage(img, images['Fireballleft'][0], images['Fireballleft'][1], sourceW, sourceH, j * 50 + 1, i * 50 + 1, realW, realH);
				}
				
			}
		}
	}
}

function redrawFire() {
	if(isRedrawingFire) {
		return;
	} else {
		isRedrawingFire = true;
		clear(fireCtx);
		drawFire.draw(map);
		isRedrawingFire = false;
	}
}