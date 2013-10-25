/**
 * 玩家手雷
 * User: Administrator
 * Date: 12-4-8
 * Time: 下午10:55
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'interface.playerGrenadeProjectile'
).requires(
    'interface.moveEnemy'
).defines(function () {
        EntityPlayerGrenadeProjectile = ig.Entity.extend({

            friction:{x:0, y:0}, //摩擦力
            size:{x:27, y:27}, //大小
            offset:{x:60, y:60}, //偏移量
            maxVel:{x:400, y:400},
            type:ig.Entity.TYPE.NONE,
            checkAgainst:ig.Entity.TYPE.B,
            collides:ig.Entity.COLLIDES.LITE,
            damage:100, //伤害
            animSheet:new ig.AnimationSheet('media/sprites/grenade.png', 144, 144),
            projectMusic:new ig.Sound('media/sounds/bmbm.ogg', false),
            init:function (x, y, settings) {

                var xdir = settings.flip ? -1 : 1;//扔炸弹的方向
                this.vel.x = Math.random().map(0, 100, 250, 300) * xdir;//随机x轴的速度
                this.vel.y = -300;
                this.addAnim('idle', 0.1, [0]);
                this.addAnim('dea', 0.07, [1, 2, 2, 1, 2, 1, 2, 1, 2], true);
                this.parent(x, y, settings);

            },
            update:function () {
                if (this.currentAnim == this.anims.dea && this.currentAnim.loopCount) {
                    this.kill();
                }
                this.parent();
            },
            handleMovementTrace:function (res) {
                this.parent(res);
                if (res.collision.x || res.collision.y || res.collision.slope) {
                    this.vel.x = 0;
                    this.vel.y = 0;
                    this.gravityFactor = 0;
                    this.check2();
                    this.currentAnim = this.anims.dea.rewind();

                }
            },
            check:function (other) {
                this.vel.x = 0;
                this.vel.y = 0;
                this.gravityFactor = 0;
                other.receiveDamage(this.damage, this);
                //检测
                this.check2(other);
                this.currentAnim = this.anims.dea.rewind();
                //爆炸后的不发生碰撞检测
                this.checkAgainst = ig.Entity.TYPE.NONE;
                this.collides = ig.Entity.COLLIDES.NEVER;
            },
            check2:function (other) {

                this.projectMusic.play();
                //获取所有实体
                for (var i = 0; i < ig.game.entities.length; i++) {
                    var ent = ig.game.entities[i];
                    //没有死亡
                    if (!ent._killed && !(ent instanceof EntityGrenadeProjectile) && ent !== other) {
                        if (ent.distanceTo(this) < 150) {
                            if (ent.type == ig.Entity.TYPE.B){
                                ent.receiveDamage(this.damage, this);
                            }

                        }
                    }
                }
            }
        });
    });