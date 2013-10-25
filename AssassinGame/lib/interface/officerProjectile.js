/**
 * Content: 敌人军官
 * User: ws
 * Date: 12-3-22
 * CreateTime: a.m 10:06
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'interface.officerProjectile'
).requires(
    'interface.projectile'
).defines(function(){
    EntityOfficerProjectile = EntityProjectile.extend({
        damage:40,
        maxVel:{x:300,y:0},
        checkAgainst:ig.Entity.TYPE.A,
        animSheet:new ig.AnimationSheet('media/sprites/enemy-projectile.png',24,24)
    });
});