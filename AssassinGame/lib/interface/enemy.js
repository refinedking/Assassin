/**
 * Content: 不可移动敌人基类
 * User: ws
 * Date: 12-3-21
 * CreateTime: a.m 10:30
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'interface.enemy'
).requires(
    'impact.entity',
    'interface.projectile'
).defines(function () {
    EntityEnemy = ig.Entity.extend({
        //可视范围
        find:{x:450, y:450},
        // 射击范围
        shootRange:0,
        // 伤害值
        damage:0,
        //两次攻击的时间间隔
        shootTimer:null,

        //是否发现player
        seenPlayer:false,
        //设置自身的type
        type:ig.Entity.TYPE.B,
        //设置敌方的type
        checkAgainst:ig.Entity.TYPE.A,
        collides:ig.Entity.COLLIDES.PASSIVE,
        //子弹类
        projectileClass:null,
        // 反弹速度
        minBounceVelocity:0,
        // 子弹的数目
        projectileNum:0,
        //与player y轴的距离
        ydist:0,
        //与player x轴的距离
        xdist:0,
        //判断player的位置-1表示在左边，1表示在右边
        xdir:0,
        // 攻击时间
        time:0,
        zIndex:10000,
        fitNum:0,

        /**
         * 查看是否发现player
         */
        findPalyer:function () {
            this.ydist = Math.abs(player.pos.y - this.pos.y);
            this.xdist = Math.abs(player.pos.x - this.pos.x);
            //判断player的位置-1表示在左边，1表示在右边
            this.xdir = player.pos.x - this.pos.x < 0 ? -1 : 1;

            //判断是否看见player
            if (!this.seenPlayer) {
                //当player与soldier一定距离或者soldier受到攻击为发现player
                if (this.xdist < this.find.x && this.ydist < this.find.y || this.currentAnim == this.anims.hit) {
                    this.seenPlayer = true;
                }
            }
        },
        /**
         * 发射子弹
         */
        shoot:function () {
            this.vel.x = 0;
            //设置子弹产生的位置
            var x = this.pos.x + this.size.x * this.xdir;
            var y = this.pos.y + this.size.y / 3;
            ig.game.spawnEntity(this.projectileClass, x, y, {flip:(this.xdir < 0 ? 1 : 0),damage:this.damage});
            if (this.projectileCount < this.projectileNum - 1) {
                this.shootTimer.set(0.2);
                this.projectileCount++;
            }
            else {
                this.shootTimer.set(this.time);
                this.projectileCount = 0;
            }
        },
        triggeredBy:function(entity,trigger)
        {
            this.receiveDamage(trigger.damage,trigger);
        }
    });
});