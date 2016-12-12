function Game() {
    return function() {
        //off
         //on
        var that = {
            'stopTiming' : function() {
                clearInterval(interval);
            },
            'startTiming' : function() {
               interval=setInterval(function() {
                    loop();
                }, 20);
            },
            'resetGame' : function() {
                that.clearAll();
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
            },
            'clearAll' : function() {
                for (var i in enemydie) {
                    enemydie[i] = null;
                }
                enemiesdie = [];
                for (var i in stonefly) {
                    stonefly[i] = null;
                }
                stoneflys = [];
                for (var i in firebreak) {
                    firebreak[i] = null;
                }
                firebreaks = [];
                for (var i in stonebreak) {
                    stonebreak[i] = null;

                }
                stonebreaks = [];
                for (var i in buoyfly) {
                    buoyfly[i] = null;
                }
                buoyflys = [];
                for (var i in enemy) {
                    enemy[i] = null;
                }
                enemies = [];
            },
            'dimback' : function() {
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
            },
            'dimStage' : function(callback) {
                W(transCanvas).fadeIn(500, function() {
                    (typeof callback == 'function') && callback();
                });
            },
            'lightStage' : function(callback) {
                W(transCanvas).fadeOut('500', function() {
                    (typeof callback == 'function') && callback();
                });
            },
            'transition' : function(dimcallback, lightcallback) {
                that.dimStage(function() {
                    (typeof dimcallback == 'function') && dimcallback();
                    that.lightStage(lightcallback)
                });
            },
            'lightback' : function() {
                gameState = STAGE_INIT;
                stageendPlayed = false;
                if (lastState == BOTHDEAD) {
                    lastState = RESTART;
                    that.lightStage();
                }
                that.startTiming();
            },
            'initGame' : function() {
            	mapCtx.drawImage(startimg, 0, 0, MapWidth, MapHeight);
                that.lightStage(function() {
                	Menu.showMenu();
                	Menu.setDefaultSelect();
                    gameState = GAME_SELECT;
                    lastState = RESTART;
                });
            },
            'clearAllCtx':function(){
            	clear(mapCtx);
                clear(fireCtx);
                clear(mainCtx);
                clear(enemyCtx);
                clear(scoreCtx);
            },
            'nextStage':function(){
            	that.lightStage(function(){
            		 gameState = STAGE_INIT;
            	});
            }
        };
        var init = function() {
      
           that.initGame();
        };
        init();
        return that;
    }()
}
