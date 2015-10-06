'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var mainColor = '#EE3326';

var AutoSlider = (function () {
    function AutoSlider(slider) {
        _classCallCheck(this, AutoSlider);

        this.loader = this.loader;
        this.slider = slider;
    }

    _createClass(AutoSlider, [{
        key: 'loader',
        value: function loader(delay, value) {
            var _this = this;

            delay -= 10;
            var $loader = this.slider.$loader,
                reset = function reset() {
                return $loader.className = 'value';
            },
                maxShift = this.slider.shift != this.slider.maxShift() + 100;

            if (!maxShift && this.slider.carousel) {
                this.slider.moveTo(0);
            } else if (value > 1) {
                $loader.style.animationDuration = delay / 1000 + 's';
                $loader.className += ' maxWidth';
                setTimeout(function () {
                    reset();
                    _this.slider.next(true);
                }, delay);
            }
        }
    }, {
        key: 'start',
        value: function start(delay) {
            var _this2 = this;

            delay = delay || 2000;
            this.loader(delay, 100);
            this.heart = setInterval(function () {
                _this2.loader(delay, 100);
            }, delay);
        }
    }, {
        key: 'stop',
        value: function stop() {
            clearInterval(this.heart);
        }
    }]);

    return AutoSlider;
})();

var Slider = (function () {
    function Slider($slider) {
        var _this3 = this;

        _classCallCheck(this, Slider);

        this.slideOnScreen = 2;
        this.slide = 0;
        this.shift = 0;
        this.matchMQ = true;
        this.touchstop = this.touchStop;
        this.mediaQuery = this.mediaQuery;

        this.$slider = $slider;
        this.$prev = $slider.children[0];
        this.$next = $slider.children[1];
        this.$slides = $slider.children[2].firstElementChild;
        this.$loader = $slider.children[3].firstElementChild;
        if ($slider.children[4]) {
            this.lastDot = 0;
            this.$dots = $slider.children[4];
            this.createDots();
            this.$dots.children[this.shift / 100].style.background = mainColor;
        }

        this.autoSlider = new AutoSlider(this);

        if (this.$slider.id) slidersByIds[this.$slider.id] = this;

        this.options = function (options) {
            Object.keys(options).forEach(function (key) {
                _this3[key] = options[key];
                switch (key) {
                    case 'slideOnScreen':
                        _this3.matchMQ = false;
                        break;
                }
            });
            return _this3;
        };

        if (this.slide == 0) this.$prev.style.transform = 'scale(0)';

        this.$prev.onclick = this.prev.bind(this);
        this.$next.onclick = this.next.bind(this);

        this.$slides.onmousedown = this.touchFire.bind(this);
        this.$slides.addEventListener('touchstart', this.touchFire.bind(this));
    }

    _createClass(Slider, [{
        key: 'mediaQuery',
        value: function mediaQuery(e) {
            if (e.matches) {
                this.$slides.style.transform = 'translateX(-' + (this.shift *= 2) + '%)';
                this.slideOnScreen = 1;
            } else {
                this.slideOnScreen = 2;
                this.$slides.style.transform = 'translateX(-' + (this.shift /= 2.2) + '%)';
            }
            this.toGrid(1);
        }
    }, {
        key: 'toGrid',
        value: function toGrid(accuracy) {
            this.shift = Math.round(this.shift / (accuracy * 100)) * accuracy * 100;
            this.$slides.style.transform = 'translateX(-' + this.shift + '%)';
            this.whetherHideButtons(0, this.maxShift());

            this.checkDots();
        }
    }, {
        key: 'next',
        value: function next(carousel) {
            this.move(100, carousel);
            if (this.$dots) {
                this.$dots.children[this.lastDot++].style.background = null;
                this.$dots.children[this.lastDot].style.background = mainColor;
            }
        }
    }, {
        key: 'prev',
        value: function prev() {
            this.move(-100);
            if (this.$dots) {
                this.$dots.children[this.lastDot--].style.background = null;
                this.$dots.children[this.lastDot].style.background = mainColor;
            }
        }
    }, {
        key: 'maxShift',
        value: function maxShift() {
            return (this.$slides.children.length - this.slideOnScreen) * 100 / this.slideOnScreen;
        }
    }, {
        key: 'moveTo',
        value: function moveTo(pos) {
            this.shift = pos;
            this.move(0);
        }
    }, {
        key: 'move',
        value: function move(howMuch, carousel) {
            var maxShift = this.maxShift(),
                slides = this.$slides.children;

            this.whetherHideButtons(howMuch, maxShift);
            var bounds = !(this.shift + howMuch > maxShift) && this.shift + howMuch >= 0;
            if (carousel) {
                bounds = true;
            }

            if (bounds) {
                this.shift += howMuch;
                this.$slides.style.transform = 'translateX(-' + this.shift + '%)';
            } else if (this.carousel) {
                if (howMuch > 0) {
                    this.shift -= 100;
                    this.$slides.insertBefore(slides[0], slides[slides.length]);
                } else {
                    this.shift += 100;
                    this.$slides.insertBefore(slides[slides.length - 1], slides[0]);
                }
            }
        }
    }, {
        key: 'whetherHideButtons',
        value: function whetherHideButtons(howMuch, maxShift) {
            var nextStyle = this.$next.style,
                prevStyle = this.$prev.style;

            if (this.shift + howMuch > maxShift - 100 && nextStyle != 'scale(0)') {
                nextStyle.transform = 'scale(0)';
            } else if (nextStyle != 'scale(1)') nextStyle.transform = 'scale(1)';

            if (this.shift + howMuch < 99 && prevStyle != 'scale(0)') {
                prevStyle.transform = 'scale(0)';
            } else if (prevStyle != 'scale(1)') prevStyle.transform = 'scale(1)';
        }
    }, {
        key: 'resolvePageX',
        value: function resolvePageX(e) {
            var pos = undefined,
                resist = undefined;
            if (e.touches) {
                pos = e.touches[0].pageX;
                resist = 5;
            } else {
                pos = e.pageX;
                resist = 5;
            }
            return {
                pos: pos,
                resist: resist
            };
        }
    }, {
        key: 'touchFire',
        value: function touchFire(e) {
            var _this4 = this;

            this.$slides.style.transition = '0s';
            this.pointerLastPos = this.resolvePageX(e).pos;

            var move = function move(e) {
                var point = _this4.resolvePageX(e);

                if (_this4.pointerLastPos) _this4.move((point.pos - _this4.pointerLastPos) / (_this4.$slides.offsetWidth / 100) * -1);
                _this4.pointerLastPos = point.pos;
            };
            this.$slides.addEventListener('touchmove', move);
            this.$slides.onmousemove = move;
            e.preventDefault();
            return false;
        }
    }, {
        key: 'touchStop',
        value: function touchStop(e) {
            delete this.pointerLastPos;
            this.$slides.onmousemove = function () {
                return false;
            };
            this.toGrid(1);
            this.whetherHideButtons(0, this.maxShift());
            this.$slides.style.transition = '1s';
        }
    }, {
        key: 'checkDots',
        value: function checkDots() {
            if (this.$dots) {
                var dotId = this.shift / 100;
                this.$dots.children[this.lastDot].style.background = null;
                this.$dots.children[dotId].style.background = mainColor;
                this.lastDot = dotId;
            }
        }
    }, {
        key: 'createDots',
        value: function createDots() {
            var _this5 = this;

            var dot = document.createElement('div'),
                slides = Math.round(this.$slides.children.length / this.slideOnScreen);

            dot.className = 'dot';
            if (slides) for (var i = slides; i--;) this.$dots.appendChild(dot.cloneNode());
            var $dots = this.$dots.children;

            [].forEach.call($dots, function ($dot, i) {
                return $dot.onclick = function (e) {
                    _this5.moveTo(i * 100);
                    _this5.checkDots();
                };
            });
        }
    }]);

    return Slider;
})();

var slidersByIds = {},
    sliders = [].map.call(document.getElementsByClassName('slider'), function (slider) {
    return new Slider(slider);
}),
    broadcast = function broadcast(e) {
    return e.target.media ? sliders.forEach(function (slider) {
        return slider.matchMQ ? slider.mediaQuery(e) : null;
    }) : sliders.forEach(function (slider) {
        return slider.touchstop(e);
    });
};

var maxWidth630 = window.matchMedia('screen and (max-width: 630px)');
maxWidth630.addListener(broadcast);
document.onmouseup = broadcast;
document.addEventListener('touchend', broadcast);

slidersByIds['banner'].options({
    slideOnScreen: 1,
    carousel: true
}).autoSlider.start(10000);
