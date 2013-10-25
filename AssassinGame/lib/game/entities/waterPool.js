/**
 * Content: 水池
 * User: ws
 * Date: 12-3-26
 * Time: 下午1:13
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.waterPool'
).requires(
    'impact.entity',
    'interface.organ'
).defines(function(){
    EntityWaterPool = EntityOrgan.extend({
        //大小
        size:{x:140,y:23},
        //偏移量
        offset:{x:2,y:20},
        //伤害值
        damage:200,
        //自身类型
        type:ig.Entity.TYPE.B,
        //检测类型
        checkAgainst:ig.Entity.TYPE.A,
        //动态碰撞类型
        collides:ig.Entity.COLLIDES.FIXED,
        //受伤害的时间间隔
        shootTimer:null,
        animSheet:new ig.AnimationSheet('media/sprites/water.png',144,48),

        init:function(x,y,settings){
            this.parent(x, y,settings);
            this.shootTimer = new ig.Timer();
            this.addAnim('idle',1,[0,1]);
            this.shootTimer.set(2);
        },

        receiveDamage:function(amount,from){
            //不受伤害
        },
        check:function(other){

            if (this.shootTimer.delta() >0) {
                other.receiveDamage(this.damage, this);
                this.shootTimer.reset();
            }
        }

    });
});
