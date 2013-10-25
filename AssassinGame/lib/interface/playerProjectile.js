/**
 * Content: 玩家子弹类
 * User: wangbing
 * Date: 12-3-22
 * CreateTime: p.m 15:06
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'interface.playerProjectile'
).requires(
    'interface.projectile'
).defines(function(){
    EntityPlayerProjectile = EntityProjectile.extend({
        // 玩家子弹类的速度
        maxVel:{x:300,y:0},
        // 玩家子弹类的伤害值
        damage:20,
        // 玩家子弹的检测类型
        checkAgainst:ig.Entity.TYPE.B,
        projectMusic: new ig.Sound('media/sounds/player-projectile.ogg',false),
        // 玩家子弹的动画
        animSheet:new ig.AnimationSheet('media/sprites/grunt-projectile.png',8,8)
    });
});