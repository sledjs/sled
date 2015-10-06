'use strict';

let mainColor = "#EE3326";

class AutoSlider {
    constructor(slider){
        this.loader = this.loader;
        this.slider = slider;
    }
    loader(delay, value) {
        delay -= 10;
        let $loader = this.slider.$loader,
            reset = ()=> $loader.className = 'value',
            maxShift = this.slider.shift != this.slider.maxShift() + 100;

        if(!maxShift && this.slider.carousel){
            this.slider.moveTo(0);
        }else if (value > 1) {
            $loader.style.animationDuration = ((delay) / 1000) + "s";
            $loader.className += ' maxWidth';
            setTimeout(()=> {
                reset();
                this.slider.next(true);
            }, delay);
        }
    }
    start(delay) {
        delay = delay || 2000;
        this.loader(delay, 100);
        this.heart = setInterval(()=> {
            this.loader(delay, 100);
        }, delay);
    }
    stop() {
        clearInterval(this.heart);
    }
}
class Slider {
    constructor($slider) {
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

        this.options = options => {
            Object.keys(options).forEach(key => {
                this[key] = options[key];
                switch (key) {
                    case 'slideOnScreen':
                        this.matchMQ = false;
                        break;
                }
            });
            return this;
        };

        if (this.slide == 0) this.$prev.style.transform = 'scale(0)';

        this.$prev.onclick = this.prev.bind(this);
        this.$next.onclick = this.next.bind(this);

        this.$slides.onmousedown = this.touchFire.bind(this);
        this.$slides.addEventListener('touchstart', this.touchFire.bind(this));
    }

    mediaQuery(e) {
        if (e.matches) {
            this.$slides.style.transform = `translateX(-${this.shift *= 2}%)`;
            this.slideOnScreen = 1;
        } else {
            this.slideOnScreen = 2;
            this.$slides.style.transform = `translateX(-${this.shift /= 2.2}%)`;
        }
        this.toGrid(1);
    }

    toGrid(accuracy) {
        this.shift = Math.round(this.shift / (accuracy * 100)) * accuracy * 100;
        this.$slides.style.transform = `translateX(-${this.shift}%)`;
        this.whetherHideButtons(0, this.maxShift());

        this.checkDots();
    }

    next(carousel) {
        this.move(100, carousel);
        if(this.$dots) {
            this.$dots.children[this.lastDot++].style.background = null;
            this.$dots.children[this.lastDot].style.background = mainColor;
        }
    }

    prev() {
        this.move(-100);
        if(this.$dots) {
            this.$dots.children[this.lastDot--].style.background = null;
            this.$dots.children[this.lastDot].style.background = mainColor;
        }
    }

    maxShift() {
        return (this.$slides.children.length - this.slideOnScreen) * 100 / this.slideOnScreen;
    }
    moveTo(pos){
        this.shift = pos;
        this.move(0);
    }
    move(howMuch, carousel) {
        let maxShift = this.maxShift(),
            slides = this.$slides.children;

        this.whetherHideButtons(howMuch, maxShift);
        let bounds = !(this.shift + howMuch > maxShift ) && this.shift + howMuch >= 0;
        if(carousel){
            bounds = true;
        }

        if (bounds) {
            this.shift += howMuch;
            this.$slides.style.transform = `translateX(-${this.shift}%)`;
        }else if(this.carousel){
            if(howMuch > 0){
                this.shift -=100;
                this.$slides.insertBefore(slides[0], slides[slides.length]);
            }else{
                this.shift +=100;
                this.$slides.insertBefore(slides[slides.length - 1], slides[0]);
            }
        }
    }

    whetherHideButtons(howMuch, maxShift) {
        let nextStyle = this.$next.style,
            prevStyle = this.$prev.style;

        if (this.shift + howMuch > maxShift - 100 && nextStyle != 'scale(0)'){
            nextStyle.transform = 'scale(0)';
        }
        else if (nextStyle != 'scale(1)') nextStyle.transform = 'scale(1)';

        if (this.shift + howMuch < 99 && prevStyle != 'scale(0)'){
            prevStyle.transform = 'scale(0)';
        }
        else if (prevStyle != 'scale(1)') prevStyle.transform = 'scale(1)';
    }

    resolvePageX(e) {
        let pos, resist;
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
        }
    }

    touchFire(e) {
        this.$slides.style.transition = '0s';
        this.pointerLastPos = this.resolvePageX(e).pos;

        let move = e => {
            let point = this.resolvePageX(e);

            if (this.pointerLastPos) this.move((point.pos - this.pointerLastPos) / (this.$slides.offsetWidth / 100) * -1);
            this.pointerLastPos = point.pos;
        };
        this.$slides.addEventListener('touchmove', move);
        this.$slides.onmousemove = move;
        e.preventDefault();
        return false;
    }

    touchStop(e) {
        delete this.pointerLastPos;
        this.$slides.onmousemove = () => false;
        this.toGrid(1);
        this.whetherHideButtons(0, this.maxShift());
        this.$slides.style.transition = '1s';
    }
    checkDots(){
        if(this.$dots) {
            let dotId = (this.shift) / 100;
            this.$dots.children[this.lastDot].style.background = null;
            this.$dots.children[dotId].style.background = mainColor;
            this.lastDot = dotId;
        }
    }
    createDots(){
        let dot = document.createElement('div'),
            slides = Math.round(this.$slides.children.length / this.slideOnScreen);

        dot.className = 'dot';
        if(slides) for( var i = slides; i--;) this.$dots.appendChild(dot.cloneNode());
        let $dots = this.$dots.children;

        [].forEach.call($dots, ($dot, i) => $dot.onclick = e =>{
            this.moveTo( i * 100 );
            this.checkDots();
        });
    }
}


let slidersByIds = {},
    sliders = [].map.call(document.getElementsByClassName('slider'), slider => new Slider(slider)),
    broadcast = e => e.target.media ? sliders.forEach(slider => slider.matchMQ ? slider.mediaQuery(e) : null) : sliders.forEach(slider => slider.touchstop(e));

let maxWidth630 = window.matchMedia("screen and (max-width: 630px)");
maxWidth630.addListener(broadcast);
document.onmouseup = broadcast;
document.addEventListener('touchend', broadcast);



slidersByIds['banner'].options({
    slideOnScreen: 1,
    carousel: true
}).autoSlider.start(10000);