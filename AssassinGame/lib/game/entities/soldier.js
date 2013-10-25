/**
 * Content: 敌兵实体
 * User: ws
 * Date: 12-3-19
 * CreateTime: a.m 11:19
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.soldier'
).requires(
    'interface.soldierProjectile',
    'interface.moveEnemy'
).defines(function(){
    EntitySoldier = EntityMoveEnemy.extend(
        {
            //大小
            size:{x:48,y:84},
            //偏移量
            offset:{x:24,y:8},
            //定义x\y的最大速度
            maxVel:{x:220, y:500},
            //定义地面和空中的加速度
            accelDef:{ground:400, air:500},
            //定义地面和空中的摩擦力
            frictionDef:{ground:500, air:50},

            //射程是全屏
            shootRange:900,
            //伤害
            damage:20,
            shootTimer: null,
            //子弹类型
            projectileClass:null,
            //每次发射子弹的个数
            projectileNum:1,

            inJump:false,//是否处在跳跃
            jump:-150,//起跳速度
            isCollision:false,//是否和水平墙壁发生碰撞
            health:40,
            //两次发射的时间间隔
            time:3,
            find:{x:400,y:400},

            animSheet:new ig.AnimationSheet('media/sprites/soldier.png',98,98),
            model:0,
            init:function (x, y, settings) {
                this.parent(x,y,settings);
                if (this.model == 1) {
                    this.animSheet = new ig.AnimationSheet('media/sprites/soldier2.png', 98, 98);
                }
                //初始的动画
                this.addAnim('idle',0.5,[24,25]);
                //走得动画
                this.addAnim('crawl',0.1,[12,13,14,15]);
                //跳的动画
                this.addAnim('jump',0.1,[5]);
                //下落的动作
                this.addAnim('fall',0.1,[5]);
                //击中的动画
                this.addAnim('hit',0.4,[17]);
                //死亡的动画
                this.addAnim('dea',0.12,[18,18,19,19,20,20,21,21,22,22,23,23,23,23,23,23,23]);
                //射击的动画
                this.addAnim('shoot',0.2,[10,11]);
                //子弹类型
                this.projectileClass = EntitySoldierProjectile;
                // this.jumpTimer = new ig.Timer();
                this.currentAnim.gotoRandomFrame();
                //随机方向
                this.currentAnim.flip.x=(Math.random()>0.5);
                this.shootTimer = new ig.Timer();
                //随机本对象的方向
                this.flip=(Math.random()>0.5);

            }
        });
});

