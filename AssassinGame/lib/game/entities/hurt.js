/**
 * Content: 具有伤害性实体基类
 * User: wangbing
 * Date: 12-3-22
 * CreateTime: a.m 9:32
 * UpdateTime:
 * UpdateContent:
 */

/**
这个实体，向 triggeredBy() 方法的第一个参数传递的实体输出伤害（通过 ig.Entity 的 receiveDamage() 方法）

换言之，你可以将一个 EntityTrigger 连接到 EntityHurt ，向激活触发器的实体输入伤害。

Weltmeister 键：

damage
	Damage to give to the entity that triggered this entity.
	默认值：10
*/

ig.module(
    'game.entities.hurt'
).requires(
    'impact.entity'
).defines(function(){
	EntityHurt=ig.Entity.extend(
	{
		_wmDrawBox:true,
		_wmBoxColor:'rgba(255, 0, 0, 0.7)',
		size:{x:8,y:8},
		damage:100,
		triggeredBy:function(entity,trigger)
		{
			entity.receiveDamage(this.damage,this);
		},
		update:function(){}
	});
});