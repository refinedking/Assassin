/**
 * Content: 敌人军官实体
 * User: ws
 * Date: 12-3-21
 * Time: 下午12:46
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.officer'
).requires(
    'interface.officerProjectile'
).defines(function () {
        EntityOfficer = ig.Entity.extend({
            //大小
            size:{x:48, y:90},
            //偏移量
            offset:{x:24, y:2},
            //定义x\y的最大速度
            maxVel:{x:220, y:500},
            //定义地面和空中的加速度
            accelDef:{ground:400, air:500},
            //定义地面和空中的摩擦力
            frictionDef:{ground:500, air:50},
            //射程是全屏
            shootRange:900,
            //伤害
            damage:40,
            shootTimer:2,
            shootWaitTimer:null,
            //子弹
            projectileClass:null,
            //连续发射子弹的个数
            projectileNum:2,
            //起跳速度
            jump:-150,
            //生命值
            health:80,
            projectileCount:0,
            time:2,
            //设置自身的type
            type:ig.Entity.TYPE.B,
            //设置敌方的type
            checkAgainst:ig.Entity.TYPE.A,
            collides:ig.Entity.COLLIDES.PASSIVE,
            //子弹类
            projectileClass:null,
            //判断player的大概位置（左右）
            xDirection:0,
            hitNum:0,
            animSheet:new ig.AnimationSheet("media/sprites/officer.png", 96, 96),
            model:0,
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                if (this.model == 1) {
                    this.animSheet = new ig.AnimationSheet('media/sprites/officer2.png', 96, 96);
                }
                //走得动画
                this.addAnim('crawl', 0.1, [14, 15, 16]);
                //击中的动画
                this.addAnim('hit', 0.4, [13]);
                //死亡的动画
                this.addAnim('dea', 0.07, [0, 1, 2, 3, 4, 5]);
                //射击的动画
                this.addAnim('shoot', 0.2, [10, 11]);
                //设置子弹
                this.projectileClass = EntityOfficerProjectile;
                this.currentAnim.gotoRandomFrame();
                //随机方向
                this.currentAnim.flip.x = (Math.random() > 0.5);
                this.flip = this.currentAnim.flip.x;
                this.shootTimer = new ig.Timer();
                this.shootWaitTimer = new ig.Timer();
                //随机本对象的方向

            },

            update:function () {
                //获取player
                player = ig.game.getEntitiesByType(EntityPlayer)[0];
                if (player) {
                    //判断player的大概位置（左右）
                    this.xDirection = player.pos.x-this.pos.x < 0 ? -1:1;
                    if(this.currentAnim==this.anims.dea)
                    {
                        //设置动画方向
                        this.currentAnim.flip.x=(this.xDirection<0);
                        this.currentAnim.update();
                        if(this.currentAnim.loopCount)
                        {
                            ig.game.killCount++;
                            //杀死实体
                            this.kill();
                        }
                        this.parent();
                        return;
                    }
                    if (this.currentAnim == this.anims.shoot) {
                        if (this.currentAnim.loopCount) {
                            this.currentAnim = this.anims.crawl.rewind();
                            //设置人站立方向
                            this.flip = this.xDirection < 0 ? 1 : 0;
                            //设置动画方向
                            this.currentAnim.flip.x = this.flip;
                        }
                        //判断是否可以射击
                        if (this.canShoot && this.shootTimer.delta() > 0) {

                            //发射子弹
                            this.shoot();
                        }
                    }
                    else if (this.currentAnim == this.anims.crawl) {
                        //如果shootWaitTimer的时间过去，并且距离玩家的距离小于200
                        if (this.shootWaitTimer.delta() > 0 && this.distanceTo(player) < 800) {
                            //shootWaitTimer设置当前动画为射击动画
                            this.currentAnim = this.anims.shoot.rewind();
                            //设置当前动画的方向
                            this.currentAnim.flip.x = this.xDirection < 0 ? 1 : 0;
                            this.shootWaitTimer.set(this.time);
                            this.shootTimer.set(0.1);
                            this.canShoot = true;
                            //射击时水平方向的速度为0
                            this.vel.x = 0;
                        }
                        else {
                            //判断前面是否能走通
                            if (!ig.game.collisionMap.getTile(this.pos.x + (this.flip ? +4 : this.size.x - 4), this.pos.y + this.size.y + 1)) {
//                                ig.log("ok");
                                //不能走通，向相反方向移动
                                this.flip = !this.flip;
                                //设置动画方向
                                this.currentAnim.flip.x = this.flip;
                            }

                            var xdir = this.flip ? -1 : 1;
                            //设置移动速度
                            this.vel.x = 50 * xdir;
                        }
                    }
                    else if (this.currentAnim == this.anims.hit && this.currentAnim.loopCount) {
                        //alert(this.currentAnim.loopCount);
                        //设置当前动画为走
                        this.currentAnim = this.anims.crawl.rewind();
                        this.currentAnim.flip.x = this.flip;
                    }
                }
                this.parent();
            },
            //碰撞检测
            handleMovementTrace:function (res) {
                //调用父方法
                this.parent(res);
                if (res.collision.x) {
                    //运动方向
                    this.flip = !this.flip;
                    //动画的播放方向
                    this.currentAnim.flip.x = this.flip;
                }
            },

            kill:function () {
                this.parent();
            },
            //动态碰撞检测
            receiveDamage:function (amount, from) {
                if (this.health>0) {
//               alert("ok");
                    this.seenPlayer = true;
                    //受到攻击时给一个向后的速度
                    this.vel.x = this.xDirection < 0 ? 20 : -20;
                    //生命值减少
                    this.health -= amount;
                    //判断是否死亡，如果死亡就改变动画为死亡动画，如果死亡就改为行走
                    if (this.health <= 0) {
                        this.checkAgainst = ig.Entity.TYPE.NONE;
                        this.type = ig.Entity.TYPE.NONE;
                        this.collides = ig.Entity.COLLIDES.NEVER,
                        this.vel.y = -50;
                        this.currentAnim = this.anims.dea.rewind();
                        this.currentAnim.update();
                    } else {
                        this.hitNum++

                        if (this.hitNum<3) {
                            this.currentAnim = this.anims.hit.rewind();
                            this.currentAnim.flip.x = this.xDirection < 0;
                            this.vel.x = 0;
                        } else {
                            this.canShoot = true;
                            this.shootTimer.set(0.1);
                            this.currentAnim = this.anims.shoot.rewind();
                            this.flip = this.xDirection<0;
                            this.currentAnim.flip.x = this.flip;
                            this.hitNum = 0;
                        }
                    }
                }
            },

            check:function (other) {
                other.receiveDamage(this.damage, this);
            },
            shoot:function () {
                this.vel.x = 0;
                //设置子弹产生的位置
                var x = this.pos.x + 30 * this.xDirection;
                var y = this.pos.y + 25;
                ig.game.spawnEntity(this.projectileClass, x, y, {flip:(this.xDirection < 0 ? 1 : 0),damage:this.damage});
                if (this.projectileCount < this.projectileNum-1) {
                    this.shootTimer.set(0.1);
                    this.projectileCount++;
                }
                else {
                    this.shootTimer.set(this.time);
                    this.canShoot = false;
                    this.projectileCount=0;
                }
            },

            triggeredBy:function(other,from){
                this.receiveDamage(1000,from);
            }
        });
    });