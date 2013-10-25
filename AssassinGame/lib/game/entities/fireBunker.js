/**
 * Content: 喷火碉堡
 * User: ws
 * Date: 12-3-22
 * Time: 下午5:06
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.fireBunker'
).requires(
    'impact.entity',
    "interface.enemy",
    'interface.projectile',
    'interface.fireBunkerProjectile'
).defines(function () {
    EntityFireBunker = EntityEnemy.extend({
        //大小
        size:{x:145,y:85},
        //偏移量
        offset:{x:196,y:147},
        vel:{x:0,y:0},
        //射程是全屏
        shootRange:900,
        //伤害
        damage:50,
        shootTimer: null,
        //子弹类型
        projectileClass:null,
        //每次发射子弹的个数
        projectileNum:3,
        health:400,
        //两次发射的时间间隔
        time:2,
        find:{x:900,y:500},

        animSheet:new ig.AnimationSheet('media/sprites/bunker.png',526,262),

        model:0,
        init:function(x,y,settings){

            this.parent(x, y, settings);
            if(this.model == 1){
                this.animSheet = new ig.AnimationSheet('media/sprites/bunker2.png',526,262);
            }
          //初始状态
          this.addAnim('idle',0.5,[0]);
          //被射击状态
          this.addAnim('hit',0.5,[0]);
          //射击状,
          this.addAnim('shoot',0.5,[0]);
          //死亡状态
          this.addAnim('dea',0.1,[0,1,2,3,4,5,6,7,8,9]);
          this.projectileClass = EntityFireBunkerProjectile;
          this.currentAnim.gotoRandomFrame();
          this.currentAnim.flip.x = (Math.random() > 0.5);
          this.shootTimer = new ig.Timer();
          this.flip = (Math.random() > 0.5);
        },

        update:function(){
          player = ig.game.getEntitiesByType(EntityPlayer)[0];
          if(player){
              this.findPalyer();

              if(this.currentAnim == this.anims.dea){
                  this.currentAnim.flip.x = (this.xdir<0);
                  this.currentAnim.update();
                  this.size.y=40;
                  this.offset.y = 165;
                  if(this.currentAnim.loopCount){
                      ig.game.killCount++;
                      this.kill();
                  }
                  this.parent();
                  return;
          }

          if(this.seenPlayer&&this.shootTimer.delta()>0&&this.xdist <=this.find.x){
              this.shoot();
              this.currentAnim=this.anims.shoot.rewind();
              this.currentAnim.flip.x=(this.xdir>0);
          }
        }
        },

        shoot:function(){
        //设置子弹产生的位置
        var x=this.pos.x + (this.xdir <0?0:110);
        var y=this.pos.y + 55;
        ig.game.spawnEntity(this.projectileClass, x, y, {flip:(this.xdir < 0 ? 1 : 0)});
        if (this.projectileCount < this.projectileNum-1) {
                this.shootTimer.set(0.2);
                this.projectileCount++;
            }
        else {
                this.shootTimer.set(this.time);
                this.projectileCount=0;
             }
        },

        receiveDamage:function(amount,from)
        {
          if (this.health>0) {
              this.anims.hit.flip.x = this.currentAnim.flip.x;
              this.seenPlayer = true;
              this.health -= amount;
              if (this.health <= 0) {
                  this.checkAgainst = ig.Entity.TYPE.NONE;
                  this.type = ig.Entity.TYPE.NONE;
                  this.collides = ig.Entity.COLLIDES.NEVER,
                  this.currentAnim = this.anims.dea.rewind();
              } else {
                  this.currentAnim = this.anims.hit.rewind();
              }
              this.currentAnim.update();
          }
        },

        //当和该对象发生动态碰撞时调用
        check:function(other)
        {
          //移除血量
          other.receiveDamage(this.damage,this);
        }
    });
});
