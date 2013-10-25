/**
 * Content: 可移动的敌人
 * User: ws
 * Date: 12-3-22
 * CreateTime: p.m 14:46
 * UpdateTime:3.29,17.05
 * UpdateContent:死亡后动画换方向
 */

ig.module(
    'interface.moveEnemy'
).requires(
    'impact.entity',
    'interface.enemy'
).defines(function(){
        EntityMoveEnemy = EntityEnemy.extend({
            init:function(x,y,settings){
                this.parent(x,y,settings);
            },

            update:function(){
                //获取player
                player = ig.game.getEntitiesByType(EntityPlayer)[0];
                //判断player是否存在
                if(player){

                    var wasStanding = this.standing;
                    //计算与player的距离
                    if (!this.isdied) {
                        this.findPalyer();
                    }
                    //判断player是否死亡
                    if(this.currentAnim==this.anims.dea)
                    {
                        //设置动画方向
                        this.currentAnim.flip.x=(this.xdir<0);
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
                    //发现玩家，并且自身没有受到攻击
                    if(this.seenPlayer&&this.standing&&this.currentAnim!=this.anims.hit && this.currentAnim != this.anims.shoot) {
                        if(this.currentAnim != this.anims.jump){
                            //判断是否与水平方向发生碰撞如果发生碰撞就跳跃没有就行走
                            if(this.isCollision){
                                //jump动画
                                this.currentAnim=this.anims.jump.rewind();
                                //动画的方向
                                this.currentAnim.flip.x=(this.xdir<0);
                                //水平速度
                                this.vel.x=0;
                                this.isCollision = false;
                            }else{
                                //当水平距离player一定距离时开始射击
                                if ((this.xdist <=this.find.x && (this.ydist >=0&&this.ydist<=100)
                                    &&this.shootTimer.delta()>0)||this.currentAnim == this.anims.hit){

                                    this.shoot();
                                    this.vel.x = 0;
                                    this.currentAnim = this.anims.shoot.rewind();
                                    this.currentAnim.flip.x = (this.xdir < 0);
                                }
                            }
                            //判断当前动画是不是跳跃，是就给y上的速度
                        } else if(this.currentAnim==this.anims.jump&&this.currentAnim.loopCount){
                            //起跳y速度
                            this.vel.y= this.jump *2.3;
                            //x速度
                            this.vel.x=100*(this.currentAnim.flip.x?-1:1);
                            //处于injump状态
                            this.inJump=true;
                        }
                    }

                    if(this.currentAnim == this.anims.shoot &&this.currentAnim.loopCount){
                        this.currentAnim = this.anims.crawl;
                        if (this.xdist<=20) {
                            //在垂直方向重合让敌人来回走动
                            this.seenPlayer = false;
                        } else {
                            //动画方向
                            this.currentAnim.flip.x = (this.xdir < 0);
                            //移动速度
                            this.vel.x = 70 * this.xdir;
                        }
                    }
                    //处于被射击的状态
                    if(this.currentAnim==this.anims.hit&&this.currentAnim.loopCount)
                    {
                        //动画的方向
                        this.currentAnim.flip.x=(this.xdir<0);
                        //改变动画
                        this.currentAnim=this.anims.idle;//
                        this.vel.x = 0;
                    }
                    //处于跳跃状态
                    if(this.inJump&&this.vel.x==0&&this.currentAnim!=this.anims.hit)
                    {
                        //给敌人一个水平方向的速度
                        this.vel.x=30*(this.currentAnim.flip.x?-1:1);
                    }
                    this.parent();

                    if(this.standing&&!wasStanding&&this.currentAnim!=this.anims.hit&&this.currentAnim!=this.anims.dea)
                    {
                        this.inJump=false;
                        if (this.seenPlayer && this.currentAnim != this.anims.shoot) {
                            this.currentAnim.flip.x = (this.xdir<0);
                            this.currentAnim = this.anims.crawl.rewind();
                            this.vel.x = 70*this.xdir;
                        }else{
                            this.anims.idle.flip.x=this.currentAnim.flip.x;
                            this.currentAnim = this.anims.idle;
                            this.vel.x=0;
                        }
                    }

                    if(this.currentAnim == this.anims.crawl){
                        this.currentAnim.flip.x = (this.xdir<0);
                        this.vel.x = 70*this.xdir;
                    }

                    if (this.vel.y > 0) {
                        this.currentAnim.update();
                        this.currentAnim = this.anims.fall;
                        this.currentAnim.flip.x = (this.xdir<0);
                    }

                }else{//没有发现玩家让敌人处于待机的状态
                    this.currentAnim = this.anims.idle;
                    this.currentAnim.flip = Math.random()>0.5;
                    this.vel.x = 0;
                    this.parent();
                }
            },
            receiveDamage:function(amount,from)
            {
                if (this.health>0) {
//               alert("ok");
                    this.anims.hit.flip.x = this.currentAnim.flip.x;
                    this.seenPlayer = true;
                    this.inJump = false;
                    //受到攻击时给一个向后的速度
                    this.vel.x = this.xdir < 0 ? 20 : -20;
                    //生命值减少
                    this.health -= amount;
                    //判断是否死亡，如果死亡就改变动画为死亡动画，如果没有死亡就改为行走
                    if (this.health <= 0) {
                        this.checkAgainst = ig.Entity.TYPE.NONE;
                        this.type = ig.Entity.TYPE.NONE;
                        this.collides = ig.Entity.COLLIDES.NEVER,
                        this.vel.y = -50;
                        this.currentAnim.flip.x = (this.xdir < 0);
                        this.currentAnim = this.anims.dea.rewind();
                        this.currentAnim.update();
                        this.isdied = true;
                    } else {
                            if(this.hitNum<3){
                                this.currentAnim = this.anims.hit.rewind();
                            }else{
                                this.shootTimer.set(0.1);
                                this.currentAnim = this.anims.shoot.rewind();
                                this.hitNum = 0;
                            }

                    }
                }
            },

            //当和该对象发生动态碰撞时调用
            check:function(other)
            {
                //移除血量
                other.receiveDamage(this.damage,this);
            },

            //碰撞检测，
            handleMovementTrace: function(res){
                //与地图发生碰撞,是否要跳跃
                if( res.collision.x &&this.vel.y >0) {
                    this.isCollision = true;
                }
                // 继续照常解决碰撞
                this.parent(res);
            }
        }) ;
    });