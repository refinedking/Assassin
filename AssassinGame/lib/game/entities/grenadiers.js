/**
 * Content: 手雷兵
 * User: ws
 * Date: 12-3-22
 * Time: 下午3:15
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.grenadiers'
).requires(
    'interface.moveEnemy',
    'interface.grenadeProjectile'
).defines(function () {
        EntityGrenadiers = EntityMoveEnemy.extend({
            //大小
            size:{x:48, y:84},
            //偏移量
            offset:{x:28, y:8},
            //定义x\y的最大速度
            maxVel:{x:220, y:500},
            //定义地面和空中的加速度
            accelDef:{ground:400, air:500},
            //定义地面和空中的摩擦力
            frictionDef:{ground:500, air:50},

            //射程是半个屏幕
            shootRange:450,
            //伤害
            damage:100,
            shootTimer:null,
            //子弹类型
            projectileClass:null,
            //每次发射子弹的个数
            projectileNum:1,

            inJump:false, //是否处在跳跃
            jump:-150, //起跳速度
            isCollision:false, //是否和水平墙壁发生碰撞
            health:80,
            //两次发射的时间间隔
            time:3,



            animSheet:new ig.AnimationSheet('media/sprites/grenadiers.png', 104, 104),
            model:0,
            init:function (x, y, settings) {
                this.parent(x, y, settings)
                if (this.model == 1) {
                    this.animSheet = new ig.AnimationSheet('media/sprites/grenadiers2.png', 104, 104);
                }
                //初始的动画
                this.addAnim('idle', 0.5, [16, 17]);
                //走得动画
                this.addAnim('crawl', 0.1, [12, 13, 14, 15]);
                //跳的动画
                this.addAnim('jump', 0.1, [10]);
                //下落的动作
                this.addAnim('fall', 0.1, [9]);
                //击中的动画
                this.addAnim('hit', 0.4, [21]);
                //死亡的动画
                this.addAnim('dea', 0.12, [0, 1, 2, 3, 4, 5, 5, 5, 5, 5]);
                //射击的动画
                this.addAnim('shoot', 0.07, [19, 19, 19, 19, 19], true);
                //子弹类型
                this.projectileClass = EntityGrenadeProjectile;
                this.currentAnim.gotoRandomFrame();
                //随机方向
                this.currentAnim.flip.x = (Math.random() > 0.5);
                this.shootTimer = new ig.Timer();
                //随机本对象的方向
                this.flip = (Math.random() > 0.5);
            },

            shoot:function () {
                this.vel.x = 0;
                //设置子弹产生的位置
                var x = this.pos.x;
                var y = this.pos.y;
                ig.game.spawnEntity(this.projectileClass, x, y, {flip:(this.xdir < 0 ? 1 : 0), xdist:this.distanceTo(player)});
                if (this.projectileCount < this.projectileNum - 1) {
                    this.shootTimer.set(0.2);
                    this.projectileCount++;
                }
                else {
                    this.shootTimer.set(this.time);
                    this.projectileCount = 0;
                }
            }
        });
    });