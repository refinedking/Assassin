/**
 * Content: 电流
 * User: ws
 * Date: 12-3-26
 * Time: 上午11:21
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.electric'
).requires(
    'impact.entity',
    'interface.organ'
).defines(function(){
        EntityElectric= ig.Entity.extend(
            {
                //大小
                size:{x:50,y:40},
                //偏移量
                offset:{x:1,y:0},
                //自身碰撞类型
                type:ig.Entity.TYPE.B,
                //检测的碰撞类型
                checkAgainst:ig.Entity.TYPE.A,
                //忽略所有碰撞
                collides:ig.Entity.COLLIDES.NEVER,
                //生命值
                health:80,
                //发射电流的时间
                shootTimer:null,
                shootWaitTimer:null,
                canShoot:false,
                //伤害大小
                damage:20,
                projectileNum:3,
                projectileCount:0,
                animSheet:new ig.AnimationSheet('media/sprites/electric.png',48,48),
                init:function(x,y,settings)
                {
                    this.parent(x,y,settings);
                    this.shootWaitTimer=new ig.Timer(1);
                    this.shootTimer=new ig.Timer(10);
                    this.addAnim('idle',1,[0]);
                    this.addAnim('shoot',0.2,[1,2,2,1]);
                    this.addAnim('hit',0.2,[0]);
                },
                update:function()
                {
                    if(this.currentAnim==this.anims.hit&&this.currentAnim.loopCount)
                    {
                        this.currentAnim=this.anims.idle;
                        this.shootWaitTimer.set(1.2);
                    }
                    else if(this.currentAnim==this.anims.idle&&this.shootWaitTimer.delta()>0&&this.distanceTo(ig.game.player)<400)
                    {
                        this.currentAnim=this.anims.shoot.rewind();
                        this.shootTimer.set(0);
                        this.canShoot=true;
                    }
                    else if(this.currentAnim==this.anims.shoot&&this.canShoot&&this.shootTimer.delta()>0)
                    {
                        this.canShoot=false;
                        ig.game.spawnEntity(EntityDropperShot,this.pos.x + 25,this.pos.y + 25);
                        if (this.projectileCount < this.projectileNum-1) {
                            this.shootWaitTimer.set(0);
                            this.projectileCount++;
                        }
                        else {
                            this.currentAnim=this.anims.idle.rewind();
                            this.shootWaitTimer.set(2.8);
                            //this.shootTimer.set(this.time);
                            this.projectileCount=0;
                        }
                    }
                    if(this.currentAnim==this.anims.shoot&&this.currentAnim.loopCount)
                    {
                        this.currentAnim=this.anims.idle.rewind();
                    }
                    this.currentAnim.update();
                },
                kill:function()
                {
                    this.parent();
                },
                check:function(other)
                {
                    other.receiveDamage(this.damage,this);
                },
                receiveDamage:function(amount,from)
                {
                    this.currentAnim=this.anims.hit.rewind();
                    this.parent(amount);
                }

            });

        EntityDropperShot=ig.Entity.extend(
            {
                size:{x:12,y:48},
                offset:{x:30,y:0},
                vel:{x:0,y:10},
                damage:50,
                maxVel:{x:0,y:200},
                type:ig.Entity.TYPE.NONE,
                checkAgainst:ig.Entity.TYPE.A,
                collides:ig.Entity.COLLIDES.LITE,
                animSheet:new ig.AnimationSheet('media/sprites/electric-projectile.png',48,48),
                init:function(x,y,settings)
                {
                    this.addAnim('idle',0.1,[0]);
                    this.addAnim('drop',0.1,[1,2,3],true);
                    this.parent(x,y,settings);
                },
                update:function()
                {
                    if(this.currentAnim==this.anims.drop&&this.currentAnim.loopCount){this.kill();}
                    this.parent();
                },
                handleMovementTrace:function(res)
                {
                    this.parent(res);
                    if((res.collision.x||res.collision.y)&&this.currentAnim!=this.anims.drop)
                    {
                        this.currentAnim=this.anims.drop.rewind();
                    }
                },
                check:function(other)
                {
                    if(this.currentAnim!=this.anims.drop)
                    {
                        other.receiveDamage(this.damage,this);this.kill();
                    }
                }
            });
    });