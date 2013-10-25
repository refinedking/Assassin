/**
 * tank 子弹
 * User: ws
 * Date: 12-4-13
 * Time: 上午9:23
 * To change this template use File | Settings | File Templates.
 */

ig.module(
    'interface.tankProjectile'
).requires(
    'interface.projectile'
).defines(function () {
        EntityTankProjectile = EntityProjectile.extend({
            size:{x:16,y:8},
            offset:{x:8,y:8},
            // 玩家子弹类的速度
            maxVel:{x:300, y:0},
            // 玩家子弹类的伤害值
            damage:100,
            // 玩家子弹的检测类型
            checkAgainst:ig.Entity.TYPE.A,
            // 玩家子弹的动画
            animSheet:new ig.AnimationSheet('media/sprites/tank-projectile.png', 24, 24)
        });
    });