/**
 * 巡逻的手雷兵
 * User: chio3g
 * Date: 12-3-29
 * Time: 上午11:49
 * UpdateTime:
 * UpdateContent:
 */
ig.module(
    'game.entities.patrolGrenadiers'
).requires(
    'interface.grenadeProjectile',
    'impact.entity'
).defines(function () {
        EntityPatrolGrenadiers  = ig.Entity.extend({

            find:500,
            //大小
            size:{x:48,y:84},
            //偏移量
            offset:{x:28,y:8},
            //定义x\y的最大速度
            maxVel:{x:220, y:500},
            //定义地面和空中的加速度
            accelDef:{ground:400, air:500},
            //定义地面和空中的摩擦力
            frictionDef:{ground:500, air:50},

            //射程是半个屏幕
            shootRange:450,
            //伤害
            damage:50,
            shootTimer: null,
            //子弹类型
            projectileClass:null,
            //每次发射子弹的个数
            projectileNum:1,
            //设置自身的type
            type:ig.Entity.TYPE.B,
            //设置敌方的type
            checkAgainst:ig.Entity.TYPE.A,
            collides:ig.Entity.COLLIDES.PASSIVE,
            health:50,
            //两次发射的时间间隔
            time:5,

            xDirection:0,

            shootWaitTimer:null,
            hitNum:0,
            animSheet:new ig.AnimationSheet('media/sprites/grenadiers.png',104,104),
            model:0,
            init:function (x, y, settings) {
                this.parent(x,y,settings);
                if (this.model == 1) {
                    this.animSheet = new ig.AnimationSheet('media/sprites/grenadiers2.png', 104, 104);
                }
                //走得动画
                this.addAnim('crawl',0.1,[12,13,14,15]);
                //击中的动画
                this.addAnim('hit',0.4,[21],true);
                //死亡的动画
                this.addAnim('dea',0.07,[0,1,2,3,4,5]);
                //射击的动画
                this.addAnim('shoot',0.1,[18,19,19,19,19],true);
                //子弹类型
                this.projectileClass = EntityGrenadeProjectile;
                this.currentAnim.gotoRandomFrame();
                //随机方向
                this.currentAnim.flip.x=(Math.random()>0.5);
                this.flip = this.currentAnim.flip.x;
                this.shootTimer = new ig.Timer();
                this.shootWaitTimer = new ig.Timer();
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
                        if (this.shootWaitTimer.delta() > 0 && this.distanceTo(player) < 200) {
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
            shoot:function(){
                this.vel.x=0;
                //设置子弹产生的位置
                var x=this.pos.x;
                var y=this.pos.y;
                ig.game.spawnEntity(this.projectileClass, x, y, {flip:(this.xdir < 0 ? 1 : 0),xdist:this.distanceTo(player),damage:this.damage});
                if (this.projectileCount < this.projectileNum-1) {
                    this.shootTimer.set(0.2);
                    this.projectileCount++;
                }
                else {
                    this.shootTimer.set(this.time);
                    this.projectileCount=0;
                }
            }
        });
    });