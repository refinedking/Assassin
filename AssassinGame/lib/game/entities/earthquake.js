/**
 * Content: 地震实体   ***
 * User: wangbing
 * Date: 12-3-26
 * CreateTime: a.m 9:32
 * UpdateTime:
 * UpdateContent:
 */

ig.module(
    'game.entities.earthquake'
).requires(
    'game.entities.trigger'
).defines(function () {
    EntityEarthquake = ig.Entity.extend({
        _wmDrawBox:true,
        _wmBoxColor:'rgba(80, 130, 170, 0.7)',
        size:{x:8, y:8},
        duration:1,
        strength:8,
        screen:{x:0, y:0},
        quakeTimer:null,
        init:function (x, y, settings) {
            this.quakeTimer = new ig.Timer();
            this.parent(x, y, settings);
        },
        triggeredBy:function (entity, trigger) {
            this.quakeTimer.set(this.duration);
//            entity.receiveDamage(this.damage,this);
        },
        update:function () {
            var delta = this.quakeTimer.delta();
            if (delta < -0.1) {
                var s = this.strength * Math.pow(-delta / this.duration, 2);
                if (s > 0.5) {
                    ig.game.screen.x += Math.random().map(0, 1, -s, s);
                    ig.game.screen.y += Math.random().map(0, 1, -s, s);
                }
            }
        }
    });
});
