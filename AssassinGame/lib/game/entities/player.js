/**
 * Content: 玩家实体类
 * User: wangbing
 * Date: 12-3-21
 * CreateTime: a.m 10:04
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.player'
).requires(
    'impact.entity',
    'impact.sound',
    'interface.playerProjectile',
    'interface.flameProjectile',
    'interface.shotgunProjectile'
).defines(function () {
        EntityPlayer = ig.Entity.extend({
            animSheetdefine:new ig.AnimationSheet('media/sprites/player_handgun.png', 96, 96), //定义玩家动画
//            sfxPlasma:new ig.Sound('media/sounds/plasma.ogg'),
//            sfxDie:new ig.Sound('media/sounds/die-respawn.ogg',false),
            size:{x:48, y:84}, //定义玩家的碰撞宽和高
            defineOffset:{x:25, y:6}, //定义偏移值
            type:ig.Entity.TYPE.A, //玩家碰撞类型为A类
            checkAgainst:ig.Entity.TYPE.NONE, //定义碰撞检测为无
            collides:ig.Entity.COLLIDES.PASSIVE, //定义为被动碰撞
            flip:false, // 定义翻转状态，false为向右
            maxVel:{x:200, y:400}, //定义x\y的最大速度
            accelDef:{ground:400, air:500}, //定义地面和空中的加速度
            frictionDef:{ground:600, air:50}, //定义地面和空中的摩擦力
            wasStanding:false, //定义玩家是否是站着
            canHighJump:false, //定义离地标志
            highJumpTimer:null, //定义一个跳跃的时间
            idleTimer:null, //定义一个休息的时间
            bulletTimer:null, //定义一个休息的时间
            firstTimer:null,

            flippedAnimOffset:24, // 翻转之后的偏移量
            bounciness:0, //定义玩家与碰撞层碰撞时无反弹
            jump:150, //定义起跳初速度
            health:200, // 玩家的健康值
            borthTimer:null,
            dieTimer:null,
            isHit:true,
            isDie:false,
            zIndex:10000,
            bfirst:false,
            projectileClass:null,
            projectileClassdefine:null,
            projectileCount:-1,
            action:{left:false, right:false, jump:false, shoot:false},
            handGunMusic:null,
            spawnTimer:null,
            //默认武器
            weapon:0,
            playerAnimSheet:null,
            weaponList:{},
            
            fanJump:false,
            
            init:function (x, y, settings) {
                if (ig.game.weapon) {
                    this.weapon = ig.game.weapon;
                }
                this.weaponList = new Array();
                this.playerAnimSheet = new Array();
                this.playerAnimSheet = [new ig.AnimationSheet('media/sprites/player_handgun.png', 96, 96), new ig.AnimationSheet('media/sprites/player_rifle.png', 96, 96), new ig.AnimationSheet('media/sprites/player_assault.png', 108, 108), new ig.AnimationSheet('media/sprites/player_shotgun.png', 118, 118), new ig.AnimationSheet('media/sprites/player_rockgun.png', 118, 118), new ig.AnimationSheet('media/sprites/player_flam.png', 108, 108), new ig.AnimationSheet('media/sprites/player_grenade.png', 96, 96)];
                this.weaponList = [EntityPlayerProjectile, EntityRifleProjectile, EntityAssaultProjectile, EntityShotgunProjectile, EntityCannonballProjectile, EntityFlameProjectile, EntityPlayerGrenadeProjectile];

                this.setWeapon();

                this.parent(x, y, settings);
                this.friction.y = 0;//玩家y轴摩擦力为零
                this.setupAnimation();//加载玩家动画
                this.idleTimer = new ig.Timer(); //初始化时间参数
                this.bulletTimer = new ig.Timer();
                this.bulletTimer.set(0.3);
                this.highJumpTimer = new ig.Timer();
                this.borthTimer = new ig.Timer(0);
                this.spawnTimer = new ig.Timer();
                this.firstTimer = new ig.Timer(0.2);
                this.spawnTimer.set(3);
//                ig.music.volume=0.9;
//                ig.music.add(this.musicBiochemie);
                //bfirst = true;
            },

            //设置武器
            setWeapon:function () {
                this.projectileClassdefine = this.weaponList[this.weapon];
                this.animSheetdefine = this.playerAnimSheet[this.weapon];

                if (this.weapon == 3 || this.weapon == 4) {
                    this.offset = {x:35, y:25};
                } else if (this.weapon == 2 || this.weapon == 5) {
                    this.offset = {x:30, y:15};
                } else if (this.weapon == 6 || this.weapon == 1) {
                    this.offset = {x:25, y:4};
                } else {
                    this.offset = this.defineOffset;
                }
                this.animSheet = this.animSheetdefine;
                this.projectileClass = this.projectileClassdefine;
            },
            // 安装动画
            setupAnimation:function () {


                this.addAnim('idle', 1, [7, 8]);  // 玩家休闲的动作
                this.addAnim('run', .2, [18, 19, 20, 21]);  // 玩家运动的动作
                this.addAnim('jump', 0.3, [10], true);  // 玩家跳跃的动作
                this.addAnim('fall', 0.4, [11], true);    // 玩家下落的动作
                this.addAnim('die', 0.2, [0, 1, 2, 3, 4, 5, 4, 5, 4, 5], true); // 玩家死亡倒地的动作
                this.addAnim('squat', 0.04, [2], true);
                this.addAnim('hit', 0.4, [15, 16]);
                this.addAnim('spawn', 0.07, [7, 22, 8, 22, 7, 22, 8], true);
                this.addAnim('shoot', 0.1, [13, 14, 14, 14], true);

            },
            // 更新玩家实体的方法
            update:function () {
                //this.moved = false;



                if (this.dieTimer) {
                    if (this.dieTimer.delta() >= 2)
                        this.kill();
                    else {
                        this.currentAnim = this.anims.die;
                    }
                } else {
                    //根据玩家的站立情况赋予x轴的摩擦力
                    this.friction.x = this.standing ? this.frictionDef.ground : this.frictionDef.air;
                    //当用户按下左键时
                    if (ig.input.state('left') || this.action.left) {//
                        //x轴赋予对应加速度
                        this.accel.x = -(this.standing ? this.accelDef.ground : this.accelDef.air);
                        //翻转标志为真
                        this.flip = true;
                    }
                    //当用户按下右键时
                    else if (ig.input.state('right') || this.action.right) {//
                        //x轴赋予对应加速度
                        this.accel.x = (this.standing ? this.accelDef.ground : this.accelDef.air);
                        //翻转标志为假
                        this.flip = false;
                    }
                    else {
                        //无按键x轴对应加速度为零
                        this.accel.x = 0;
                    }

                    // 准备起跳标志
                    this.wantsJump = this.wantsJump || ig.input.pressed('jump') || this.action.jump;//
                    // 判断用户是否在地上时按下起跳建//
                    if (this.standing && ((ig.input.pressed('jump') || this.action.jump) || (!this.wasStanding && this.wantsJump && ig.input.state('jump')))) {
                            // 准备起跳为假
                            this.wantsJump = false;
                            this.standing = true;
                            //离地标志为真
                            this.canHighJump = true;
                            //设置上升时间为0.34秒
                            this.highJumpTimer.set(0.35);
                            //赋予玩家向上的初速度
                            this.vel.y = -this.jump;
                    }
                    //起跳过程处理
                    else if (this.canHighJump) {
                        var d = this.highJumpTimer.delta();//得到当前时间差
                        if ((ig.input.state('jump') || this.action.jump) && d < -0.04) {//
                            this.vel.y -= this.jump;// 保持0.3秒的向上加速度
                        }
                        else if ((ig.input.state('jump') || this.action.jump) && -0.04 < d < 0.11) {//
                            this.vel.y += this.jump * 6;// 保持0.15秒的向下加速度
                        }
                        if (d > 0.11) {
                            this.canHighJump = false;
                            this.vel.y = 0;
                        }
                    }

                    if(this.fanJump)
                    {
                        this.vel.y -= 700;// 保持0.3秒的向上加速度
                        this.fanJump = false;
                    }

                    //射击
                    if (ig.input.pressed('shoot')) {
                        this.bulletTimer.set(0.3);

                        if (this.firstTimer.delta() > 0) {
                            this.bfirst = true;

                            this.firstTimer.reset();
                        }
                    }
                    if (ig.input.state('shoot') || this.action.shoot) {//
                        // 获取子弹初始位置
                        var x = this.pos.x;
                        var y = this.pos.y;
                        var dl = this.bulletTimer.delta();
                        var shootCount = 0;
                        var projectile = null;
                        // 发射子弹
                        if (this.bfirst || (this.isHit && dl > 0)) {
                            if (this.projectileCount == -1) {

                                if (this.projectileClass == EntityFlameProjectile) {
                                    x = this.pos.x + (this.flip ? -400 : 70);
                                    y = this.pos.y + 4;
                                    projectile = ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, gravityFactor:0});
                                    this.handGunMusic = projectile.projectMusic;
                                    this.handGunMusic.play();
                                }
                                else if (this.projectileClass == EntityShotgunProjectile) {
                                    x = this.pos.x + (this.flip ? -25 : 63);
                                    y = this.pos.y + 21;
                                    for (var i = 0; i < 3; i++) {
                                        projectile = ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, gravityFactor:0, shootCount:i});
                                    }
                                    this.handGunMusic = projectile.projectMusic;

                                    this.handGunMusic.play();
                                } else if (this.projectileClass == EntityPlayerGrenadeProjectile) {
                                    x = this.pos.x + (this.flip ? -10 : 10);
                                    y = this.pos.y;
                                    ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, shootCount:i});

                                } else if (this.projectileClass == EntityAssaultProjectile) {
                                    x = this.pos.x + (this.flip ? -25 : 60);
                                    y = this.pos.y + 30;
                                    this.bulletTimer.set(0.1);
                                    projectile = ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, gravityFactor:0});
                                    this.handGunMusic = projectile.projectMusic;
                                    this.handGunMusic.play();
                                } else if (this.projectileClass == EntityRifleProjectile) {
                                    x = this.pos.x + (this.flip ? 0 : 48);
                                    y = this.pos.y + 30;
                                    projectile = ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, gravityFactor:0});
                                    this.handGunMusic = projectile.projectMusic;

                                    this.handGunMusic.play();
                                } else if (this.projectileClass == EntityCannonballProjectile) {
                                    x = this.pos.x + (this.flip ? -28 : 63);
                                    y = this.pos.y + 17;
                                    projectile = ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, gravityFactor:0});

                                } else {
                                    x = this.pos.x + (this.flip ? 0 : 33);
                                    y = this.pos.y + 30;
                                    projectile = ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, gravityFactor:0});
                                    this.handGunMusic = projectile.projectMusic;
                                    this.handGunMusic.play();
                                }
                            }
                            else if (this.projectileClass == EntityFlameProjectile && this.projectileCount > 0) {
                                x = this.pos.x + (this.flip ? -400 : 70);
                                y = this.pos.y + 4;
                                projectile = ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, gravityFactor:0});
                                this.handGunMusic = projectile.projectMusic;
                                this.projectileCount--;
                                if (this.projectileCount == 0) {
                                    this.projectileCount = -1;
                                    this.setWeapon();
                                    this.setupAnimation();
                                }
                                this.handGunMusic.play();
                            }
                            else if (this.projectileClass == EntityShotgunProjectile && this.projectileCount > 0) {
                                x = this.pos.x + (this.flip ? -25 : 63);
                                y = this.pos.y + 21;
                                for (var i = 0; i < 3; i++) {
                                    projectile = ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, gravityFactor:0, shootCount:i});
                                }
                                this.handGunMusic = projectile.projectMusic;

                                this.projectileCount--;
                                if (this.projectileCount == 0) {
                                    this.projectileCount = -1;
                                    this.setWeapon();
                                    this.setupAnimation();
                                }
                                this.handGunMusic.play();
                            } else if (this.projectileClass == EntityPlayerGrenadeProjectile && this.projectileCount > 0) {
                                x = this.pos.x + (this.flip ? -10 : 10);
                                y = this.pos.y;
                                ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, shootCount:i});

                                this.projectileCount--;
                                if (this.projectileCount == 0) {
                                    this.projectileCount = -1;
                                    this.setWeapon();
                                    this.setupAnimation();
                                }
                            } else if (this.projectileClass == EntityAssaultProjectile && this.projectileCount > 0) {
                                x = this.pos.x + (this.flip ? -25 : 60);
                                y = this.pos.y + 30;
                                this.bulletTimer.set(0.1);
                                projectile = ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, gravityFactor:0});
                                this.handGunMusic = projectile.projectMusic;
                                this.projectileCount--;
                                if (this.projectileCount == 0) {
                                    this.projectileCount = -1;
                                    this.bulletTimer.set(0.3);
                                    this.setWeapon();
                                    this.setupAnimation();
                                }
                                this.handGunMusic.play();
                            } else if (this.projectileClass == EntityRifleProjectile && this.projectileCount > 0) {
                                x = this.pos.x + (this.flip ? 0 : 48);
                                y = this.pos.y + 30;
                                projectile = ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, gravityFactor:0});
                                this.handGunMusic = projectile.projectMusic;

                                this.projectileCount--;
                                if (this.projectileCount == 0) {
                                    this.projectileCount = -1;
                                    this.bulletTimer.set(0.3);
                                    this.setWeapon();
                                    this.setupAnimation();
                                }
                                this.handGunMusic.play();
                            } else if (this.projectileClass == EntityCannonballProjectile && this.projectileCount > 0) {
                                x = this.pos.x + (this.flip ? -28 : 63);
                                y = this.pos.y + 17;
                                ig.game.spawnEntity(this.projectileClass, x, y, {flip:this.flip, gravityFactor:0});

                                this.projectileCount--;
                                if (this.projectileCount == 0) {
                                    this.projectileCount = -1;
                                    this.bulletTimer.set(0.3);
                                    this.setWeapon();
                                    this.setupAnimation();
                                }
                            }
                            this.currentAnim = this.anims.shoot.rewind();
                            this.bfirst = false;
                            this.bulletTimer.reset();
                        }
                    }

                    this.wasStanding = this.standing;
                    //速度是向上的，显示跳
                    if (this.vel.y < 0) {
                        this.currentAnim = this.anims.jump;
                    }
                    //速度是向下的，显示下落
                    else if (this.vel.y > 0 && this.currentAnim != this.anims.spawn) {
                        this.currentAnim.update();
                        this.currentAnim = this.anims.fall;
                    }
                    else if (this.vel.x != 0) {
                        this.currentAnim = this.anims.run;
                    }
                    else if (this.currentAnim == this.anims.spawn && this.spawnTimer.delta() >= 0) {
                        this.currentAnim = this.anims.idle;

                    } else if (this.currentAnim == this.anims.shoot && this.currentAnim.loopCount) {
                        this.currentAnim = this.anims.idle;
                    }
                    else if (this.currentAnim != this.anims.spawn && this.currentAnim != this.anims.shoot) {
                        this.currentAnim = this.anims.idle;
                    }
                    this.currentAnim.flip.x = this.flip;
                }

                this.parent();
            },
            receiveDamage:function (amount, from) {

                if (this.borthTimer.delta() < 3) {
                    this.isHit = false;
                    //this.dieTimer.reset();
                    //ig.log("ok");
                } else {
                    this.isHit = true;
                }
                if ((!this.isDie && this.currentAnim != this.anims.die && this.isHit && this.borthTimer.delta() >= 3) || from instanceof EntityHurt) {
                    //this.currentAnim = this.anims.die.rewind();
                    this.health = this.health - amount;
                    //this.parent(amount);
                    //this.isHit = true;
                    if (this.health > 0) {
                        this.currentAnim = this.anims.hit.rewind();
                    } else {
                        if (!this.isDie) {
                            this.currentAnim = this.anims.die.rewind();
                            this.isDie = true;
                            this.type = ig.Entity.TYPE.NONE;
                            this.dieTimer = new ig.Timer();
                            this.vel.x = 0;

                            if (from instanceof EntityHurt) {
                                this.vel.x = (this.currentAnim.flip.x ? -1 : 1) * 50;
                                this.vel.y = -200;
                            }
                        }
                    }
                }
                //this.parent(amount,from);
            },
            // 玩家被杀,重回到重生点
            kill:function () {
                //this.currentAnim = this.anims.die.rewind();
                if (this.dieTimer && this.dieTimer.delta() >= 2) {
                    this.parent();
                    ig.game.respawnPlayerAtLastCheckpoint(this.pos.x, this.pos.y);
                }
            }
        });
    });