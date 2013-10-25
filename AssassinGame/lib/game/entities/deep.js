/**
 * Content: 深渊
 * User: ws
 * Date: 12-3-26
 * Time: 上午11:42
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.deep'
).requires(
    'impact.entity'
).defines(function(){
   EntityDeep = ig.Entity.extend(
       {
           // 默认大小
           size:{x:96,y:96},
           //控制在地图编辑器重实体大小能否改变
           _wmScalable:true,
           //控制在地图编辑器绘出实体的盒子外形
           _wmDrawBox:true,
           //控制在地图编辑器绘出实体的盒子外形的颜色
           _wmBoxColor:'rgba(0, 196, 0, 0.7)',
           target:null,
           //延迟时间
           delayTimer:null,
           //伤害值
           damage:25,
           type:ig.Entity.TYPE.NONE,
           //定义触发实体的碰撞检测类型
           checkAgainst:ig.Entity.TYPE.BOTH,
           //忽略所有的碰撞，不管其他实体拥有哪种碰撞模式
           collides:ig.Entity.COLLIDES.NEVER,

           init:function(x,y,settings)
           {
               if(settings.checks)
               {
                   this.checkAgainst=ig.Entity.TYPE[settings.checks.toUpperCase()]||ig.Entity.TYPE.A;
                   delete settings.check;
               }
               this.parent(x,y,settings);
               this.delayTimer=new ig.Timer();
               //延迟时间为0.3秒
               this.delayTimer.set(0.3);
           },
           //碰撞检测
           check:function(other)
           {
               if (this.delayTimer.delta()>0) {
                   other.receiveDamage(this.damage, this);
                   this.delayTimer.reset();
               }

           },
           update:function(){}
       });
});
