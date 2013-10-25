/**
 * Content: 补血剂
 * User: wangbing
 * Date: 12-3-23
 * CreateTime: p.m 4:01
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.hematinic'
).requires(
    'impact.entity'
).defines(function(){
    EntityHematinic=ig.Entity.extend({
        size:{x:45,y:45},
        offset:{x:4,y:4},
        checkAgainst:ig.Entity.TYPE.A,
        animSheet:new ig.AnimationSheet('media/sprites/heart.png',48,48),
        blood:10,
        init:function(x,y,settings){
            this.parent(x,y,settings);
            this.addAnim('idle',0.5,[0,1,2,3]);
            this.currentAnim.gotoRandomFrame();
        },
        check:function(other){
            this.kill();
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            //player.health += this.blood;
            player.health = 200;
        },
        update:function(){
            this.currentAnim.update();
        }
    });
});