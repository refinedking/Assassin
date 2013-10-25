/**
 * 玩家步枪
 * User: Administrator
 * Date: 12-4-8
 * Time: 下午10:29
 * To change this template use File | Settings | File Templates.
 */
ig.module(
    'interface.rifleProjectile'
).requires(
    'interface.projectile'
).defines(function () {
        EntityRifleProjectile = EntityProjectile.extend({
            size:{x:8,y:8},
            offset:{x:8,y:8},
            // 玩家子弹类的速度
            maxVel:{x:300, y:0},
            // 玩家子弹类的伤害值
            damage:40,
            // 玩家子弹的检测类型
            checkAgainst:ig.Entity.TYPE.B,
            projectMusic:new ig.Sound('media/sounds/rifle-projectile.ogg', false),
            // 玩家子弹的动画
            animSheet:new ig.AnimationSheet('media/sprites/player-projectile.png', 24, 24)
        });
    });