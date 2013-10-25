/**
 * Content: 炮弹的拓展类
 * User: wangbing
 * Date: 12-3-21
 * CreateTime: p.m 5:01
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'interface.cannonballProjectile'
).requires(
    'interface.projectile'
).defines(function () {
        EntityCannonballProjectile = EntityProjectile.extend({
            size:{x:22,y:8},//大小
            offset:{x:62,y:62},//偏移量
            // 炮弹最大速度
            maxVel:{x:300, y:0},
            // 炮弹的伤害值
            damage:80,
            // 炮弹的检测类型
            checkAgainst:ig.Entity.TYPE.B,
            // 炮弹的动画
            animSheet:new ig.AnimationSheet('media/sprites/cannonball_projectile.png', 144, 144),

            projectMusic:new ig.Sound('media/sounds/cannonball.ogg', false),
            init:function (x, y, settings) {
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.parent(x, y, settings);
                this.addAnim('idle', 0.1, [0]);
                this.addAnim('hit', 0.1, [1, 2, 2, 2], true);
            },
            update:function () {
                if (this.vel.x < 0) {//向左飞行
                    this.isOut = this.pos.x < ig.game.screen.x - 50 ? 1 : 0;
                } else {
                    this.isOut = this.pos.x > ig.game.screen.x + ig.system.width+50 ? 1 : 0;
                }
                if (this.currentAnim == this.anims.hit && this.currentAnim.loopCount || this.isOut) {
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
                    this.currentAnim = this.anims.hit.rewind();

                }
            },
            check:function (other) {
                this.vel.x = 0;
                this.vel.y = 0;
                this.gravityFactor = 0;
                other.receiveDamage(this.damage, this);
                //检测
                this.check2(other);
                this.currentAnim = this.anims.hit.rewind();
                //爆炸后的不发生碰撞检测
                this.checkAgainst = ig.Entity.TYPE.NONE;
                this.collides = ig.Entity.COLLIDES.NEVER;
            },
            check2:function (other) {

                this.projectMusic.play();
                //获取所有实体
                for (var i = 0; i < ig.game.entities.length; i++) {
                    var ent = ig.game.entities[i];
                    //没有死亡，并且除去自身和子弹
                    if (!ent._killed && !(ent instanceof EntityGrenadeProjectile) && ent !== other) {
                        if (ent.distanceTo(this) < 150) {
                            if (ent.type == ig.Entity.TYPE.B)
                                ent.receiveDamage(this.damage, this);
                        }
                    }
                }
            }
        });
    });