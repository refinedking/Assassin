/**
 * Content: 电报机  ***
 * User: wangbing
 * Date: 12-3-26
 * CreateTime: p.m 11:31
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.telegraph'
).requires(
    'game.entities.trigger'
).defines(function () {
    EntityTelegraph = ig.Entity.extend({
        _wmDrawBox:true,
        _wmBoxColor:'rgba(255, 0, 0, 0.7)',
        size:{x:48, y:48},
        animSheet:new ig.AnimationSheet('media/sprites/telegraph.png',48,48),
        init:function (x, y, settings) {
            this.quakeTimer = new ig.Timer();
            this.addAnim('idle',0.1,[0]);
            this.addAnim('hit',0.1,[0,1]);
            this.parent(x, y, settings);
        },
        update:function () {
        },
        triggeredBy:function(entity,trigger)
        {
            this.quakeTimer.set(this.duration);
            this.currentAnim = this.anims.hit;
            this.kill();
        }
    });
});