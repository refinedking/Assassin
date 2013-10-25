/**
 * Content: 装备箱
 * User: wangbing
 * Date: 12-3-22
 * CreateTime: a.m 9:32
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.crate'
).requires(
    'impact.entity',
    'game.entities.fallout',
    'game.entities.hematinic'
).defines(function(){
    EntityCrate = ig.Entity.extend({
        size:{x:48,y:48},
        offset:{x:72,y:48},
        friction:{x:100, y:100},
        type:ig.Entity.TYPE.B,
        checkAgainst:ig.Entity.TYPE.A,
        collides:ig.Entity.COLLIDES.ACTIVE,
        health:50,
        damage:50,
        animSheet:new ig.AnimationSheet('media/sprites/crate.png',192,96),
        init:function(x,y,settings)
        {
            this.addAnim('idle',0.17,[0]);
            this.addAnim('hit',0.1,[6,7]);
            this.addAnim('boom',0.1,[0,1,2,3,4,5]);
            this.parent(x,y,settings);
        },
        kill:function()
        {
            this.parent();
        },
        receiveDamage:function(amount,from){
            this.health -= amount;
            if (this.health<=0) {
                this.kill();
                var a = [];
                //获取所有实体
                for (var i = 0; i < ig.game.entities.length; i++) {
                    var ent = ig.game.entities[i];
                    //没有死亡，并且除去自身和子弹
                    if (!ent._killed) {

                        var entX = Math.abs(ent.pos.x - this.pos.x);
                        var entY = Math.abs(ent.pos.y - this.pos.y);

                        if (entX <= 72 && entY <= 72) {
                            a.push(ent);
                        }

                    }
                }

                for (var j = 0; j < a.length; j++) {
                    a[j].receiveDamage(this.damage, this);
                }

                if(Math.random()>0.5)
                {
                    if(Math.random()> 0.5)
                    {
                        ig.game.spawnEntity(EntityFallout, x, y, {flip:this.flip, gravityFactor:0});
                    }
                    else
                    {
                        ig.game.spawnEntity(EntityHematinic, x, y, {flip:this.flip, gravityFactor:0});
                    }
                }
            }
        },
        check:function(other){}
    });
});

