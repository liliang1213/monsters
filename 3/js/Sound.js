function Sound(src) {
    this.src = src;
    this.audio = new Audio();
    this.audio.src = this.src;
}

Sound.prototype.load = function() {
    this.audio.load();
}
Sound.prototype.play = function() {
    this.audio.currentTime = 0;
    this.audio.play();
}
function SoundControl() {
    return function() {
        //off
         //on
        var that = {
            'gameOverEnded' : function() {
                resetGame();
                mainCtx.shadowOffsetX = 0;
                mainCtx.shadowOffsetY = 0;
                mainCtx.shadowBlur = 0;
                Game.dimStage(function() {
                    lastState = RESTART;
                    Game.startTiming();
                    Game.clearAllCtx();
                    Game.initGame();
                });
            },
            'stageOverEnded' : function() {
                Game.dimStage(function() {
                    clear(mapCtx);
                    clear(fireCtx);
                    clear(mainCtx);
                    initMyMan();
                    stageendPlayed = true;
                    setBackground('images/firstbg.png');
                    draw();
                    lastState = RESTART;
                    Game.startTiming();
                    Game.nextStage();
                });
            },
            'bindDOM' : function() {
                W(gameendSound).on('ended', that.gameOverEnded);
                W(stageendSound).on('ended', that.stageOverEnded);
            }
        };
        var init = function() {
            that.bindDOM();
        }
        init();
        return that;
    }()
}

function Score() {
}

Score.prototype.draw = function() {
    this.drawBack();
}

Score.prototype.drawBack = function() {
    scoreCtx.fillStyle = '#000';
    scoreCtx.fillRect(0, 0, 800, 50);
    setAlpha(scoreCtx, 0, 0, 800, 50, 25);
    scoreCtx.strokeStyle = 'blue';
    scoreCtx.lineWidth = 3;
    scoreCtx.moveTo(0, 50);
    scoreCtx.lineTo(800, 50);
    scoreCtx.stroke();
}
/*
 * Sprite构造函数
 */
function Sprite(x, y, src, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.src = src;
}

/*
 * 检测是否有碰撞的方法
 */
Sprite.prototype.hitTestObject = function(obj) {
    //判断本物体是否与其他物体有重合部分，如果有，则发生碰撞
    var minx = this.x > obj.x ? this.x : obj.x;
    var maxx = this.x + this.width < obj.x + obj.width ? this.x + this.width : obj.x + obj.width;
    var miny = this.y > obj.y ? this.y : obj.y;
    var maxy = this.y + this.width < obj.y + obj.width ? this.y + this.width : obj.y + obj.width;

    if (minx <= maxx && miny <= maxy) {
        return true;
    }
    else {
        return false;
    }
};

var gamestartDrawed = false;

/*
 function Transition() {
 this.x = 0;
 this.y = 0;
 this.alpha = 0;
 this.action = "add";
 }

 Transition.prototype.draw = function() {
 //濡傛灉鏄笎鏆�
 if (this.action == "add") {
 if (this.alpha < 100) {
 if (this.alpha % 10 == 0) {
 clear(transCtx);
 transCtx.globalAlpha = this.alpha / 100;
 transCtx.fillStyle = "#000";
 transCtx.fillRect(this.x, this.y, MapWidth, MapHeight);
 }
 this.alpha += 5;
 }
 //鏆楀埌澶翠簡
 if (this.alpha == 100) {
 this.action = "minus";
 if (lastState != BOTHDEAD) {

 clear(mapCtx);
 clear(fireCtx);
 clear(mainCtx);
 initMyMan();
 setBackground('images/firstbg.png');
 draw();

 }
 else {

 clear(mapCtx);
 clear(fireCtx);
 clear(mainCtx);
 clear(enemyCtx);
 clear(scoreCtx);
 mapCtx.drawImage(startimg, 0, 0, MapWidth, MapHeight);
 Menu.showMenu();

 }
 }
 }
 else {
 //娓愪寒
 if (this.alpha > 0) {
 if (this.alpha % 10 == 0) {
 clear(transCtx);
 transCtx.globalAlpha = this.alpha / 100;
 transCtx.fillStyle = "#000";
 transCtx.fillRect(this.x, this.y, MapWidth, MapHeight);
 }
 this.alpha -= 5;
 }
 if (this.alpha == 0) {
 this.action = "add";
 gameState = STAGE_INIT;
 if (lastState == BOTHDEAD) {
 gameendPlayed = false;
 lastState = RESTART;
 gameState = GAME_INIT;
 }
 }
 }
 }*/
