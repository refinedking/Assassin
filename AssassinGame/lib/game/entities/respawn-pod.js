/**
 * Content: 复活点
 * User: wangbing
 * Date: 12-3-26
 * CreateTime: p.m 9:32
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.respawn-pod'
).requires(
    'impact.entity'
).defines(function () {
        EntityRespawnPod = ig.Entity.extend({
            size:{x:130, y:130},
            zIndex:-1, //在下层，值越大越最后绘制
            type:ig.Entity.TYPE.NONE,
            checkAgainst:ig.Entity.TYPE.A,
            collides:ig.Entity.COLLIDES.NEVER,
            animSheet:new ig.AnimationSheet('media/sprites/respawn-pod2.png', 130, 130),
            //地图类型，默认为旗帜，草地为1，雪地为2
            senceNo:-1,

            init:function (x, y, settings) {
                this.parent(x, y, settings);
                if (this.senceNo == 1) {
                    this.addAnim('idle', 0.5, [0]);
                    this.addAnim('activated', 0.2, [1, 2]);
                    this.addAnim('respawn', 0.2, [1, 2]);
                } else if(this.senceNo == 2){
                    this.addAnim('idle', 0.5, [3]);
                    this.addAnim('activated', 0.2, [4, 5]);
                    this.addAnim('respawn', 0.2, [4, 5]);
                }else{
                    this.animSheet = new ig.AnimationSheet('media/sprites/respawn-pod.png', 130, 130);
                    this.addAnim('idle', 0.5, [0]);
                    this.addAnim('activated', 0.1, [2, 3]);
                    this.addAnim('respawn', 0.1, [2, 3]);
                }
            },
            update:function () {
                if (this.currentAnim == this.anims.respawn && this.currentAnim.loopCount > 4) {
                    this.currentAnim = this.anims.activated;
                }
                this.currentAnim.update();
            },
            getSpawnPos:function () {
                return{x:(this.pos.x + 11), y:this.pos.y};
            },
            activate:function () {
                this.active = true;
                this.currentAnim = this.anims.activated;
                ig.game.lastCheckpoint = this;
            },
            check:function (other) {
                if (!this.active) {
                    this.activate();
                }
            }
        });
    });
