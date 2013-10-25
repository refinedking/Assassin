/**
 * Content: 延迟触发器基类
 * User: wangbing
 * Date: 12-3-22
 * CreateTime: a.m 9:32
 * UpdateTime:
 * UpdateContent:
 */

/**
这个实体，在 n 秒的延迟后，对自己所有的目标调用 triggeredBy() 。

例如：设置一个 EntityDelay 作为 EntityTrigger 的目标，
并将应该在延迟后被触发的实体，作为目标连接给 EntityDelay 。


Weltmeister 键：

delay 
	延迟多少秒后，目标被触发。
	默认值：1
	
target.1, target.2, ..., target.n
	延迟后，被调用 triggeredBy() 方法的实体名。
*/

ig.module(
    'game.entities.delay'
).requires(
    'impact.entity'
).defines(function(){
	EntityDelay=ig.Entity.extend({
		_wmDrawBox:true,
		_wmBoxColor:'rgba(255, 100, 0, 0.7)',
		size:{x:8,y:8},
		delay:1,
		delayTimer:null,
		triggerEntity:null,
		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			this.delayTimer=new ig.Timer();
		},
		triggeredBy:function(entity,trigger)
		{
			this.fire=true;
			this.delayTimer.set(this.delay);
			this.triggerEntity=entity;
		},
		update:function()
		{
			if(this.fire&&this.delayTimer.delta()>0)
			{
				this.fire=false;
				for(var t in this.target)
				{
					var ent=ig.game.getEntityByName(this.target[t]);
					if(ent&&typeof(ent.triggeredBy)=='function')
					{
						ent.triggeredBy(this.triggerEntity,this);
					}
				}
			}
		}
	});
});