ig.module(
    'game.entities.debris'
).requires(
    'impact.entity',
    'interface.laserProjectile',
    'interface.grenadeProjectile',
    'interface.soldierProjectile'
).defines(function () {
        EntityDebris = ig.Entity.extend(
            {
                _wmScalable:true,
                _wmDrawBox:true,
                _wmBoxColor:'rgba(255, 170, 66, 0.7)',
                size:{x:8, y:8},
                duration:5,
                durationTimer:null,
                isSpawnBoss:false,
                init:function (x, y, settings) {
                    this.parent(x, y, settings);
                    this.durationTimer = new ig.Timer();
                },
                triggeredBy:function (entity, trigger) {
                    this.durationTimer.set(this.duration);
                },
                update:function () {
                    if (this.durationTimer.delta() < 0 && !this.isSpawnBoss) {
                        var x = ig.game.player.pos.x + 600;
                        var y = ig.game.player.pos.y - 150;

                        ig.game.spawnEntity(EntityTankBoss, x, y);
                        this.isSpawnBoss = true;

                    }
                }
            });
        EntityTankBoss = EntityEnemy.extend({
            //大小
            size:{x:326, y:240},
            //偏移量
            offset:{x:173, y:230},
            vel:{x:0, y:0},
            //射程是全屏
            shootRange:900,
            //伤害
            damage:50,
            shootTimer:null,
            //设置自身的type
            type:ig.Entity.TYPE.B,
            //设置敌方的type
            checkAgainst:ig.Entity.TYPE.A,
            collides:ig.Entity.COLLIDES.PASSIVE,
            //每次发射子弹的个数
            health:5000,
            //两次发射的时间间隔
            time:2,
            find:{x:900, y:500},
            isLaser:true,
            isProjectile:false,
            isGrenade:false,
            projectileCount:0,
            projectileNum:20,

            //发射的激光个数和总数
            laserNum:3,
            laserCount:0,

            //发射的手雷总数和个数
            grenadeNum:3,
            grenadeCount:0,

            friction:{x:100, y:100},
            zIndex:10000,


            animSheet:new ig.AnimationSheet('media/sprites/tankBoss.png', 672, 672),

            init:function (x, y, settings) {
                this.parent(x, y, settings);
                //初始状态
                this.addAnim('idle', 0.5, [0, 1, 2, 3, 4, 5], true);
                //射击状,
                this.addAnim('shoot', 0.5, [5]);
                this.addAnim('run', 0.5, [10, 11]);
                //死亡状态
                this.addAnim('dea', 0.2, [6, 7, 8, 9, 9, 9, 9, 9]);
                this.currentAnim.flip.x = false;
                this.shootTimer = new ig.Timer();
                this.flip = false;
            },

            update:function () {
                player = ig.game.getEntitiesByType(EntityPlayer)[0];
                if (player) {
                    this.findPalyer();

                    if (this.currentAnim == this.anims.dea) {
                        this.currentAnim.flip.x = (this.xdir < 0);
                        this.currentAnim.update();
                        if (this.currentAnim.loopCount) {
                            ig.game.killCount++;
                            this.kill();
                        }
                        this.parent();
                        return;
                    }


                    if (this.seenPlayer && this.shootTimer.delta() > 0 && this.xdist <= this.find.x) {
                        this.currentAnim = this.anims.shoot;
                        this.shoot();
                    }

                    /*
                     if(this.health<= 200){
                     this.currentAnim = this.anims.run;
                     this.vel.x = -100;
                     }
                     */
                }

                this.parent();
            },

            shoot:function () {

                if (this.isLaser && !this.isProjectile && !this.isGrenade) {

                    //设置子弹产生的位置
                    var x = this.pos.x + (this.xdir > 0 ? 0 : -110);
                    var y = this.pos.y + 180;
                    ig.game.spawnEntity(EntityLaserParjectile, x, y, {flip:(this.xdir < 0 ? 1 : 0)});
                    if (this.laserCount >= this.laserNum - 1) {
                        this.isLaser = false;
                        this.isProjectile = true;
                        this.laserCount = 0;
                        this.shootTimer.set(2);
                    } else {
                        this.shootTimer.set(0.5);
                        this.laserCount++;
                    }
                } else if (!this.isLaser && this.isProjectile && !this.isGrenade) { //设置子弹产生的位置
                    var x = this.pos.x + (this.xdir > 0 ? 0 : -30);
                    var y = this.pos.y + 57;
                    ig.game.spawnEntity(EntitySoldierProjectile, x, y, {flip:(this.xdir < 0 ? 1 : 0)});
                    if (this.projectileCount < this.projectileNum - 1) {
                        this.shootTimer.set(0.1);
                        this.projectileCount++;
                    }
                    else {
                        this.isProjectile = false;
                        this.isGrenade = true;
                        this.shootTimer.set(2);
                        this.projectileCount = 0;
                    }
                } else if (!this.isLaser && !this.isProjectile && this.isGrenade) {

                    var x = this.pos.x + (this.xdir > 0 ? 0 : 110);
                    var y = this.pos.y;
                    var vel = null;
                    switch (Math.random() * 3) {
                        case 0:
                            vel = {x:250 * -this.xdir, y:-300};
                            break;
                        case 1:
                            vel = {x:300 * -this.xdir, y:-300};
                            break;
                        case 2:
                            vel = {x:200 * -this.xdir, y:-300};
                            break;

                    }
                    ig.game.spawnEntity(EntityGrenadeProjectile, x, y, {flip:(this.xdir > 0 ? 1 : 0), vel:vel});
                    if (this.grenadeCount >= this.grenadeNum - 1) {
                        this.isLaser = true;
                        this.isGrenade = false;
                        this.grenadeCount = 0;
                        this.currentAnim = this.anims.idle.rewind();
                        this.currentAnim.update();
                        this.shootTimer.set(3);
                    } else {
                        this.shootTimer.set(0.3);
                        this.grenadeCount++;

                    }
                }
            },

            receiveDamage:function (amount, from) {
                if (this.health > 0) {
//                    this.anims.hit.flip.x = this.currentAnim.flip.x;
                    //this.seenPlayer = true;

                    this.health -= amount;
                    if (this.health <= 0) {
                        this.checkAgainst = ig.Entity.TYPE.NONE;
                        this.type = ig.Entity.TYPE.NONE;
                        this.collides = ig.Entity.COLLIDES.NEVER,
                            this.currentAnim = this.anims.dea.rewind();
                    }
                    // this.currentAnim.update();
                }
            },

            //当和该对象发生动态碰撞时调用
            check:function (other) {
                //移除血量
                other.receiveDamage(this.damage, this);
            }
        });
    });