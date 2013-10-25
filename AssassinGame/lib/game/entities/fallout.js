/**
 * Content: 掉落的武器 ***
 * User: wangbing
 * Date: 12-3-23
 * CreateTime: p.m 4:01
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.fallout'
).requires(
    'impact.entity',
    'interface.flameProjectile',
    'interface.shotgunProjectile',
    'interface.playerProjectile',
    'interface.rifleProjectile',
    'interface.assaultProjectile',
    'interface.cannonballProjectile',
    'interface.playerGrenadeProjectile'
).defines(function () {
        EntityFallout = ig.Entity.extend({
            size:{x:144, y:72},
            offset:{x:0, y:20},
            checkAgainst:ig.Entity.TYPE.A,
            animSheet:new ig.AnimationSheet('media/sprites/falloutweapon.png', 144, 144),
            weaponCount:Math.floor(Math.random() * 6),
            weapon:-1,
            weaponList:{},
            weaponNum:10,
            playerAnimSheet:null,
            init:function (x, y, settings) {
                this.parent(x, y, settings);
                this.addAnim('idle', 0.1, [1, 2, 3, 4, 5, 6]);
                if (this.weapon == -1) {
                    this.currentAnim.gotoFrame(this.weaponCount);
                }else{
                    this.currentAnim.gotoFrame(this.weapon);
                }
                this.weaponList = new Array();

                this.playerAnimSheet = new Array();
                this.playerAnimSheet = [new ig.AnimationSheet('media/sprites/player_rifle.png', 96, 96),new ig.AnimationSheet('media/sprites/player_assault.png', 108, 108),new ig.AnimationSheet('media/sprites/player_shotgun.png', 118, 118),new ig.AnimationSheet('media/sprites/player_rockgun.png', 118, 118),new ig.AnimationSheet('media/sprites/player_flam.png', 108, 108),new ig.AnimationSheet('media/sprites/player_grenade.png', 96, 96)];
                this.weaponList = [EntityRifleProjectile, EntityAssaultProjectile, EntityShotgunProjectile, EntityCannonballProjectile, EntityFlameProjectile, EntityPlayerGrenadeProjectile];
            },
            check:function (other) {
                this.kill();
                var player = ig.game.getEntitiesByType(EntityPlayer)[0];
                if (this.weapon == -1) {
                    player.projectileClass = this.weaponList[this.weaponCount];
                    player.animSheet = this.playerAnimSheet[this.weaponCount];
                }else{
                    player.projectileClass = this.weaponList[this.weapon];
                    player.animSheet = this.playerAnimSheet[this.weapon];
                }
                if( player.projectileClass == EntityShotgunProjectile|| player.projectileClass ==EntityCannonballProjectile){
                    player.offset= {x:35,y:25};
                }else if(player.projectileClass ==EntityAssaultProjectile || player.projectileClass == EntityFlameProjectile){
                    player.offset = {x:30, y:15};
                }else{
                    player.offset = {x:25, y:4};
                }
                player.setupAnimation();
                player.projectileCount = this.weaponNum;
            },
            update:function () {
                //this.currentAnim.update();
            }
        });
    });