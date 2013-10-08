function Dragon(name, x, y, speed) {
    this.x = x;
    this.y = y;
    this.dir = "Down";
    this.width = 45;
    this.name = name;
    this.speed = speed;
    this.action = "Walk";
    this.isPush = false;
    this.pushDelay = 20;
    this.time = 0;
    this.img = img;
    this.row = this.y / 50;
    this.col = this.x / 50;
    this.pushTime = 0;
    this.startFollowTime = 500;
    this.followInterval = 15;
    this.stoneFront = 0;
    this.randDir = 2;
}

var birthTime = 80;
Dragon.prototype = new Sprite();
Dragon.prototype.draw = function(x, y) {
    if (this.action == "Walk") {
        if (this.time % 30 < 10) {
            enemyCtx.drawImage(this.img, images[this.name + this.dir + 'Stand'][0], images[this.name + this.dir + 'Stand'][1], sourceW, sourceH, x, y, realW, realH);
        }
        else if (this.time % 30 > 20) {
            enemyCtx.drawImage(this.img, images[this.name + this.dir + 'Walk'][0], images[this.name + this.dir + 'Walk'][1], sourceW, sourceH, x, y, realW, realH);
        }
        else {
            enemyCtx.drawImage(this.img, images[this.name + this.dir + 'Step'][0], images[this.name + this.dir + 'Step'][1], sourceW, sourceH, x, y, realW, realH);
        }
    }
    else if (this.action == "Push") {
        enemyCtx.drawImage(this.img, images[this.name + this.dir + 'Step'][0], images[this.name + this.dir + 'Step'][1], sourceW, sourceH, x, y, realW, realH);
    }
    else if (this.action == "Die") {
        return;
    }
    else if (this.action == 'Birth') {
        this.row = this.y / 50;
        this.col = this.x / 50;
        if (this.time % 20 < 10) {
            enemyCtx.drawImage(this.img, images[this.name + this.dir + 'Stand'][0], images[this.name + this.dir + 'Stand'][1], sourceW, sourceH, x, y, realW, realH);
            setAlpha(enemyCtx, this.x, this.y, realW, realH, 25);
        }
        else {
            enemyCtx.drawImage(img, images['Stone'][0], images['Stone'][1], sourceW, sourceH, x, y, realW, realH);
        }
    }
}
Dragon.prototype.changeDir = function(startTime, interval) {
    if (this.time % 50 == 1 && this.time <= startTime) {
        this.randDir = parseInt(Math.random() * 4);
    }
    else if (this.time % interval == 1 && this.time > startTime) {
        if (Math.abs(this.y - myman[0].y) <= 40) {
            if (this.x - myman[0].x > 0) {
                this.randDir = 2;
            }
            else {
                this.randDir = 3;
            }
        }
        else if (Math.abs(this.x - myman[0].x) <= 40) {
            if (this.y - myman[0].y > 0) {
                this.randDir = 0;
            }
            else {
                this.randDir = 1;
            }
        }
    }
}

Dragon.prototype.moveFree = function() {
    enemyCtx.clearRect(this.x, this.y, realW, realH);
    this.time++;
     if (this.time < birthTime) {
         this.action = 'Birth';
         return;
     }
     else if (this.time == birthTime) {
         this.action = 'Walk';
     }
     else {
         this.changeDir(this.startFollowTime, this.followInterval);
     }
 
     if (this.stoneFront == 1) {
         if (this.pushTime < this.pushDelay) {
             this.pushTime++;
         }
         else {
             this.push(this.dir);
             this.pushTime = 0;
             this.stoneFront = 0;
             this.action = 'Walk';
         }
     }
     else {
         this.move(this.randDir);
     }
}

Dragon.prototype.checkXRemain = function() {
    if (this.x % 50 <= 20) {
        this.x -= this.x % 50;

    }
    else if (this.x % 50 > 20) {
        this.x += (50 - this.x % 50);
    }
}
Dragon.prototype.checkYRemain = function() {
    if (this.y % 50 <= 20) {
        this.y -= this.y % 50;
    }
    else if (this.y % 50 > 20) {
        this.y += (50 - this.y % 50);
    }
}

Dragon.prototype.push = function(dir) {
    this.action = "Push";
    switch (dir) {
        case 'Up': {
            this.dir = 'Up';
            if (this.hasStoneUp()) {
                this.kickStone(this.hasStoneUp().col, this.hasStoneUp().row);
                this.time++;
            }
            break;
        }
        case 'Down': {
            this.dir = "Down";
            if (this.hasStoneDown()) {
                this.kickStone(this.hasStoneDown().col, this.hasStoneDown().row);
                this.time++;
            }
            break;
        }
        case 'Left': {
            this.dir = "Left";
            if (this.hasStoneLeft()) {
                this.kickStone(this.hasStoneLeft().col, this.hasStoneLeft().row);
                this.time++;
            }
            break;
        }
        case 'Right': {
            this.dir = "Right";
            if (this.hasStoneRight()) {
                this.kickStone(this.hasStoneRight().col, this.hasStoneRight().row);
                this.time++;
            }
            break;
        }
        default:
            break;
    }
}

Dragon.prototype.move = function(dir) {
    if (dir == Up || dir == Down) {
        this.checkXRemain();
    }
    else {
        this.checkYRemain()
    }
    switch (dir) {
        case Up: {
            this.dir = "Up";
            if (this.moveUp()) {
                this.y -= this.speed;
                this.time++;
                return true;
            }
            else if (this.hasStoneUp()) {
                this.stoneFront = 1;
            }
            break;
        }
        case Down: {
            this.dir = "Down";
            if (this.moveDown()) {

                this.y += this.speed;
                this.time++;
                return true;
            }
            else {
                if (this.hasStoneDown()) {
                    this.stoneFront = 1;
                }
            }
            break;
        }
        case Left: {
            this.dir = "Left";
            if (this.moveLeft()) {

                this.x -= this.speed;
                this.time++;
                return true;
            }
            else {
                if (this.hasStoneLeft()) {
                    this.stoneFront = 1;
                }
            }
            break;
        }
        case Right: {
            this.dir = "Right";
            if (this.moveRight()) {
                this.x += this.speed;
                this.time++;
                return true;
            }
            else {
                if (this.hasStoneRight()) {
                    this.stoneFront = 1;
                }
            }
            break;
        }
        default:
            break;
    }
    return false;
}
Dragon.prototype.check = function(row, col) {
    if (map[row][col] == NONE) {
        return false;
    }
    else if (map[row][col] == FIREBALL) {
        return 2;
    }
    else if (map[row][col] == BUOY) {
        return 3
    }
    else {
        return true;
    }
}
Dragon.prototype.moveUp = function() {
    var row = parseInt(this.y / 50);
    var col = parseInt(this.x / 50);

    if (beyondTopBound(this) || this.check(row, col) === 2 || this.check(row, col) === 3) {
        this.randDir = parseInt(Math.random() * 4);
        return false;
    }
    if (!this.check(row, col)) {
        return true;
    }
    return false;
}
Dragon.prototype.moveDown = function() {
    var row = parseInt(this.y / 50) + 1;
    var col = parseInt(this.x / 50);
    if (this.y >= 550 || this.check(row, col) === 2 || this.check(row, col) === 3) {
        this.randDir = parseInt(Math.random() * 4);
        return false;
    }
    if (!check(row, col)) {
        return true;
    }
    return false;
}
Dragon.prototype.moveLeft = function() {
    var row = parseInt(this.y / 50);
    var col = parseInt(this.x / 50);
    if (this.x <= 0 || this.check(row, col) === 2 || this.check(row, col) === 3) {
        this.randDir = parseInt(Math.random() * 4);
        return false;
    }
    if (!check(row, col)) {
        return true;
    }
    return false;
}

Dragon.prototype.moveRight = function() {
    var row = parseInt(this.y / 50);
    var col = parseInt(this.x / 50) + 1;
    if (this.x >= 750 || this.check(row, col) === 2 || this.check(row, col) === 3) {
        this.randDir = parseInt(Math.random() * 4);
        return false;
    }
    if (!check(row, col)) {
        return true;
    }
    return false;
}

Dragon.prototype.kickStone = function(col, row) {

    var stonebreak = new StoneBreak(col * 50, row * 50);
    if (col == undefined) {
        return;
    }
    stonebreaks.push(stonebreak);
    stonebreakSound.play();
    map[row][col] = NONE;

}

Dragon.prototype.hasStoneUp = function(dir) {
    var row = parseInt(this.y / 50);
    var col = parseInt(this.x / 50);

    if (beyondTopBound(this)) {
        return false;
    }
    if (checkObstacle(row, col) == STONE || checkObstacle(row, col) == ENEMY_STONE) {
        return {
            'row' : row,
            'col' : col
        };
    }
    return false;
}
Dragon.prototype.hasStoneDown = function(dir) {
    var row = parseInt(this.y / 50) + 1;
    var col = parseInt(this.x / 50);
    if (this.y >= 550) {
        return false;
    }
    if (checkObstacle(row, col) == STONE || checkObstacle(row, col) == ENEMY_STONE) {
        return {
            'row' : row,
            'col' : col
        };
    }
    return false;
}
Dragon.prototype.hasStoneLeft = function(dir) {
    while (this.x <= 0) {
        this.x++;
    }
    while (this.y <= 0) {
        this.y++;
    }
    var row = parseInt(this.y / 50);
    var col = parseInt(this.x / 50);
    if (this.x <= 0) {
        return false;
    }
    if (checkObstacle(row, col) == STONE || checkObstacle(row, col) == ENEMY_STONE) {
        return {
            'row' : row,
            'col' : col
        };
    }
    return false;
}
Dragon.prototype.hasStoneRight = function(dir) {
    while (this.x <= 0) {
        this.x++;
    }
    while (this.y <= 0) {
        this.y++;
    }
    var row = parseInt(this.y / 50);
    var col = parseInt(this.x / 50) + 1;
    if (this.x > 750) {
        return false;
    }
    if (checkObstacle(row, col) == STONE || checkObstacle(row, col) == ENEMY_STONE) {
        return {
            'row' : row,
            'col' : col
        };
    }
    return false;
}

Dragon.prototype.hitMyMan = function() {
    var hit = false;
    for (var i = 0; i < myman.length; i++) {
        if (this.hitTestObject(myman[i]) && myman[i].state != "God" && myman[i].action != "Die") {
            myman[i].die(myman[i]);
            myman[i].action = 'Die';
            hit = true;
        }
    }
    return hit;
}

function updateEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i]) {
            enemies[i].moveFree();
            enemies[i].draw(enemies[i].x, enemies[i].y);
            enemies[i].hitMyMan();
        }
    }
}
