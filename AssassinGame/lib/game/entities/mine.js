/**
 * Content: 地雷
 * User: ws
 * Date: 12-3-26
 * Time: 下午1:23
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.mine'
).requires(
    'interface.organ'
).defines(function(){
    EntityMine = EntityOrgan.extend({
        //碰撞区域的大小
        size:{x:90,y:25},
        //偏移量
        offset:{x:50,y:67},
        //自身的检测类型
        type:ig.Entity.TYPE.NONE,
        //碰撞检测类型
        checkAgainst:ig.Entity.TYPE.A,
        //碰撞类型
        collides:ig.Entity.COLLIDES.NEVER,
        //生命值
        health:10,
        //伤害值
        damage:100,
        deaTimer :null,
        animSheet:new ig.AnimationSheet('media/sprites/mine.png',192,96),
        init:function(x,y,settings)
        {
            this.addAnim('idle',0.17,[10,10,10,10,10,10,10,10,10,11]);
            this.addAnim('dea',0.15,[0,1,2,3,4,5,6,7,8,9]);
            this.deaTimer = new ig.Timer();
            this.currentAnim.gotoRandomFrame();
            this.parent(x,y,settings);
        },


        update:function(){
            this.parent();

            if(this.currentAnim == this.anims.dea && this.currentAnim.loopCount){
                this.kill();
            }
        },
        check:function(other)
        {
            //this.check2();
            //爆炸后的不发生碰撞检测
            other.receiveDamage(this.damage,this);
            this.currentAnim = this.anims.dea.rewind();
            this.checkAgainst = ig.Entity.TYPE.NONE;
            this.type = ig.Entity.TYPE.NONE;
            this.collides = ig.Entity.COLLIDES.NEVER;
        }
        /*
        check2:function(){
            //获取所有实体
            for( var i = 0; i < ig.game.entities.length; i++ ) {
                var ent = ig.game.entities[i];
                //没有死亡，并且除去自身和子弹
                if(!ent._killed && !(ent instanceof EntityMine)) {
                    if (ent.distanceTo(this) < 150) {
                        ent.receiveDamage(this.damage,this);
                    }
                }
            }
        }
        */
    });
    });