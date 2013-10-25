/**
 * Content: 机关类基类
 * User: ws
 * Date: 12-3-26
 * CreateTime: a.m 9:06
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'interface.organ'
).requires(
    'impact.entity'
).defines(function(){
    EntityOrgan = ig.Entity.extend({
        damage:0,
        type:ig.Entity.TYPE.B,
        type: ig.Entity.TYPE.B,//设置自身的type
        checkAgainst: ig.Entity.TYPE.A,//设置敌方的type
        collides: ig.Entity.COLLIDES.PASSIVE,

        check:function(other){
            other.receiveDamage(this.damage,this);
        },

        receiveDamage:function(amount,from){}
    });
});