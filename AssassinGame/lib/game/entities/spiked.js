/**
 * Content: 尖刺
 * User: ws
 * Date: 12-3-26
 * Time: 上午9:19
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.spiked'
).requires(
    'impact.entity',
    'interface.organ'
).defines(function(){
    EntitySpiked = EntityOrgan.extend({
        size:{x:92,y:20},
        offset:{x:2,y:60},
        damage:50,
        type:ig.Entity.TYPE.BOTH,
        checkAgainst:ig.Entity.TYPE.A,
        collides:ig.Entity.COLLIDES.FIXED,
        shootTimer:null,
        animSheet:new ig.AnimationSheet('media/sprites/grass-spiked.png',96,96),
        //场景编号默认是草地，如果为1则为雪地
        senceNo:-1,

        init:function(x,y,settings){
            if(this.senceNo == 1){
                this.animSheet = new ig.AnimationSheet('media/sprites/sonw-spiked.png',96,96);
            }
            this.parent(x, y,settings);

            this.shootTimer = new ig.Timer();
            this.addAnim('shoot',0.2,[0,1,2]);
        },
        receiveDamage:function(amount,from){
            //重定义让其不受伤害
        },
        check:function(other){

            if (this.shootTimer.delta() >0) {
                this.currentAnim = this.anims.shoot.rewind();
                other.receiveDamage(this.damage, this);
                this.shootTimer.set(2);
            }
        }
    });
});