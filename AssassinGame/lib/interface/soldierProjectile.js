/**
 * Content: 敌兵子弹
 * User: ws
 * Date: 12-3-22
 * CreateTime: a.m 10:36
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'interface.soldierProjectile'
).requires(
    'interface.projectile'
).defines(function(){
    EntitySoldierProjectile = EntityProjectile.extend({
        damage:20,
        offset:{x:5,y:5},
        maxVel:{x:300,y:0},
        checkAgainst:ig.Entity.TYPE.A,
        animSheet:new ig.AnimationSheet('media/sprites/enemy-projectile.png',24,24)
    });
});