function Menu() {
    return function() {
        //off
        var player1instruct = doc.getElementById('player1instruct'),
         player2instruct = doc.getElementById('player2instruct'), 
         firstDiv = W('#first'), secondDiv = W('#second'), helpDiv = W('#help');
         //on
        var that = {
            'showMenu' : function() {
                W('div .menu').forEach(function(el) {
                    if (el.style.display == 'none') {
                        el.style.display = '';
                    }
                });
                selectIndex = 0;
                that.selectPlayerNum(selectIndex);
            },
            'hideMenu' : function() {
                W('div .menu').forEach(function(el) {
                    if (el.style.display == '') {
                        el.style.display = 'none';
                    }
                });
            },
             'setDefaultSelect':function(){
            	that.selectPlayerNum(selectIndex);
            },
            'selectPlayerNum' : function(index) {
                var offset = 50;
                var y = (index) * offset + 408;
                var x = 275;
                mapCtx.drawImage(startimg, 0, 0, MapWidth, MapHeight);
                mapCtx.drawImage(img, images['Pointer'][0], images['Pointer'][1], 20, 20, x, y, pointerW, pointerH);
            },
            'clickMenu' : function(selectIndex) {
                that.hideMenu();
                Game.dimStage(function(){
                	clear(mapCtx);
                    clear(fireCtx);
                    clear(mainCtx);
                    initMyMan();
                    setBackground('images/firstbg.png');
                    draw();
                    Game.lightStage();
                    gameState = STAGE_INIT;
                });
                loadAudios();
            },
            'bindDOM' : function() {
                firstDiv.hover(function() {
                    selectIndex = 0;
                    that.selectPlayerNum(selectIndex);
                }).click(function() {
                    that.clickMenu(selectIndex);
                });
                secondDiv.hover(function() {
                    selectIndex = 1;
                    that.selectPlayerNum(selectIndex);
                }).click(function() {
                    that.clickMenu(selectIndex);
                });
                helpDiv.hover(function() {
                    selectIndex = 2;
                    that.selectPlayerNum(selectIndex);
                    player1instruct.style.display = 'inline';
                    player2instruct.style.display = 'inline';
                }, function() {
                    player1instruct.style.display = 'none';
                    player2instruct.style.display = 'none';
                });
            }
        };
        var init = function() {
            that.bindDOM();
        }
        init();
        return that;
    }()
}
