/**
 * 碉堡子弹
 * User: Administrator
 * Date: 12-3-27
 * Time: 下午11:33
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'interface.fireBunkerProjectile'
).requires(
    'interface.projectile'
).defines(function(){
    EntityFireBunkerProjectile = EntityProjectile.extend({
        damage:50,
        offset:{x:5,y:8},
        maxVel:{x:300,y:0},
        checkAgainst:ig.Entity.TYPE.A,
        animSheet:new ig.AnimationSheet('media/sprites/fireBunkerProjectile.png',24,24),

        init:function (x, y, settings) {
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.flyTimer = new ig.Timer(1);
            this.parent(x, y, settings);
            this.addAnim('idle', 0.1, [0]);
            this.addAnim('hit', 0.1, [0, 1, 2, 3, 4], true);
        }
    });
});