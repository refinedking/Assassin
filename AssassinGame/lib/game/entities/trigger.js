/**
 * Content: 触发器基类
 * User: wangbing
 * Date: 12-3-22
 * CreateTime: a.m 9:32
 * UpdateTime:
 * UpdateContent:
 */

/**
这个实体调用它的每一个目标的 triggeredBy( entity, trigger ) 方法。
#entity# 是触发此触发器的实体，而 #trigger# 是触发器本身。

Weltmeister 键：

checks
	规定哪个类型的实体可以触发这个触发器。A、B 或 BOTH 。
	默认值：A

wait
	触发器可以再次被触发的秒数。设置为 -1 则指定为“从不”。比如触发器只能被触发一次。
	默认值：-1
	
target.1, target.2 ... target.n
	triggeredBy() 方法被调用的实体名。
*/

ig.module(
    'game.entities.trigger'
).requires(
    'impact.entity'
).defines(function(){
	EntityTrigger=ig.Entity.extend(
	{
		size:{x:16,y:16},// 默认大小
		_wmScalable:true,//控制在地图编辑器重实体大小能否改变
		_wmDrawBox:true,//控制在地图编辑器绘出实体的盒子外形
		_wmBoxColor:'rgba(196, 255, 0, 0.7)',//控制在地图编辑器绘出实体的盒子外形的颜色
		target:null,
		delay:-1,//定义延迟秒数，-1为只触发一次
		delayTimer:null,//延迟时间
		canFire:true,
		type:ig.Entity.TYPE.NONE,
		checkAgainst:ig.Entity.TYPE.A,//定义触发实体的碰撞检测类型
		collides:ig.Entity.COLLIDES.NEVER,//忽略所有的碰撞，不管其他实体拥有哪种碰撞模式
        damage:1000,
		init:function(x,y,settings)
		{
			if(settings.checks)
			{
				this.checkAgainst=ig.Entity.TYPE[settings.checks.toUpperCase()]||ig.Entity.TYPE.A;
				delete settings.check;
			}
			this.parent(x,y,settings);
			this.delayTimer=new ig.Timer();//立即触发
		},
		check:function(other)//碰撞检测
		{
			if(this.canFire&&this.delayTimer.delta()>=0)//
			{
				if(typeof(this.target)=='object')//检测对象是否存在
				{
					for(var t in this.target)//遍历所有关联触发器的实体
					{
						var ent=ig.game.getEntityByName(this.target[t]);//通过名称获取实体
						if(ent&&typeof(ent.triggeredBy)=='function')
						{
							ent.triggeredBy(other,this);//回调关联实体的triggeredBy函数
						}
					}
				}
				if(this.delay==-1){this.canFire=false;}
				else{this.delayTimer.set(this.delay);}//
			}
		},
		update:function(){}
	});
});
