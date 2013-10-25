/**
 * Content: 散弹实体
 * User: wangbing
 * Date: 12-3-22
 * CreateTime: p.m 4:26
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'interface.shotgunProjectile'
).requires(
    'interface.projectile'
).defines(function(){
    EntityShotgunProjectile = EntityProjectile.extend({
        // 散弹枪的检测大小
        size:{x:16,y:8},
        // 散弹枪的检测偏移
        offset: {x:5,y:10},
        // 散弹枪的速度
        maxVel: {x:300,y:0},
        // 散弹枪的伤害值
        damage: 40,
        // 散弹枪的碰撞检测类型
        checkAgainst:ig.Entity.TYPE.B,
        // 射击的角度数
        shootAngle : [-1,0,1],
        // 当前射击的子弹数
        shootCount : 0,
        projectMusic:new ig.Sound('media/sounds/shotgun.ogg',false),
        // 散弹枪的动画
        animSheet:new ig.AnimationSheet('media/sprites/projectile.png',24,24),
        init:function (x, y, settings) {
            this.parent(x, y, settings);
        },
        update:function(){
            // 发射散弹则将其他坐标值进行偏
            this.pos.y = this.pos.y + this.shootAngle[this.shootCount];
            this.parent();
        }
    });
});