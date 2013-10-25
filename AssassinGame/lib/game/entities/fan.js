/**
 * Content: 风扇  ***
 * User: wangbing
 * Date: 12-3-26
 * CreateTime: a.m 11:31
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.fan'
).requires(
    'impact.entity'
).defines(function(){
    EntityFan=ig.Entity.extend({
        size: {x:94,y:40},
        offset: {x:1,y:25},
        type:ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.FIXED,
        high: 600,
        animSheet:new ig.AnimationSheet('media/sprites/fan.png',96,96),


        cwalTimer:null,
        init:function(x,y,settings)
        {
            this.addAnim('idle',1,[0]);
            this.addAnim('cwal',0.1,[1,2],true);
            this.cwalTimer = new ig.Timer();
            this.parent(x,y,settings);
        },
        update:function()
        {
            if(this.cwalTimer.delta() >0){
                this.currentAnim = this.anims.idle;
            }
            this.parent();
        },
        check:function(other){
            this.currentAnim = this.anims.cwal.rewind();
            this.cwalTimer.set(3);
            other.vel.y = -this.high;

            if(other.currentAnim == other.anims.fall){
                other.fanJump = true;
            }
        }
    });
});