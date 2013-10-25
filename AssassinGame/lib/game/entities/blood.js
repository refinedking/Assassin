/**
 * 显示人物的血量
 * User: ws
 * Date: 12-3-29
 * Time: 下午9:52
 * To change this template use File | Settings | File Templates.
 */
ig.module(
    'game.entities.blood'
).requires(
    'impact.entity'
).defines(function(){
       EntityBlood = ig.Entity.extend({
           gravityFactor:0,
           size:{x:27,y:27},//大小
           offset:{x:10,y:10},//偏移量
           type:ig.Entity.TYPE.NONE,
           checkAgainst:ig.Entity.TYPE.NONE,
           collides:ig.Entity.COLLIDES.NEVER,
           player:null,
           zIndex:10000,
           animSheet:new ig.AnimationSheet('media/sprites/player-heat.png',48,48),
           init:function(x,y,settings){
               this.addAnim('idle',0.1,[0]);
               this.parent(x,y,settings);
           },
           update:function(){
               this.player = ig.game.getEntitiesByType(EntityPlayer)[0];
               if(this.player){
                   this.pos.x = ig.game.screen.x +50;
                   this.pos.y = ig.game.screen.y +50;
               }

               this.parent();
           },
           receiveDamage:function(){},
           check:function(){}
       }) ;
    });