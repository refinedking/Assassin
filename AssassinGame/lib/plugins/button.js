// 在屏幕上绘制button
// 有四种状态
// * hidden - 不显示
// * idle - 初始状态
// * active - 被点击
// * deactive - 不可用

ig.module(
    'plugins.button'
).requires(
    'impact.entity'
)
    .defines(function () {

        Button = ig.Entity.extend({
            // 大小
            size:{ x:96, y:96 },
            //位置
            location:{x:0, y:0},
            //状态
            state:'idle',
            zIndex:10000,

            _oldPressed:false,
            _startedIn:false,

            init:function (x, y, settings) {
                this.parent(x, y, settings);
                //添加初始状态动画
                this.addAnim('idle', 0.2, [0]);
                //添加被点击的动画
                this.addAnim('active', 0.2, [1]);
                //添加不可用的动画
                this.addAnim('deactive', 0.2, [2]);
            },

            update:function () {
                //所在位置
                this.pos.x = ig.game.screen.x + this.location.x;
                this.pos.y = ig.game.screen.y + this.location.y;
                //判断是否可见
                if (this.state !== 'hidden') {
                    //获取输入状态
                    var _clicked = ig.input.state('click');
                    //判断是否输入并且输入有效
                    if (!this._oldPressed && _clicked && this._inButton()) {
                        this._startedIn = true;
                    }

                    if (this._startedIn && this.state !== 'deactive' && this._inButton()) {
                        // 当按钮被按下
                        if (_clicked && !this._oldPressed) {
                            this.setState('active');
                            this.pressedDown();
                        }
                        else if (_clicked) { // pressed
                            this.setState('active');
                            this.pressed();
                        }
                        else if (this._oldPressed) { // up
                            this.setState('idle');
                            this.pressedUp();
                        }
                    }
                    else if (this.state === 'active') {
                        this.setState('idle');
                    } else if (this.state === 'deactive') {
                        this.setState('deactive');
                    }

                    if (this._oldPressed && !_clicked) {
                        this._startedIn = false;
                    }

                    this._oldPressed = _clicked;
                }
            },

            draw:function () {
                this.parent();
            },

            //设置动画
            setState:function (s) {
                this.state = s;
                if (this.state !== 'hidden') {
                    this.currentAnim = this.anims[ this.state ].rewind();
                }
            },

            //按下的方法
            pressedDown:function () {
            },
            //点击事件方法
            pressed:function () {
            },
            //释放方法
            pressedUp:function () {
            },

            //获取是不是在按钮范围内点击
            _inButton:function () {
                return ig.input.mouse.x + ig.game.screen.x > this.pos.x &&
                    ig.input.mouse.x + ig.game.screen.x < this.pos.x + this.size.x &&
                    ig.input.mouse.y + ig.game.screen.y > this.pos.y &&
                    ig.input.mouse.y + ig.game.screen.y < this.pos.y + this.size.y;
            }
        });

    });