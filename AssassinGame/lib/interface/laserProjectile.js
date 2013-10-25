/**
 * 坦克Boss的激光子弹
 * User: chio3g
 * Date: 12-4-16
 * Time: 上午10:28
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'interface.laserProjectile'
).requires(
    'interface.projectile'
).defines(function () {
        EntityLaserParjectile = EntityProjectile.extend({
            damage:100,
            size:{x:150, y:10},
            offset:{x:10, y:75},
            maxVel:{x:300, y:0},
            checkAgainst:ig.Entity.TYPE.A,
            animSheet:new ig.AnimationSheet('media/sprites/laserProjectile.png', 160, 160),

            init:function (x, y, settings) {
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.parent(x, y, settings);
                this.addAnim('idle', 0.1, [0]);
                this.addAnim('hit', 0.1, [0, 0, 0], true);
            }
        });
    });