/**
 * Content: 火焰枪实体
 * User: wangbing
 * Date: 12-3-22
 * CreateTime: a.m 9:26
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'interface.flameProjectile'
).requires(
    'impact.entity'
).defines(function(){
    EntityFlameProjectile = ig.Entity.extend({
        // 火焰枪检测大小
        size:{x:10, y:75},
        // 火焰枪检测偏移
        offset:{x:0, y:250},
        // 火焰枪喷焰速度
        maxVel:{x:500, y:0},
        // 摩擦力
        friction:{x:0, y:0},
        // 重力
        gravityFactor:0,
        // 火焰内容
        type:ig.Entity.TYPE.NONE,
        // 火焰枪检测类型
        checkAgainst:ig.Entity.TYPE.B,
        // 火焰枪碰撞内容
        collides:ig.Entity.COLLIDES.NEVER,
        // 翻转
        flip:false,
        // 是否被火焰枪击中
        hasHit:false,
        // 火焰枪的伤害值
        damage:80,
        projectMusic:new ig.Sound('media/sounds/firegun.ogg',false),
        // 火焰枪的动画
        animSheet:new ig.AnimationSheet('media/sprites/flame.png', 500, 500),
        // 火焰枪每一枪的发射时间
        flyTimer:null,
        // 火焰枪飞行时间
        flySkyTimer:null,


        init:function (x, y, settings) {
            this.flyTimer = new ig.Timer();
            this.flySkyTimer = new ig.Timer();
            this.parent(x, y, settings);
            this.addAnim('idle', 0.05, [0,0,1,1,2,2,3,3,4,4],true);
            this.addAnim('dea',0.1,[5]);
            this.flip = settings.flip;
        },
        update:function () {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            if(!player){
                return;
            }
            if(this.flip){
                this.offset.x = 120;
            }
            if(this.flySkyTimer.delta() < 0.25 && this.flySkyTimer.delta() > 0.15)
            {
                this.size.x = 144;

            }
            else if(this.flySkyTimer.delta() < 0.15)
            {

                this.size.x = 20;

            }
            else if(this.flySkyTimer.delta() < 0.35 && this.flySkyTimer.delta() > 0.25)
            {

                this.size.x =260;

            }
            else if(this.flySkyTimer.delta() < 0.4 && this.flySkyTimer.delta() > 0.35){
                this.size.x =380;

            }
            else if(this.flySkyTimer.delta() <= 1 && this.flySkyTimer.delta() > 0.45)
            {
                this.size.x =500;
            }
            else
            {
                this.kill();
            }
            this.currentAnim.flip.x = this.flip;
            this.parent();
        },
        handleMovementTrace:function (res) {
            if (res.collision.x || res.collision.y) {
                this.currentAnim = this.anims.idle.rewind();
                this.hasHit = true;
                this.kill();
            }
            this.parent(res);
        },
        // 碰撞检测
        check:function (other) {
            if (!this.hasHit) {
                other.receiveDamage(this.damage, this);
                this.hasHit = true;
                this.currentAnim = this.anims.idle;
                this.vel.x = 0;
                this.offset.x = 0;

            }

        }
    });
});