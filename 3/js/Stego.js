function Stego(name, x, y, speed) {
    Dragon.call(this, name, x, y, speed);
    this.dir = "Down";
    this.width = 45;
    this.name = name;
    this.row = -1;
    this.col = -1;
    this.action = "Walk";
    this.isPush = false;
    this.pushDelay = 30;
    this.time = 0;
    this.pushTime = 0;
    this.img = player2img;
    this.startFollowTime=500;
    this.followInterval=15;
    this.stoneFront = 0;
    this.randDir = 2;
    this.state = 'Normal';
}

var birthTime = 80;

Stego.prototype = new Sprite();
Stego.prototype = new Dragon();

function checkObstacleForStego(row, col) {
    return checkObstacle(row, col) == STONE || checkObstacle(row, col) == ENEMY_STONE;
}

Stego.prototype.checkXRemain = function() {
    if (this.x % 50 <= 20) {
        this.x -= this.x % 50;

    }
    else if (this.x % 50 > 20) {
        this.x += (50 - this.x % 50);
    }
}
Stego.prototype.checkYRemain = function() {
    if (this.y % 50 <= 20) {
        this.y -= this.y % 50;
    }
    else if (this.y % 50 > 20) {
        this.y += (50 - this.y % 50);
    }
}

Stego.prototype.moveFree = function() {
    enemyCtx.clearRect(this.x, this.y, realW, realH);
    if (this.time < birthTime) {
        this.time++;
        this.action = 'Birth';
        this.state = 'AfterBirth';
        return;
    }
    else if (this.time == birthTime) {
        this.action = 'Walk';
    }
    else {
    	this.changeDir(this.startFollowTime,this.followInterval);
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

Stego.prototype.push = function(dir) {
    this.action = "Push";
    switch(dir) {
        case "Up": {

            if (this.checkStoneUp(dir)) {
                this.time++;
                return true;
            }
            break;
        }
        case "Down": {
            this.dir = "Down";
            if (this.checkStoneDown(dir)) {
                this.time++;
                return true;
            }
            break;
        }
        case "Left": {
            this.dir = "Left";
            if (this.checkStoneLeft(dir)) {
                this.time++;
                return true;
            }
            break;
        }
        case "Right": {
            this.dir = "Right";
            if (this.checkStoneRight(dir)) {
                this.time++;
                return true;
            }
            break;
        }
        default:
            break;
    }
    return false;
}

Stego.prototype.checkStoneUp = function(dir) {
    if (this.state == 'AfterBirth') {
        this.kickStone(this.hasStoneUp().col, this.hasStoneUp().row);
        this.state = 'Normal';
    }
    else {
        var row = parseInt(this.y / 50);
        var col = parseInt(this.x / 50);
        if (this.y < 0) {
            return false;
        }

        if (checkObstacle(row, col) == STONE || checkObstacle(row, col) == ENEMY_STONE) {
            if (row == 1 || checkObstacle(row - 1, col)) {
                addStoneBreak(col, row);
            }
            else {
                addStoneFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        else if (checkObstacle(row, col) == FIREBALL) {

            if (row == 1 || checkObstacle(row - 1, col)) {
                addFireBreak(col, row, this.name);
            }
            else {
                addFireFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        else if (checkObstacle(row, col) == BUOY && (this.name == 'bird' || this.name == 'croco')) {
            if (row == 1 || checkObstacle(row - 1, col)) {
                addStoneBreak(col, row);
            }
            else {
                addBuoyFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        return false;
    }
}
Stego.prototype.checkStoneDown = function(dir) {
    if (this.state == 'AfterBirth') {
        this.kickStone(this.hasStoneDown().col, this.hasStoneDown().row);
        this.state = 'Normal';
    }
    else {
        var row = parseInt(this.y / 50) + 1;
        var col = parseInt(this.x / 50);
        if (this.y > 560) {

            return false;
        }
        if (checkObstacle(row, col) == STONE || checkObstacle(row, col) == ENEMY_STONE) {
            if (row == 11 || checkObstacle(row + 1, col)) {
                addStoneBreak(col, row);
            }
            else {
                addStoneFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        else if (checkObstacle(row, col) == FIREBALL) {
            if (row == 11 || checkObstacle(row + 1, col)) {
                addFireBreak(col, row, this.name);
            }
            else {
                addFireFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        else if (checkObstacle(row, col) == BUOY && (this.name == 'bird' || this.name == 'croco')) {
            if (row == 11 || checkObstacle(row + 1, col)) {
                addStoneBreak(col, row);
            }
            else {
                addBuoyFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        return false;
    }
}

Stego.prototype.checkStoneLeft = function(dir) {
    if (this.state == 'AfterBirth') {
        this.kickStone(this.hasStoneLeft().col, this.hasStoneLeft().row);
        this.state = 'Normal';
    }
    else {
        var row = parseInt(this.y / 50);
        var col = parseInt(this.x / 50);
        if (this.x < 0) {
            return false;
        }
        if (checkObstacle(row, col) == STONE || checkObstacle(row, col) == ENEMY_STONE) {
            if (col == 0 || checkObstacle(row, col - 1)) {
                addStoneBreak(col, row);
            }
            else {
                addStoneFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        else if (checkObstacle(row, col) == FIREBALL) {
            if (col == 0 || checkObstacle(row, col - 1)) {
                addFireBreak(col, row, this.name);
            }
            else {
                addFireFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        else if (checkObstacle(row, col) == BUOY && (this.name == 'bird' || this.name == 'croco')) {
            if (col == 0 || checkObstacle(row, col - 1)) {
                addStoneBreak(col, row);
            }
            else {
                addBuoyFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        return false;
    }
}

Stego.prototype.checkStoneRight = function(dir) {
    if (this.state == 'AfterBirth') {
        this.kickStone(this.hasStoneRight().col, this.hasStoneRight().row);
        this.state = 'Normal';
    }
    else {
        var row = parseInt(this.y / 50);
        var col = parseInt(this.x / 50) + 1;

        if (this.x > 760) {
            return false;
        }
        if (checkObstacle(row, col) == STONE || checkObstacle(row, col) == ENEMY_STONE) {
            if (col == 15 || checkObstacle(row, col + 1)) {
                addStoneBreak(col, row);
            }
            else {
                addStoneFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        else if (checkObstacle(row, col) == FIREBALL) {
            if (col == 15 || checkObstacle(row, col + 1)) {
                addFireBreak(col, row, this.name);
            }
            else {
                addFireFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        else if (checkObstacle(row, col) == BUOY && (this.name == 'bird' || this.name == 'croco')) {
            if (row == 15 || checkObstacle(row, col + 1)) {
                addStoneBreak(col, row);
            }
            else {
                addBuoyFly(col, row, dir, this.name);
            }
            map[row][col] = NONE;
            return true;
        }
        return false;
    }
}
function Bird(name, x, y, speed) {
    Stego.call(this, name, x, y, speed);
    this.pushDelay = 10;
    this.startFollowTime=100;
   	this.followInterval=5;
    this.img = player2img;
}

Bird.prototype = new Stego();

Bird.prototype.hasStoneUp = function(dir) {
    var row = parseInt(this.y / 50);
    var col = parseInt(this.x / 50);

    if (this.y <= 0) {
        return false;
    }
    if (checkObstacleForBird(row, col)) {
        return {
            'row' : row,
            'col' : col
        };
    }
    return false;
}
Bird.prototype.hasStoneDown = function(dir) {
    var row = parseInt(this.y / 50) + 1;
    var col = parseInt(this.x / 50);
    if (this.y >= 550) {
        return false;
    }
    if (checkObstacleForBird(row, col)) {
        return {
            'row' : row,
            'col' : col
        };
    }
    return false;
}
Bird.prototype.hasStoneLeft = function(dir) {
    var row = parseInt(this.y / 50);
    var col = parseInt(this.x / 50);
    if (this.x <= 0) {
        return false;
    }
    if (checkObstacleForBird(row, col)) {
        return {
            'row' : row,
            'col' : col
        };
    }
    return false;
}
function checkObstacleForBird(row, col) {
    return checkObstacle(row, col) == STONE || checkObstacle(row, col) == ENEMY_STONE;
}

Bird.prototype.hasStoneRight = function(dir) {
    var row = parseInt(this.y / 50);
    var col = parseInt(this.x / 50) + 1;

    if (this.x > 750) {
        return false;
    }
    if (checkObstacleForBird(row, col)) {
        return {
            'row' : row,
            'col' : col
        };
    }
    return false;
}
function Croco(name, x, y, speed) {
    Bird.call(this, name, x, y, speed);
    this.pushDelay = 20;
    this.startFollowTime=300;
   	this.followInterval=10;
    this.img = img;
}
Croco.prototype = new Bird();
