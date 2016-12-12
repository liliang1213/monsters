function loadAudios() {
    stagestarSound = new Sound('sound/stagestart.ogg');
    gameendSound.src = 'sound/gameend.ogg';
    stageendSound.src = 'sound/stageend.ogg';
    enemydieSound = new Sound('sound/enemydie.ogg');
    firebreakSound = new Sound("sound/firebreak.ogg");
    mymandieSound = new Sound("sound/mymandie.ogg");
    pushSound = new Sound("sound/push.ogg");
    stonebreakSound = new Sound("sound/stonebreak.ogg");
    player1Dead = false;
    player2Dead = false;
    gameState = STAGE_TRANS;
}
//off
var key = {},Menu,Game,Util=Util(), drawFire = new DrawFire(), mapObj = new Map(), 
 score = new Score(), interval,
stonefly = {}, firefly = {}, stonebreak = {}, firebreak = {}, buoyfly = {}, enemydie = {},
 enemy = {}, stonebreaks = [], firebreaks = [], stoneflys = [], buoyflys = [], 
 fireflys = [], enemies = [], enemiesdie = [], myman = [], mymandie = [], enemyArray = [], 
 enemyDie,  gameendSound = new Audio(), firebreakSound, enemydieSound, stageendSound = new Audio(), stagestarSound, 
 selectIndex = 0, mymandieSound, pushSound, stonebreakSound, isRedrawingMap = false,
  isRedrawingFire = false, isFirstPushing = false, isSecondPushing = false, timeout = 0,
   map, endDelay = 80, playerNum, level = 1, hasStoneLeft, gameendPlayed = false, 
   bufferNum = 0, rhinoNum = 0, enemyNum = 0, stegoNum = 0, crocoNum = 0, lastState, 
   gameState = GAME_INIT, stageendPlayed = false, SoundControl=SoundControl(),players = {
    'player1' : {
        life : 3,
        score : 0
    },
    'player2' : {
        life : 5,
        score : 0
    }
}, player1, player2, player1Dead = true, player2Dead = true;
//on
function clearAll() {
    for(var i in enemydie) {
        enemydie[i] = null;
    }
    enemiesdie = [];
    for(var i in stonefly) {
        stonefly[i] = null;
    }
    stoneflys = [];
    for(var i in firebreak) {
        firebreak[i] = null;
    }
    firebreaks = [];
    for(var i in stonebreak) {
        stonebreak[i] = null;

    }
    stonebreaks = [];
    for(var i in buoyfly) {
        buoyfly[i] = null;
    }
    buoyflys = [];
    for(var i in enemy) {
        enemy[i] = null;
    }
    enemies = [];

}
function update() {
    updateMyManDie();
    updateStoneFly();
    updateStoneBreak();
    updateFireFly();
    updateFireBreak();
    updateBuoyFly();
    updateEnemies();
    updateEnemyDie();
    updateStage();
    updateGame();
    keyboardEvent();
}
function stageTrans() {
    if(lastState == BOTHDEAD) {
    	    Game.stopTiming();
            mainCtx.shadowOffsetX = 4;
            mainCtx.shadowOffsetY = 3; 
            mainCtx.shadowBlur = 2;
            mainCtx.shadowColor = "rgba(0, 0, 0, 0.5)";
            mainCtx.font = "60px Comic Sans MS";
            mainCtx.fillStyle = "blue";
            mainCtx.fillText('G', 200, 320);
            mainCtx.fillStyle = "#DE0000";
            mainCtx.fillText('A', 240, 320);
            mainCtx.fillStyle = "#00AE00";
            mainCtx.fillText('M', 280, 320);
            mainCtx.fillText('E', 330, 320);
            mainCtx.fillStyle = "#DE0000";
            mainCtx.fillText('O', 380, 320);
            mainCtx.fillStyle = "blue";
            mainCtx.fillText('V', 420, 320);
            mainCtx.fillStyle = "#00AE00";
            mainCtx.fillText('E', 460, 320);
            mainCtx.fillStyle = "blue";
            mainCtx.fillText('R', 500, 320);
            gameendSound.play();
    } else if(lastState == STAGE_START) {
    	Game.stopTiming();
            stageendSound.play();
    } 
    
}

function main() {
	Menu=Menu();
	Game=Game();
    interval=setInterval('loop()', 20);
}

function loop() {
    switch(gameState) {
        case LOAD_SOURCES:
            loadAudios();
            break;
        case STAGE_INIT:
            initStage();
            break;
        case STAGE_START:
            draw();
            update();
            break;
        case GAME_SELECT: 
            keyboardEvent();
            break;
        case STAGE_TRANS:
            stageTrans();
            break;
            default:break;
    }
}

function initMyMan() {
    map = this['map' + level];
    for(var i = 0; i < 12; i++) {
        for(var j = 0; j <= 15; j++) {
            tempmap[i][j] = map[i][j];
        }
    }
    playerNum = selectIndex + 1;
    if(players.player1.life >= 0) {
        player1Dead = false;
        if(!player1) {
            player1 = new MyDragon('player1', PLAYER1_X, PLAYER1_Y, 7, img);
        } else {
            player1.state = 'Normal';
            player1.dir = 'Down';
            player1.x = PLAYER1_X;
            player1.y = PLAYER1_Y;
            player1.action = 'Walk';
        }

        if(myman.indexOf(player1) == -1) {
            myman.push(player1);
        }
    }
    if(playerNum == 2) {
        if(players.player2.life >= 0) {
            player2Dead = false;
            if(!player2) {
                player2 = new MyDragon('player2', PLAYER2_X, PLAYER2_Y, 7, player2img);

            } else {
                player2.state = 'Normal';
                player2.dir = 'Down';
                player2.x = PLAYER2_X;
                player2.y = PLAYER2_Y;
                player2.action = 'Walk';
            }
        }
        if(myman.indexOf(player2) == -1) {
            myman.push(player2);
        }
    }
    for(var i = 0; i < myman.length; i++) {
        myman[i].speed = 7;

    }
    mapObj.drawMap(map);
    drawScore();

}

function updateGame() {
    if((map.toString().indexOf(STONE) == -1 && map.toString().indexOf(FIREBALL) == -1 && map.toString().indexOf(BUOY) == -1) || (playerNum == 1 && players.player1.life < 0) || (playerNum == 2 && players.player1.life < 0 && players.player2.life < 0)) {
        if(timeout < endDelay) {
            timeout++;
        } else {
            for( i = 0; i < 12; i++) {
                for( j = 0; j <= 15; j++) {
                    this['map' + level][i][j] = tempmap[i][j];
                }
            }
            timeout = 0;
            lastState = BOTHDEAD;
            gameState = STAGE_TRANS;
        }
    }
}

function updateStage() {
    if(enemyNum <= 0 && enemiesdie.length <= 0 && mymandie.length <= 0 && enemies.length <= 0 && stonebreaks.length <= 0 && firebreaks.length <= 0 && stoneflys.length <= 0 && fireflys.length <= 0) {
        if(timeout < endDelay) {
            timeout++;
        } else {
            timeout = 0;
            for( i = 0; i < 12; i++) {
                for( j = 0; j <= 15; j++) {
                    this['map' + level][i][j] = tempmap[i][j];
                }
            }
            clearAll();
            lastState = STAGE_START;
            level++;
            gameState = STAGE_TRANS;
        }
    }
}

function draw() {
    drawFire.draw(map);
    redrawMyDragonOnCondition();
}

function keyboardEvent() {
    if(!player1Dead) {
        if(key[K_SPACE]) {
            player1.push(player1.dir);
            redrawMyDragon();
        }
        if(key[K_UP]) {
            player1.move(Up);
            redrawMyDragon();
        } else if(key[K_DOWN]) {
            player1.move(Down);
            redrawMyDragon();
        } else if(key[K_LEFT]) {
            player1.move(Left);
            redrawMyDragon();
        } else if(key[K_RIGHT]) {
            player1.move(Right);
            redrawMyDragon();
        }
    }
    if(playerNum == 2) {
        if(!player2Dead) {
            if(key[K_W]) {
                player2.move(Up);
                redrawMyDragon();
            } else if(key[K_S]) {
                player2.move(Down);
                redrawMyDragon();
            } else if(key[K_A]) {
                player2.move(Left);
                redrawMyDragon();
            } else if(key[K_D]) {
                player2.move(Right);
                redrawMyDragon();
            }
            if(key[K_TAB]) {
                player2.push(player2.dir);
                redrawMyDragon();
            }
        }
    }
}

function initStage() {
	
    if(timeout == 1) {
    	redrawMyDragon();
        buoyflys = [];
        fireflys = [];
        stoneflys = [];
        mainCtx.shadowOffsetX = 4;
        mainCtx.shadowOffsetY = 3;
        mainCtx.shadowBlur = 4;
        mainCtx.shadowColor = "rgba(0, 0, 0, 0.9)";
        mainCtx.font = "60px Comic Sans MS";
        mainCtx.fillStyle = "#DC8602";
        mainCtx.fillText('S', 250, 320);
        mainCtx.fillStyle = "#AD00AD";
        mainCtx.fillText('T', 290, 320);
        mainCtx.fillStyle = "#0000FF";
        mainCtx.fillText('A', 330, 320);
        mainCtx.fillStyle = "#00AE00";
        mainCtx.fillText('G', 380, 320);
        mainCtx.fillStyle = "#7B0000";
        mainCtx.fillText('E', 420, 320);
        mainCtx.fillStyle = "#00AE00";
        mainCtx.fillText(level, 490, 320);
    }
    if(timeout < endDelay) {
        timeout++;
        if(timeout == (endDelay - 1)) {
            mainCtx.shadowOffsetX = 0;
            mainCtx.shadowOffsetY = 0;
            mainCtx.shadowBlur = 0;
        }
    } else {
    	redrawMyDragon();
        timeout = 0;
        stagestarSound.play();
        bufferNum = stageCfg[level].buffer;
        rhinoNum = stageCfg[level].rhino;
        stegoNum = stageCfg[level].stego;
        crocoNum = stageCfg[level].croco;
        birdNum = stageCfg[level].bird;
        enemyNum = rhinoNum + stegoNum + birdNum + crocoNum;

        var row = 11, col = 15, tempArray = [];
        var k = 0;
        for(var i = 0; i < row; i++) {
            for(var j = 0; j < col; j++) {
                if(map[i][j] == STONE) {
                    tempArray.push({
                        'row' : i,
                        'col' : j
                    });
                }
            }
        }
        enemyArray = Util.getArrayItems(tempArray, enemyNum);
        if(enemyArray.length < bufferNum) {
            bufferNum = enemyArray.length;
            enemyNum = 0;
            hasStoneLeft = false;
        }
        for(var i = 0; i < bufferNum; i++) {
            chooseBufferEnemyBorn(enemyArray, k++);

        }
       
        gameState = STAGE_START;
    }
}

function chooseOneToBorn() {
    var row = 11, col = 15, tempArray = [], enemyArray = [];
    var k = 0;
    for(var i = 0; i < row; i++) {
        for(var j = 0; j < col; j++) {
            if(map[i][j] == STONE) {
                tempArray.push({
                    'row' : i,
                    'col' : j
                });
            }
        }
    }
    enemyArray = Util.getArrayItems(tempArray, enemyNum);
    if(enemyArray.length <= 0) {
        enemyNum = 0;
        return;
    }
    return chooseBufferEnemyBorn(enemyArray, 0);
}

function chooseBufferEnemyBorn(enemyArray, k) {
    if(rhinoNum > 0) {
        addEnemy('rhino', enemyArray[k].col, enemyArray[k].row, 4);
        return true;
    } else if(stegoNum > 0) {
        addEnemy('stego', enemyArray[k].col, enemyArray[k].row, 4);
        return true;
    } else if(crocoNum > 0) {
        addEnemy('croco', enemyArray[k].col, enemyArray[k].row, 9);
        return true;
    } else if(birdNum > 0) {
        addEnemy('bird', enemyArray[k].col, enemyArray[k].row, 9);
        return true;
    } else
        return false;
}

function resetGame() {
    clearAll();
    level = 1;
    players = {
        'player1' : {
            life : 5,
            score : 0
        },
        'player2' : {
            life : 5,
            score : 0
        }
    }
}
document.onkeydown = function(e) {
    if(gameState == STAGE_TRANS) {
        return;
    }
    if(e.keyCode == K_UP && gameState == GAME_SELECT) {
        if(selectIndex > 0) {
            selectIndex--;
        } else {
            selectIndex = 2;
        }
        Menu.selectPlayerNum(selectIndex);
        return;
    }
    if((e.keyCode == K_DOWN || e.keyCode == K_SPACE) && gameState == GAME_SELECT) {
        if(selectIndex < 2) {
            selectIndex++;
        } else {
            selectIndex = 0;
        }
         Menu.selectPlayerNum(selectIndex);
        return;
    }
    if(e.keyCode == K_ENTER && gameState == GAME_SELECT&&selectIndex!=2) {
        Menu.clickMenu(selectIndex);
        return;
    }
    key[e.keyCode] = true;
}

document.onkeyup = function(e) {
    if(myman.length >= 0) {
        for(var i = 0; i < myman.length; i++) {
            if(myman[i].name == "player1") {
                if(e.keyCode == K_SPACE) {
                    myman[i].isPush = false;
                }
            } else if(myman[i].name == "player2") {
                if(e.keyCode == K_TAB) {
                    myman[i].isPush = false;
                }
            }
        }
        key[e.keyCode] = false;
    }
}
function drawScore() {
    score.draw();
}

function clear(whichCanvas) {
    whichCanvas.clearRect(0, 0, 800, 600);
}

function clearRect(whichCanvas) {
    var myCanvas = document.getElementById(whichCanvas);
    var graphics = myCanvas.getContext("2d");
    graphics.clearRect(0, 0, 800, 600);
}

function rectPosition(obj) {
    if(obj.x >= 780) {
        obj.x -= 50;
        obj.y += 50;
        rectPosition(obj);
    }
    if(obj.y >= 570) {
        obj.y -= 50;
        obj.x += 50;
        rectPosition(obj);
    }
    if(map[parseInt((obj.y+40)/50)][ parseInt((obj.x + 40) / 50)] == STONE || map[parseInt((obj.y+40)/50)][ parseInt((obj.x + 40) / 50)] == FIREBALL) {
        obj.y += 50;
        rectPosition(obj);
    }
}

function checkObstacle(row, col) {
    if(row < 0 || row > 11 || col < 0 || col > 15) {
    } else if(map[row][col] == STONE) {
        return STONE;
    } else if(map[row][col] == FIREBALL) {
        return FIREBALL;
    } else if(map[row][col] == BUOY) {
        return BUOY;
    } else if(map[row][col] == ENEMY_STONE) {
        return ENEMY_STONE;
    } else {
        return false;
    }
}

function check(row, col) {
    if(map[row][col] == NONE) {
        return false;
    }
    return true;
}

function checkForStone(row, col) {
    if(map[row][col] == NONE || map[row][col] == ENEMY_STONE) {
        return true;
    }
    return false;
}

function setAlpha(ctx, x, y, width, height, percent) {
    var imageData = ctx.getImageData(x, y, width, height);
    for(var i = 0, h = imageData.height; i < h; i++) {
        for(var j = 0, w = imageData.width; j < w; j++) {
            //index 为当前要处理的像素编号
            var index = i * imageData.width + j;
            //一个像素占四个字节，即 p 为当前指针的位置
            var p = index * 4;
            //改变当前像素 offset 颜色分量的数值，offset 取值为0-3
            var color = imageData.data[p + 3] * percent / 50;
            // 颜色值限定在[0..255]
            color = Math.min(255, color);
            //将改变后的颜色值存回数组
            imageData.data[p + 3] = color
        }
    }
    //输出到屏幕
    ctx.putImageData(imageData, x, y);
}

function setBackground(src) {
    bgImg.src = src;
}

if(document.addEventListener) {
    document.addEventListener("keydown", maskBackspace, true);
} else {
    document.attachEvent("onkeydown", maskBackspace);
}
function maskBackspace(event) {
    var event = event || window.event;
    // 标准化事件对象
    var obj = event.target || event.srcElement;
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if(keyCode == 9) {
        if(obj != null && obj.tagName != null && (obj.tagName.toLowerCase() == "input" || obj.tagName.toLowerCase() == "input" || obj.tagName.toLowerCase() == "password")) {
            event.returnValue = true;
            if(Ext.getCmp(obj.id)) {
                if(Ext.getCmp(obj.id).readOnly) {
                    if(window.event) {
                        event.keyCode = 0;
                        event.returnValue = false;
                        // or event.keyCode=0
                    } else
                        event.preventDefault();
                    // for ff
                }
            }
        } else {
            if(window.event) {
                event.keyCode = 0;
                event.returnValue = false;
                // or event.keyCode=0
            } else
                event.preventDefault();
            // for ff
        }
    }
}

function beyondTopBound(obj) {
    if(obj.y <= BORDER_TOP) {
        return true;
    } else {
        return false;
    }
}

function killEnemyInBorn(col, row, pusher) {
    for(var i = 0; i < enemies.length; i++) {
        if(enemies[i].row == row && enemies[i].col == col) {
            addEnemyDie(enemies[i].x, enemies[i].y, 1, pusher);
            destroyEnemy(enemies[i]);
        }
    }
    map[row][col] = NONE;
    mapCtx.clearRect(col * 50, row * 50, realW, realH);
}

function addStoneBreak(col, row) {
    var i = 0;
    while(stonebreak[i]) {
        i++;
    }
    stonebreak[i] = new StoneBreak(col * 50, row * 50);
    stonebreaks.push(stonebreak[i]);
    stonebreakSound.play();
}

function addBuoyFly(col, row, dir, pusher) {
    var i = 0;
    while(stonefly[i]) {
        i++;
    }
    buoyfly[i] = new BuoyFly(col * 50, row * 50, dir, pusher);
    buoyflys.push(buoyfly[i]);
    pushSound.play();
}

function addStoneFly(col, row, dir, pusher) {
    var i = 0;
    while(stonefly[i]) {
        i++;
    }
    stonefly[i] = new StoneFly(col * 50, row * 50, dir, pusher);
    stoneflys.push(stonefly[i]);
    pushSound.play();
}

function addFireFly(col, row, dir, pusher) {
    var i = 0;
    while(firefly[i]) {
        i++;
    }
    fireCtx.clearRect(col * 50, row * 50, realW, realH);
    firefly[i] = new FireFly(col * 50, row * 50, dir, pusher);
    fireflys.push(firefly[i]);
    pushSound.play();
}

function addFireBreak(col, row, hitCount, pusher) {
    var i = 0;
    while(firebreak[i]) {
        i++;
    }
    fireCtx.clearRect(col * 50, row * 50, realW, realH);
    firebreak[i] = new FireBreak(col * 50, row * 50, hitCount, pusher);
    firebreaks.push(firebreak[i]);
}

function addEnemyDie(x, y, hitCount, pusher) {
    var i = 0;
    while(enemydie[i]) {
        i++;
    }
    enemyCtx.clearRect(x, y, realW, realH);
    enemydie[i] = new EnemyDie(x, y, hitCount, pusher);
    enemiesdie.push(enemydie[i]);
}

function addEnemy(name, col, row, speed) {
    var i = 0;
    while(enemy[i]) {
        i++;
    }
    if(name == 'rhino') {
        enemy[i] = new Dragon(name, col * 50, row * 50, speed);
        rhinoNum--;
    } else if(name == 'stego') {
        enemy[i] = new Stego(name, col * 50, row * 50, speed);
        stegoNum--;
    } else if(name == 'bird') {
        enemy[i] = new Bird(name, col * 50, row * 50, speed);
        birdNum--;
    } else if(name == 'croco') {
        enemy[i] = new Croco(name, col * 50, row * 50, speed);
        crocoNum--;
    }
    map[row][col] = ENEMY_STONE;
    enemyNum = rhinoNum + stegoNum + birdNum + crocoNum;
    enemies.push(enemy[i]);
}

function destroyEnemy(enemyDead) {
    enemyDead.state = 'Die';
    enemies.splice(enemies.indexOf(enemyDead), 1);
    for(var i in enemy) {
        if(enemy[i] && enemy[i].state == 'Die') {
            enemy[i] = null;
            delete enemy[i];
        }
    }
    redrawMap();
}