/**
 * Content: 油桶
 * User: ws
 * Date: 12-3-26
 * Time: 下午2:35
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.oilDrum'
).requires(
    'interface.organ'
).defines(function(){
    EntityOilDrum = EntityOrgan.extend({
        size:{x:40,y:94},
        offset:{x:125,y:95},
        friction:{x:10000, y:10000},
        type:ig.Entity.TYPE.B,
        checkAgainst:ig.Entity.TYPE.BOTH,
        collides:ig.Entity.COLLIDES.FIXED,
        health:50,
        damage:100,
        die:false,
        zIndex:-1,
        music:new ig.Sound('media/sounds/bmbm.ogg',false),
        animSheet:new ig.AnimationSheet('media/sprites/iol.png',288,192),
        init:function(x,y,settings)
        {
            this.addAnim('idle',0.17,[0]);
            this.addAnim('dea',0.2,[0,1,2,3,4,5,6,7,8,9],true);
            this.addAnim('hit',0.1,[10,11,10,11],true);
            this.currentAnim.gotoRandomFrame();
            this.parent(x,y,settings);
        },
        update:function(){
            if(this.currentAnim == this.anims.dea && this.currentAnim.loopCount){
                this.kill();
            }
            this.parent();
        },
        kill:function()
        {
//                this.sfxExplode.play();
            this.parent();
        },
        receiveDamage:function(amount,from){
            this.health -= amount;
            if (this.health<=0) {

                if (!this.die) {
                    this.checkAgainst =ig.Entity.TYPE.NONE;
                    this.collides = ig.Entity.COLLIDES.NEVER;
                    this.type = ig.Entity.TYPE.NONE;
                    //获取所有实体
                    for( var i = 0; i < ig.game.entities.length; i++ ) {
                        var ent = ig.game.entities[i];
                        //没有死亡，并且除去自身和子弹
                        if(!ent._killed && !(ent instanceof EntityOilDrum)) {
                            if (ent.distanceTo(this) < 150) {
                                if(ent.type==ig.Entity.TYPE.A||ent.type==ig.Entity.TYPE.B)
                                    ent.receiveDamage(this.damage,this);
                            }
                        }
                    }
                    this.currentAnim = this.anims.dea.rewind();
                    this.die = true;
                    this.music.play();
                }
            }
            else{
                this.currentAnim = this.anims.hit.rewind();
            }
        },
        check:function(other){}
    });
});
