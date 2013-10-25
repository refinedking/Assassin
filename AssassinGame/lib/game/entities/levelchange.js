/**
 * Content: 开启下一关基类
 * User: wangbing
 * Date: 12-3-22
 * CreateTime: a.m 9:32
 * UpdateTime:
 * UpdateContent:
 */

/**
这个实体，当 triggeredBy() 被调用时，调用 ig.game.loadLevel() （通常是通过 EntityTrigger 实体）。

Weltmeister 键：

level
	要加载的关卡名。例如“LevelTest1”，或只是“test1”，将加载“LevelTest1”关卡。
*/
ig.module(
    'game.entities.levelchange'
).requires(
    'impact.entity'
).defines(function(){
	EntityLevelchange=ig.Entity.extend(
	{
		_wmDrawBox:true,
		_wmBoxColor:'rgba(0, 0, 255, 0.7)',
		size:{x:8,y:8},
		chooseLevel:null,
		triggeredBy:function(entity,trigger)
		{
			if(this.chooseLevel)
			{
				var levelName=this.chooseLevel.replace(/^(Level)?(\w)(\w*)/,function(m,l,a,b){return a.toUpperCase()+b;});

                //storage.initUnset(levelName,true);
				ig.game.endLevel(ig.global['Level'+levelName]);
			}
		},
		update:function(){}
	});
});
