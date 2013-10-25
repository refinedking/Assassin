/**
 * Created by JetBrains WebStorm.
 * User: hqj
 * Date: 12-3-15
 * Time: 下午2:04
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'game.main'
).requires(
    'impact.game',
    'impact.collision-map',
    'impact.background-map',
    'game.levels.untitled',
    'game.levels.untitled2',
    'game.levels.untitled3',
    'game.levels.untitled4',
    'game.levels.untitled5',
    'game.levels.untitled6',
    'game.levels.untitled7',
    'plugins.camera',
    'plugins.button',
    'impact.debug.debug',
    // TODO 修正数据库访问
    'plugins.impact-splash-loader',
    'game.entities.player',
    'game.entities.test-tube',
    'game.entities.weapon',
    'game.entities.blood',
    'game.entities.crate',
    'game.entities.debris',
    'game.entities.deep',
    'game.entities.delay',
    'game.entities.earthquake',
    'game.entities.electric',
    'game.entities.fallout',
    'game.entities.fan',
    'game.entities.fireBunker',
    'game.entities.firePool',
    'game.entities.grenadiers',
    'game.entities.hematinic',
    'game.entities.hurt',
    'game.entities.levelchange',
    'game.entities.mine',
    'game.entities.mover',
    'game.entities.officer',
    'game.entities.oilDrum',
    'game.entities.panzer',
    'game.entities.patrolGrenadiers',
    'game.entities.soldier',
    'game.entities.spiked',
    'game.entities.telegraph',
    'game.entities.test-tube',
    'game.entities.trigger',
    'game.entities.void',
    'game.entities.waterPool',
    'game.entities.weapon'
).defines(function () {
    MyGame = ig.Game.extend({
        // 绘制每帧前清除屏幕的颜色
        clearColor:'#0d0c0b',
        // 游戏世界的重力
        gravity:360,
        // 定义玩家对象
        player:null,
        mode:0,
        // 复活点
        lastCheckpoint:null,
        //玩家复活的位置
        playerSpawnPos:{x:0, y:0},
        // 死亡次数
        deathCount:0,
        // 每关获得的杀敌数
        killCount:0,
        // 过关时间
        levelTime:null,
        levelTimeText:'0',
        backMusic:new ig.Sound('media/sounds/backmusic.ogg', true),
        //font:new ig.Font('media/04b03.font.png'),
        // 相机对象
        camera:null,
        // 最后一帧与当前的时间差
        lastTick:0.016,
        //
        realTime:0,
        // 是否显示游戏动画帧数
        showFPS:false,
        pausing:false,
        paused:false,
        pauseButton:null,
        pauseMusic:null,
        isPauseMusic:false,
        nextLevel:null,
        //关卡名字
        chooseLevel:null,
        weapon:0,
        sendLevel:false,
        init:function () {
            this.weapon = playerWeapon;
            this.chooseLevel = playLevel;
            // Bind keys
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
            ig.input.bind(ig.KEY.X, 'jump');
            ig.input.bind(ig.KEY.C, 'shoot');
            ig.input.bind(ig.KEY.MOUSE1, "click");
            ig.input.bind(ig.KEY.SPACE, "pause");
            //绑定按钮
            //this.scanf = new Scanf();
            this.camera = new Camera(ig.system.width / 4, ig.system.height / 3, 5);
            this.camera.trap.size.x = ig.system.width / 10;
            this.camera.trap.size.y = ig.system.height / 3;
            this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width / 6 : 0;

            ig.music.volume = 1.0;
            ig.music.add(this.backMusic);
            ig.music.play();
            this.loadLevel(this.chooseLevel);
            this.realTime = Date.now();
            this.lastTick = 0.016;
        },
        loadLevel:function (level) {
            this.parent(level);
            this.player = this.getEntitiesByType(EntityPlayer)[0];

            //绘制暂停游戏按钮
            this.drawPauseButton();
            //绘制静音按钮
            this.drawPauseMusic();
            //绘制返回按钮
            this.drawBackButton();
            //绘制人物头像
            ig.game.spawnEntity(EntityBlood, 0, 0);
            //绘制武器图像
            ig.game.spawnEntity(EntityWeapon, 0, 0);
            //this.drawButton();
            this.lastCheckpoint = null;
            // 记录玩家首次出现位置
            this.playerSpawnPos = {x:this.player.pos.x, y:this.player.pos.y};
            this.deathCount = 0;
            this.killCount = 0;
            this.levelTime = new ig.Timer();
            this.mode = MyGame.MODE.GAME;
            this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
            this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
            this.camera.set(this.player);

            // 如果是手机，使用预加载提高性能
            if (ig.ua.mobile) {
                for (var i = 0; i < this.backgroundMaps.length; i++) {
                    this.backgroundMaps[i].preRender = true;
                }
            }

        },
        endLevel:function (nextLevel) {
            if(nextLevel == null){
                // TODO 游戏结束绘制
                this.mode = MyGame.MODE.GAMEOVER;
            }

            //判断boss是否死亡，如果死亡就进入下一关
            var boss = ig.game.getEntityByName("BOSS");
            if (!boss) {
                this.nextLevel = nextLevel;
                this.levelTimeText = this.levelTime.delta().round(2).toString();
                this.mode = MyGame.MODE.STATS;

                // TODO 在这里需要将用户的游戏状态保存
                this.sendLevel = false;
                //storage.set(this.nextLevel,true);
                if(!this.sendLevel)
                {
                    nowLevel++;
                    //storage.set(this.nextLevel,true);
                    //new DatabaseUpdateLevel(nowLevel,userQQ);
                    this.sendLevel = true;
                }
            }
        },
        respawnPlayerAtLastCheckpoint:function (x, y)//复活
        {
            var pos = this.playerSpawnPos;
            if (this.lastCheckpoint) {
                pos = this.lastCheckpoint.getSpawnPos();
                this.lastCheckpoint.currentAnim = this.lastCheckpoint.anims.respawn.rewind();
            }
            this.player = this.spawnEntity(EntityPlayer, pos.x, pos.y);
            this.player.currentAnim = this.player.anims.spawn;
            this.deathCount++;
        },
        update:function () {
            if (!ig.input.state('pause') && this.pausing) {
                this.pausing = false;
            }

            if (ig.input.state("pause")) {
                if (!this.pausing) {
                    this.paused = (this.paused) ? false : true;
                    this.pausing = true;
                }

            }
            if (this.paused) {
                this.pauseButton.currentAnim = this.pauseButton.anims.active;
                this.pauseButton.update();
                this.pauseButton.draw();
            } else {
                this.pauseButton.currentAnim = this.pauseButton.anims.idle;
                // 让相机跟这player走
                this.camera.follow(this.player);
                this.parent();
            }
        },
        draw:function () {
            this.parent();
            this.camera.draw();
            var blood = this.player.health;
            //90,60左上点坐标;blood剩余血量;200总血量;(100,16)宽高
            this.drawBlood(90, 60, blood, 200, 100, 16);

            var count = this.player.projectileCount;

            if (count == -1) {
                count = "100000";
            }

            this.drawWeapon(count, 110, 110);
            if (this.showFPS) {
                ig.system.context.fillText((1 / this.lastTick).round(), 4, 4);
            }
        },
        run:function () {
            var now = Date.now();
            this.lastTick = this.lastTick * 0.9 + ((now - this.realTime) / 1000) * 0.1;
            this.realTime = now;
            if (this.mode == MyGame.MODE.GAME) {
                this.update();
                this.draw();
            }
            else if (this.mode == MyGame.MODE.STATS) {
                this.showStats();
            }
            else if (this.mode == MyGame.MODE.GAMEOVER) {
                this.gameOver();
            }
        },
        gameOver:function () {
            if (ig.input.pressed('shoot') || ig.input.pressed('jump')) {
                MyGameTitle.initialized = false;
                ig.system.setGame(MyGameTitle);
                return;
            }
            ig.system.clear(this.clearColor);
            ig.system.context.fillStyle = 'rgb(255,215,0)';
            ig.system.context.fillRect(ig.system.width / 6, 20, ig.system.width, 150);
            ig.system.context.font = "30px silkscreen";
            ig.system.context.fillStyle = 'rgb(128,128,128)';
            ig.system.context.fillText('Congratulate!', ig.system.width / 3 - 100, 50);
            ig.system.context.fillText('the game is over', ig.system.width / 4, 100);
            ig.system.context.fillText('Do please look forward to', ig.system.width / 4, 150);
            ig.system.context.font = "20px silkscreen";
            ig.system.context.fillText('default weapon: ' + this.getDefaultWeapon(), ig.system.width / 2 - 150, 250);
            ig.system.context.fillText('Time:', ig.system.width / 2 - 150, 280);
            ig.system.context.fillText(this.levelTimeText + 's', ig.system.width / 2, 280);
            ig.system.context.fillText('KILL:', ig.system.width / 2 - 150, 310);
            ig.system.context.fillText(this.killCount + ' enemy', ig.system.width / 2, 310);
            ig.system.context.fillText('Deaths:', ig.system.width / 2 - 150, 340);
            ig.system.context.fillText(this.deathCount.toString(), ig.system.width / 2, 340);
            ig.system.context.fillText('Press X or C to Back', ig.system.width / 2 - 150, 400);
        },
        showStats:function () {
            if (ig.input.pressed('shoot') || ig.input.pressed('jump')) {
                playLevel = this.nextLevel;
                ig.system.setGame(ChooseWeapon);
                return;
            }
            ig.system.clear(this.clearColor);
            ig.system.context.fillStyle = 'rgb(255,215,0)';
            ig.system.context.fillRect(ig.system.width / 4, 20, ig.system.width / 2, 50);
            ig.system.context.font = "30px silkscreen";
            ig.system.context.fillStyle = 'rgb(128,128,128)';
            ig.system.context.fillText('mission complete!', ig.system.width / 2 - 100, 50);

            ig.system.context.font = "20px silkscreen";
            ig.system.context.fillText('default weapon: ' + this.getDefaultWeapon(), ig.system.width / 2 - 150, 150);
            ig.system.context.fillText('Time:', ig.system.width / 2 - 150, 180);
            ig.system.context.fillText(this.levelTimeText + 's', ig.system.width / 2, 180);
            ig.system.context.fillText('KILL:', ig.system.width / 2 - 150, 210);
            ig.system.context.fillText(this.killCount + ' enemy', ig.system.width / 2, 210);
            ig.system.context.fillText('Deaths:', ig.system.width / 2 - 150, 240);
            ig.system.context.fillText(this.deathCount.toString(), ig.system.width / 2, 240);
            ig.system.context.fillText('Press X or C to Proceed', ig.system.width / 2 - 150, 400);
        },

        getDefaultWeapon:function () {
            var defaultWeapon = "";

            switch (this.weapon) {
                case 0:
                    defaultWeapon = "handGun";
                    break;
                case 1:
                    defaultWeapon = "rifle";
                    break;
                case 2:
                    defaultWeapon = "assault";
                    break;
                case 3:
                    defaultWeapon = "shot gun";
                    break;
                case 4:
                    defaultWeapon = "cannonball";
                    break;
                case 5:
                    defaultWeapon = "flame";
                    break;
                case 6:
                    defaultWeapon = "grenade";
                    break;
            }

            return defaultWeapon;
        },

        //绘制血量，参数说明（X,y）左上点坐标，blood剩余血量，health总的血量，width宽，height高
        drawBlood:function (x, y, blood, health, width, height) {
//            ig.system.context.fillRect(100,60,20,10);
            //
            if (blood <= 0) {
                blood = 0;
            }
            ig.system.context.strokeStyle = "#0c212b";
            ig.system.context.strokeRect(x, y, width, height);

            ig.system.context.fillStyle = "#ed1941";
            ig.system.context.fillRect(x, y, blood * width / health, height);
        },

        drawWeapon:function (count, x, y) {
            //
            ig.system.context.font = "12px Arial Black";
            ig.system.context.fillStyle = "#fffffb";
            count = "x" + count;
            ig.system.context.fillText(count, x, y);
        },

        //绘制暂停游戏按钮
        drawPauseButton:function () {
            //向左走button
            this.pauseButton = ig.game.spawnEntity(Button, 100, 500, {
                size:{ x:60, y:60 },
                zIndex:1000,
                location:{x:ig.system.width * 11 / 13, y:ig.system.height / 19},
                animSheet:new ig.AnimationSheet('media/sprites/pauseButton.png', 64, 64),
                pressedUp:function () {
                    if (this.paused) {
                        this.currentAnim = this.anims.idle;
                    } else {
                        this.currentAnim = this.anims.active;
                    }
                },
                pressed:function () {
                },

                pressedDown:function () {
                    ig.game.paused = (ig.game.paused) ? false : true;
                    ig.game.pausing = (ig.game.paused) ? true : false;
                }
            });

        },

        //绘制暂停音乐的按钮
        drawPauseMusic:function () {
            this.pauseMusic = ig.game.spawnEntity(Button, 100, 500, {
                size:{ x:60, y:60 },
                zIndex:1000,
                location:{x:ig.system.width * 10 / 13, y:ig.system.height / 19},
                animSheet:new ig.AnimationSheet('media/sprites/music.png', 64, 64),
                pressedUp:function () {
                    if (this.isPauseMusic) {
                        this.currentAnim = this.anims.active;
                    } else {
                        this.currentAnim = this.anims.idle;
                    }
                },
                pressed:function () {
                },

                pressedDown:function () {

                    if (!this.isPauseMusic) {
                        this.isPauseMusic = true;
                        ig.music.stop();
                        ig.Sound.enabled = false;
                    } else {
                        this.isPauseMusic = false;
                        ig.Sound.enabled = true;
                        ig.music.play();
                    }
                }
            });
        },

        //绘制返回按钮
        drawBackButton:function () {
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:64, y:64 },
                location:{x:ig.system.width * 12 / 13, y:ig.system.height / 19},
                animSheet:new ig.AnimationSheet('media/sprites/backButton.png', 64, 64),

                pressed:function () {

                },
                pressedDown:function () {

                },
                pressedUp:function () {
                    MyGameTitle.initialized = false;
                    ig.system.setGame(MyGameTitle);
                }
            });
        }
    });

    // 选择关卡界面
    ChooseLevel = ig.Game.extend({
        introTimer:null,
        back:new Image(),
        isSpawBtn:false,
        isFirst:false,
        init:function () {
            //ig.system.clear("rgb(0,0,0)");
            this.back.src = 'media/sprites/levelback.jpg';
            this.introTimer = new ig.Timer(0.5);
        },

        spawButton:function () {
            //返回按钮
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:64, y:64 },
                location:{x:850, y:20},
                animSheet:new ig.AnimationSheet('media/sprites/backButton.png', 64, 64),
                pressedUp:function () {
                    MyGameTitle.initialized = false;
                    ig.system.setGame(MyGameTitle);
                }
            });
            //第1关
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:202, y:202 },
                location:{x:50, y:110},
                animSheet:new ig.AnimationSheet('media/sprites/level1.png', 202, 202),
                pressedUp:function () {
                    playLevel = LevelUntitled;
                    //进入武器选择
                    ig.system.setGame(ChooseWeapon);
                }
            });
            //第二关
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:202, y:202 },
                location:{x:267, y:110},
                animSheet:new ig.AnimationSheet('media/sprites/level2.png', 202, 202),
                pressedUp:function () {
                    playLevel = LevelUntitled2;
                    //进入武器选择
                    ig.system.setGame(ChooseWeapon);
                }
            });
            //第三关
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:202, y:202 },
                location:{x:484, y:110},
                animSheet:new ig.AnimationSheet('media/sprites/level3.png', 202, 202),
                pressedUp:function () {
                    playLevel = LevelUntitled3;
                    //进入武器选择
                    ig.system.setGame(ChooseWeapon);
                }
            });

            //第4关
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:202, y:202 },
                location:{x:706, y:110},
                animSheet:new ig.AnimationSheet('media/sprites/level4.png', 202, 202),

                pressedUp:function () {
                    playLevel = LevelUntitled4;
                    //进入武器选择
                    ig.system.setGame(ChooseWeapon);
                }
            });
            //第5关
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:202, y:202 },
                location:{x:50, y:332},
                animSheet:new ig.AnimationSheet('media/sprites/level5.png', 202, 202),

                pressedUp:function () {
                    playLevel = LevelUntitled5;
                    //进入武器选择
                    ig.system.setGame(ChooseWeapon);
                }
            });
            //第6关
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:202, y:202 },
                location:{x:267, y:332},
                animSheet:new ig.AnimationSheet('media/sprites/level6.png', 202, 202),

                pressedUp:function () {
                    playLevel = LevelUntitled6;
                    //进入武器选择
                    ig.system.setGame(ChooseWeapon);
                }
            });
            //第7关
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:202, y:202 },
                location:{x:484, y:332},
                animSheet:new ig.AnimationSheet('media/sprites/level7.png', 202, 202),
                pressedUp:function () {
                    playLevel = LevelUntitled7;
                    //进入武器选择
                    ig.system.setGame(ChooseWeapon);
                }
            });

            //第8关
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:202, y:202 },
                location:{x:706, y:332},
                animSheet:new ig.AnimationSheet('media/sprites/level8.png', 202, 202),
                pressedUp:function () {
                    playLevel = LevelUntitled3;
                    //进入武器选择
                    ig.system.setGame(ChooseWeapon);
                }
            });

        },
        run:function () {
            // TODO 需要更新关卡信息  与数据库交互
            /*
             if(buyWeapon[6].length != null)
             {
             for (var i = 1; i <= buyWeapon[6]; i++) {
             storage.set("Untitled"+i,true);
             }
             nowLevel = buyWeapon[6];
             }
             */

            this.entities = ig.game.getEntitiesByType(Button);

            // TODO 数据库交互
            var key;
            for (var i = 0; i < this.entities.length; i++) {
                if (i >= 1) {
                    if (i == 1) {
                        key = "Untitled";
                    } else {
                        key = "Untitled" + i;
                    }

                    //判断关卡是否可以点击
                    //if (!storage.getBool(key)) {
                        //this.entities[i].state = 'deactive';
                    //}
                }

                this.entities[i].update();
                this.entities[i].draw();
            }

            var d = this.introTimer.delta();
            if (d < 0.1 && d > 0) {
                ig.system.clear("rgb(0,0,0)");
                var ctx = ig.system.context;
                ctx.drawImage(this.back, 0, 0);
                if (!this.isSpawBtn) {
                    this.isSpawBtn = true;
                    this.isFirst = true;
                }
            }

            if (this.isSpawBtn && this.isFirst) {
                this.spawButton();
                this.isFirst = false;
            }
        }
    });

    // 选择武器界面
    ChooseWeapon = ig.Game.extend({
        introTimer:null,
        back:new Image(),
        isSpawBtn:false,
        isFirst:false,
        buttons:[],
        ctx:null,
        weaponCoordinate:null,
        init:function () {
            //清屏
            //ig.system.clear("rgb(0,0,0)");
            this.back.src = 'media/sprites/weaponBack.jpg';
            this.introTimer = new ig.Timer(0.5);
            this.ctx = ig.system.context;

            this.weaponCoordinate = {'0':{x:ig.system.width * 11 / 60, y:ig.system.height / 3 + 65},
                '1':{x:ig.system.width * 3 / 4, y:ig.system.height / 3 + 65},
                '2':{x:ig.system.width * 11 / 60, y:ig.system.height * 2 / 3 + 12},
                '3':{x:ig.system.width * 3 / 4, y:ig.system.height * 2 / 3 + 12},
                '4':{x:ig.system.width * 11 / 60, y:ig.system.height * 11 / 12 + 12},
                '5':{x:ig.system.width * 3 / 4, y:ig.system.height * 11 / 12 + 12}
            };

        },

        spawButton:function () {
            //返回按钮
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:64, y:64 },
                location:{x:ig.system.width * 10 / 11, y:ig.system.height / 16},
                animSheet:new ig.AnimationSheet('media/sprites/backButton.png', 64, 64),

                pressedUp:function () {
                    MyGameTitle.initialized = false;
                    ig.system.setGame(MyGameTitle);
                }
            });
            //步枪
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width / 7 - 32, y:ig.system.height / 5 + 10},
                animSheet:new ig.AnimationSheet('media/sprites/rifleBtn.png', 223, 114),

                pressedUp:function () {
                    //if (buyWeapon[0] == 1) {
                    playerWeapon = WEAPONS.RIFLEGUN;
                    ig.system.setGame(MyGame);
                    //}
                }
            });

            //散弹枪
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width / 7 - 32, y:295},
                animSheet:new ig.AnimationSheet('media/sprites/shotgunBtn.png', 223, 114),

                pressedUp:function () {
                    //判断是否购买了枪
                    //if (buyWeapon[2] == 1) {
                    playerWeapon = WEAPONS.SHOTGUN;
                    ig.system.setGame(MyGame);
                    //}
                }
            });

            //火焰枪
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width / 7 - 32, y:ig.system.height * 7 / 10 + 7},
                animSheet:new ig.AnimationSheet('media/sprites/flamegunBtn.png', 223, 114),

                pressedUp:function () {
                    //if (buyWeapon[4] == 1) {
                    playerWeapon = WEAPONS.FLAME;
                    ig.system.setGame(MyGame);
                    // }
                }
            });

            //手枪
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width / 2 - 110, y:ig.system.height / 5 + 10},
                animSheet:new ig.AnimationSheet('media/sprites/handgunBtn.png', 223, 114),

                pressedUp:function () {
                    playerWeapon = WEAPONS.HANDGUN;
                    ig.system.setGame(MyGame);
                }
            });

            //机枪
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width * 2 / 3, y:ig.system.height / 5 + 10},
                animSheet:new ig.AnimationSheet('media/sprites/assaultBtn.png', 223, 114),

                pressedUp:function () {
                    // if (buyWeapon[1] == 1) {
                    playerWeapon = WEAPONS.ASSAULTGUN;
                    ig.system.setGame(MyGame);
                    // }
                }
            });

            //火箭筒
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width * 2 / 3, y:295},
                animSheet:new ig.AnimationSheet('media/sprites/cannonballBtn.png', 223, 114),

                pressedUp:function () {
                    // if (buyWeapon[3] == 1) {
                    playerWeapon = WEAPONS.CANNONBALL;
                    ig.system.setGame(MyGame);
                    // }
                }
            });

            //手雷
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width * 2 / 3, y:ig.system.height * 7 / 10 + 7},
                animSheet:new ig.AnimationSheet('media/sprites/grenadeBtn.png', 223, 114),

                pressedUp:function () {
                    // if (buyWeapon[5] == 1) {
                    playerWeapon = WEAPONS.GRENADE;
                    ig.system.setGame(MyGame);
                    // }
                }
            });
        },

        run:function () {
            var d = this.introTimer.delta();
            if (d < 0.1 && d > 0) {
                ig.system.clear("rgb(0,0,0)");
                this.ctx.drawImage(this.back, 0, 0);
                if (!this.isSpawBtn) {
                    this.isSpawBtn = true;
                    this.isFirst = true;
                }
            }

            if (this.isSpawBtn && this.isFirst) {
                this.spawButton();
                this.isFirst = false;

            }

            //绘制购买枪的提示
            if (d > 0.1) {

                for (var i = 0; i < 6; i++) {
                    this.ctx.fillStyle = "#121212";
                    this.ctx.fillText("Already Have", this.weaponCoordinate[i].x, this.weaponCoordinate[i].y)
                }
            }

            this.buttons = ig.game.getEntitiesByType(Button);
            for (var i = 0; i < this.buttons.length; i++) {

                this.buttons[i].update();
                this.buttons[i].draw();
            }

        }
    });

    // 买枪界面
    Shop = ig.Game.extend({
        introTimer:null,
        back:new Image(),
        isSpawBtn:false,
        isFirst:false,
        buttons:[],
        ctx:null,
        weaponCoordinate:null,
        init:function () {
            this.back.src = 'media/sprites/shopback.jpg';
            this.introTimer = new ig.Timer(0.5);

            this.ctx = ig.system.context;

            this.weaponCoordinate = {'0':{x:ig.system.width * 11 / 60, y:ig.system.height / 3 + 65},
                '1':{x:ig.system.width * 3 / 4, y:ig.system.height / 3 + 65},
                '2':{x:ig.system.width * 11 / 60, y:ig.system.height * 2 / 3 + 12},
                '3':{x:ig.system.width * 3 / 4, y:ig.system.height * 2 / 3 + 12},
                '4':{x:ig.system.width * 11 / 60, y:ig.system.height * 11 / 12 + 12},
                '5':{x:ig.system.width * 3 / 4, y:ig.system.height * 11 / 12 + 12}
            };

        },

        spawButton:function () {
            //返回按钮
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:64, y:64 },
                location:{x:ig.system.width * 10 / 11, y:ig.system.height / 16},
                animSheet:new ig.AnimationSheet('media/sprites/backButton.png', 64, 64),

                pressedUp:function () {
                    MyGameTitle.initialized = false;
                    ig.system.setGame(MyGameTitle);
                }
            });
            //步枪
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width / 7 - 32, y:ig.system.height / 5 + 10},
                animSheet:new ig.AnimationSheet('media/sprites/rifleBtn.png', 223, 114),

                pressedUp:function () {
                    playerWeapon = WEAPONS.RIFLEGUN;
                    MyGameTitle.initialized = false;
                    ig.system.setGame(MyGameTitle);
                }
            });

            //散弹枪
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width / 7 - 32, y:295},
                animSheet:new ig.AnimationSheet('media/sprites/shotgunBtn.png', 223, 114),

                pressedUp:function () {
                    playerWeapon = WEAPONS.SHOTGUN;
                    MyGameTitle.initialized = false;
                    ig.system.setGame(MyGameTitle);
                }
            });

            //火焰枪
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width / 7 - 32, y:ig.system.height * 7 / 10 + 7},
                animSheet:new ig.AnimationSheet('media/sprites/flamegunBtn.png', 223, 114),

                pressedUp:function () {
                    playerWeapon = WEAPONS.FLAME;
                    MyGameTitle.initialized = false;
                    ig.system.setGame(MyGameTitle);
                }
            });

            //机枪
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width * 2 / 3, y:ig.system.height / 5 + 10},
                animSheet:new ig.AnimationSheet('media/sprites/assaultBtn.png', 223, 114),

                pressedUp:function () {
                    playerWeapon = WEAPONS.ASSAULTGUN;
                    MyGameTitle.initialized = false;
                    ig.system.setGame(MyGameTitle);
                }
            });

            //火箭筒
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width * 2 / 3, y:295},
                animSheet:new ig.AnimationSheet('media/sprites/cannonballBtn.png', 223, 114),

                pressedUp:function () {
                    playerWeapon = WEAPONS.CANNONBALL;
                    MyGameTitle.initialized = false;
                    ig.system.setGame(MyGameTitle);
                }
            });

            //手雷
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:223, y:114 },
                offset:{x:0, y:0},
                location:{x:ig.system.width * 2 / 3, y:ig.system.height * 7 / 10 + 7},
                animSheet:new ig.AnimationSheet('media/sprites/grenadeBtn.png', 223, 114),

                pressedUp:function () {
                    playerWeapon = WEAPONS.GRENADE;
                    MyGameTitle.initialized = false;
                    ig.system.setGame(MyGameTitle);
                }
            });
        },
        run:function () {
            var d = this.introTimer.delta();
            if (d < 0.1 && d > 0) {
                ig.system.clear("rgb(0,0,0)");
                var ctx = ig.system.context;
                ctx.drawImage(this.back, 0, 0);
                if (!this.isSpawBtn) {
                    this.isSpawBtn = true;
                    this.isFirst = true;
                }
            }

            if (this.isSpawBtn && this.isFirst) {
                this.spawButton();
                this.isFirst = false;
            }


            //绘制购买枪的提示
            if (d > 0.1) {

                for (var i = 0; i < 6; i++) {
                    this.ctx.fillStyle = "#121212";
                    this.ctx.fillText("Already Have", this.weaponCoordinate[i].x, this.weaponCoordinate[i].y)
                }
            }

            this.buttons = ig.game.getEntitiesByType(Button);
            for (var i = 0; i < this.buttons.length; i++) {

                this.buttons[i].update();
                this.buttons[i].draw();
            }

        }
    });

    // 游戏状态对象
    MyGameTitle = ig.Game.extend({
        introTimer:null,
        back:new Image(),
        isSpawBtn:false,
        isFirst:false,
        init:function () {
            if (!MyGameTitle.initialized) {
                ig.system.clear("rgb(0,0,0)");
                this.back.src = 'media/sprites/menuback.jpg';
                ig.input.bind(ig.KEY.MOUSE1, 'click');
                ig.input.bind(ig.KEY.SPACE, 'jump');

                MyGameTitle.initialized = true;
            }
            this.introTimer = new ig.Timer(0.5);
        },
        spawButton:function () {
            //开始游戏按钮
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:191, y:115 },
                location:{x:130, y:455},
                animSheet:new ig.AnimationSheet('media/sprites/start.png', 191, 115),
                pressedUp:function () {
                    ig.system.setGame(ChooseWeapon);
                }
            });

            //关卡选择按钮
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:291, y:115 },
                location:{x:330, y:455},
                animSheet:new ig.AnimationSheet('media/sprites/chooselevel.png', 291, 115),
                pressedUp:function () {
                    ig.system.setGame(ChooseLevel);
                }
            });

            //购买武器按钮
            ig.game.spawnEntity(Button, 400, 500, {
                size:{ x:204, y:115 },
                location:{x:630, y:455},
                animSheet:new ig.AnimationSheet('media/sprites/buygun.png', 204, 115),
                pressedUp:function () {
                    ig.system.setGame(Shop);
                }
            });
        },

        run:function () {
            // TODO 这是需要数据库加载完毕才可以运行,否则可能出异常
            this.entities = ig.game.getEntitiesByType(Button);
            for (var i = 0; i < this.entities.length; i++) {
                this.entities[i].update();
                this.entities[i].draw();
            }
            var d = this.introTimer.delta();
            if (d < 0.1 && d > 0) {
                ig.system.clear("rgb(0,0,0)");
                var ctx = ig.system.context;
                ctx.drawImage(this.back, 0, 0);
                if (!this.isSpawBtn) {
                    this.isSpawBtn = true;
                    this.isFirst = true;
                }
            }
            if (this.isSpawBtn && this.isFirst) {
                this.spawButton();
                this.isFirst = false;
            }
        }
    });

    MyGameTitle.initialized = false;
    ig.Sound.use = [ig.Sound.FORMAT.MP3, ig.Sound.FORMAT.OGG];
    MyGame.MODE = {GAME:1, STATS:2, GAMEOVER:3};
    //所有的枪
    WEAPONS = {HANDGUN:0, RIFLEGUN:1, ASSAULTGUN:2, SHOTGUN:3, CANNONBALL:4, FLAME:5, GRENADE:6};
    //player默认使用的枪
    playerWeapon = 0;
    // 默认关卡
    playLevel = LevelUntitled;
    nowLevel = 1;
    // 手机加速
    if (ig.ua.mobile) {
        ig.Sound.enabled = false;
    }

    // TODO 本地存储需要改变
    //本地数据存储对象
    //storage = new ig.Storage();
    //storage.set("Untitled", true);

    //存储从数据库查询的买枪记录,从左到右为分别为rifle，assault，shotgun，cannonball，flame，grenade
    //buyWeapon = null;

    ig.main('#canvas', MyGameTitle, 60, 960, 640, 1, ig.ImpactSplashLoader);
});