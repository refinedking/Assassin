/**
 * Content: 电梯
 * User: ws
 * Date: 12-3-22
 * CreateTime: a.m 9:32
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.mover'
).requires(
    'impact.entity'
).defines(function(){
	EntityMover=ig.Entity.extend({
        size:{x:144,y:23},
        offset:{x:2,y:40},
		maxVel:{x:200,y:200},
		type:ig.Entity.TYPE.BOTH,
		checkAgainst:ig.Entity.TYPE.NONE,
		collides:ig.Entity.COLLIDES.FIXED,
		target:null,
		targets:[],
		currentTarget:0,
		speed:100,
		gravityFactor:0,
        frictionDef:{ground:600, air:50},//定义地面和空中的摩擦力
		animSheet:new ig.AnimationSheet('media/sprites/bridge.png',144,96),
		init:function(x,y,settings)
		{
			this.addAnim('idle',0.1,[0,1,2,3]);
			this.parent(x,y,settings);
			this.targets=ig.ksort(this.target);
		},
		update:function()
		{
			var oldDistance=0;
			var target=ig.game.getEntityByName(this.targets[this.currentTarget]);
			if(target)
			{
				oldDistance=this.distanceTo(target);
				var angle=this.angleTo(target);
				this.vel.x=Math.cos(angle)*this.speed;
				this.vel.y=Math.sin(angle)*this.speed;
			}
			else
			{
				this.vel.x=0;
				this.vel.y=0;
			}
			this.parent();
			var newDistance=this.distanceTo(target);
			if(target&&(newDistance>oldDistance||newDistance<0.5))
			{
				this.pos.x=target.pos.x+target.size.x/2-this.size.x/2;
				this.pos.y=target.pos.y+target.size.y/2-this.size.y/2;
				this.currentTarget++;
				if(this.currentTarget>=this.targets.length&&this.targets.length>1)
				{
					this.currentTarget=0;
				}
			}
		},
		receiveDamage:function(amount,from){}
	});
});
