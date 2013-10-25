/**
 * 显示player使用的枪
 * User: chio3g
 * Date: 12-3-30
 * Time: 下午3:17
 * UpdateTime:
 * UpdateContent:
 */


ig.module(
    'game.entities.weapon'
).requires(
    'impact.entity'
).defines(function(){
        EntityWeapon = ig.Entity.extend({
            gravityFactor:0,
            size:{x:35,y:30},//大小
            offset:{x:58,y:60},//偏移量
            type:ig.Entity.TYPE.NONE,
            checkAgainst:ig.Entity.TYPE.NONE,
            collides:ig.Entity.COLLIDES.NEVER,
            player:null,
            animSheet:new ig.AnimationSheet('media/sprites/falloutweapon2.png',144,144),
            init:function(x,y,settings){
                this.addAnim('idle',0.1,[0]);
                this.addAnim('shotgum',0.1,[3]);//散弹枪
                this.addAnim('flame',0.1,[5]);//火焰枪
                this.addAnim('cannon',0.1,[4]);
                this.addAnim('assault',0.1,[2]);
                this.addAnim('rifle',0.1,[1]);
                this.addAnim('grenade',0.1,[6]);
                this.parent(x,y,settings);
            },
            update:function(){
                this.player = ig.game.getEntitiesByType(EntityPlayer)[0];
                if(this.player){

                    if(this.player.projectileClass == EntityShotgunProjectile){
                        this.currentAnim = this.anims.shotgum.rewind();
                    }else if(this.player.projectileClass == EntityFlameProjectile){
                        this.currentAnim = this.anims.flame.rewind();
                    }else if(this.player.projectileClass == EntityAssaultProjectile){
                        this.currentAnim = this.anims.assault.rewind();
                    }else if(this.player.projectileClass == EntityRifleProjectile){
                        this.currentAnim = this.anims.rifle.rewind();
                    }else if(this.player.projectileClass == EntityPlayerGrenadeProjectile){
                        this.currentAnim = this.anims.grenade.rewind();
                    }else if(this.player.projectileClass == EntityCannonballProjectile){
                        this.currentAnim = this.anims.cannon.rewind();
                    }else{
                        this.currentAnim = this.anims.idle;
                    }
                    this.pos.x = ig.game.screen.x +60;
                    this.pos.y = ig.game.screen.y +100;
                }
                this.parent();
            },
            receiveDamage:function(){},
            check:function(){}

        }) ;
    });