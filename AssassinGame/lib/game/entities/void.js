/**
 * Content: 电梯目标对象
 * User: wangbing
 * Date: 12-3-22
 * CreateTime: a.m 9:32
 * UpdateTime:
 * UpdateContent:
 */

/**
这个实体什么也不做，只是坐在那里。它可以用来作为其它实体的目标，比如 movers 。
*/

ig.module(
    'game.entities.void'
).requires(
    'impact.entity'
).defines(function(){
	EntityVoid=ig.Entity.extend(
	{
		_wmDrawBox:true,
		_wmBoxColor:'rgba(128, 28, 230, 0.7)',
		size:{x:8,y:8},
		update:function(){}
	});
});