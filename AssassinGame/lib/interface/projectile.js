/**
 * Content: 子弹基类
 * User: wangbing
 * Date: 12-3-22
 * CreateTime: a.m 9:26
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'interface.projectile'
).requires(
    'impact.entity'
).defines(function () {
        // 定义子弹类
        EntityProjectile = ig.Entity.extend({
            // 子弹类的检测大小
            size:{x:8, y:8},
            // 子弹类的检测偏移
            offset:{x:0, y:0},
            // 子弹类的速度
            maxVel:{x:400, y:0},
            // 子弹类的摩擦力
            friction:{x:0, y:0},
            // 重力大小
            gravityFactor:0,
            // 子弹类的类型检测
            type:ig.Entity.TYPE.NONE,
            // 子弹类的检测碰撞类型
            checkAgainst:ig.Entity.TYPE.B,
            // 子弹类自身的碰撞类型
            collides:ig.Entity.COLLIDES.NEVER,
            // 翻转
            flip:false,
            // 子弹类是否击中敌人
            hasHit:false,
            // 子弹类的伤害值
            damage:10,
            //判断子弹飞出屏幕没有
            isOut:false,
            //枪声
            projectMusic:null,
            // 子弹类的动画元素
            animSheet:new ig.AnimationSheet('media/sprites/enemy-projectile.png', 8, 8),


            init:function (x, y, settings) {
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
//            this.flyTimer = new ig.Timer(2);
                this.parent(x, y, settings);
                this.addAnim('idle', 0.1, [0]);
                this.addAnim('hit', 0.1, [0, 1, 2, 3, 4, 5], true);
            },
            update:function () {

                if (this.vel.x < 0) {//向左飞行
                    this.isOut = this.pos.x < ig.game.screen.x - 50 ? 1 : 0;
                } else {
                    this.isOut = this.pos.x > ig.game.screen.x + ig.system.width+50 ? 1 : 0;
                }
                // 被击中并动画播放完成
                if ((this.hasHit && this.currentAnim.loopCount > 0) || this.isOut) {

                    this.kill();
                }

                this.parent();
                this.currentAnim.flip.x = this.flip;
            },
            handleMovementTrace:function (res) {
                if (res.collision.x || res.collision.y || res.collision.slope) {
                    this.currentAnim = this.anims.hit.rewind();
                    this.hasHit = true;
                }
                this.parent(res);
            },
            // 碰撞检测
            check:function (other) {
                if (!this.hasHit) {
                    // 被击中的实体，血量减少
                    other.receiveDamage(this.damage, this);
                    this.hasHit = true;
                    this.currentAnim = this.anims.hit;
                    this.vel.x = 0;
                }
            }
        });
    });

