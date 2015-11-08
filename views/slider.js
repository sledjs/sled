'use strict';

let mainColor = "#EE3326";

var log = (...logs) => console.log(`[${new Date().toLocaleTimeString()}]` ,...logs),
    setTransform = ($elem, attr) => {
        $elem.transform = attr;
        $elem.webkitTransform = attr;
    };


class Slider{
    constructor($slider, moduleLoader){
        this.$domCore = $slider;
        this.domModules = {};
        this.modules = {};
        this.id = $slider.id;

        this.getModule = this.getModule;

        [].forEach.call(this.$domCore.children, domModule =>{
            this.domModules[domModule.className] = domModule ;
            log(`[${this.id}]`, '[modules-dom]', `loaded ${domModule.className}`)
        });

        if($slider.id && moduleLoader) moduleLoader[$slider.id] = {
            slider: this,
            load: this.loadModules.bind(this)
        }
    }
    loadModules(...modules){
        log(`[${this.id}]`, 'load modules init');
        if(!modules.length) log(`[${this.id}]`, '[modules]','0 modules to load');
        else modules.forEach(Module => {
            let funcName = Module.toString().match(/^function\s*([^\s(]+)/)[1],
            moduleName = funcName.charAt(0).toLowerCase() + funcName.slice(1);
            log(`[${this.id}]`, '[modules]' ,'loaded', moduleName);
            this.modules[moduleName] = new Module(this);
        });
    }
    getModule(module, dom){
        let moduleCont = this.modules;
        if(dom) moduleCont = this.domModules;

        return new Promise((res, rej) => {
            if(moduleCont[module]) res(moduleCont[module]);
            else rej(new Error('missing module', this.id));
        });
    }
}

class Slides{
    constructor($core){
        this.$slides = $core.domModules.slides;
        this.slide = 0;
        this.change = this.change;
        this.changeTo = this.changeTo;
        this.changeAcces = true;
        this.afterChange = can => can;

        this.broadcast = [];
    }
    sort(next){
        [].forEach.call(this.$slides.children, (slide, i) =>{

            console.log(next, this.$slides.children[next])

            if(i == next) return false;

            if(i > this.slide) {
                slide.style.transition = '0s';
                setTransform(slide.style, 'translateX(100%)');
            }
            else if(i < this.slide) {
                slide.style.transition = '0s';
                setTransform(slide.style, 'translateX(-100%)');
            }

            setTimeout(_=> slide.style.transition = null, 100);
        });
    }
    changeTo(which){
        this.change(which - this.slide);
    }
    change(val){

        if(!this.changeAcces) return false;
        this.changeAcces = false;

        let prev = this.slide,
            $prev = this.$slides.children[prev],
            next = this.slide + val,
            $next = this.$slides.children[next],
            forward =  val > 0 ;

        if(next >= 0 && $next){
            this.slide += val;
            if($prev){
                $prev.style.position = 'absolute';
                setTransform($prev.style, `translateX(${ forward ? -100 : 100}%)`);

                if($prev.previousElementSibling){
                    $prev.previousElementSibling.style.position = 'absolute';
                    setTransform($prev.previousElementSibling.style, 'translateX(-100%)');
                }
            }

            $next.style.position = 'relative';
            setTransform($next.style, 'translateX(0)');

            this.broadcast.forEach(_=>_(this.slide));

            setTimeout(_=> this.changeAcces = true, 750);

            this.sort(prev);

            return this.afterChange( true, val );
        }else {
            this.changeAcces = true;
            return this.afterChange( false, val );
        }
    }
}

class Carousel{
    constructor($core){
        this.$slides = $core.domModules.slides;
        this.slides = $core.modules.slides;

        if(this.$slides.children.length > 1) {
            [].forEach.call(this.slides.$slides.children, slide => slide.style.position = 'absolute');
            this.slides.change(1);

            if (this.$slides.children.length == 2) {
                let slide1 = this.$slides.children[0].cloneNode(true),
                    slide2 = this.$slides.children[1].cloneNode(true);

                setTransform(slide1.style, 'translateX(100%)');
                slide1.style.position = 'absolute';
                setTransform(slide2.style, 'translateX(100%)');
                slide2.style.position = 'absolute';
                this.$slides.appendChild(slide1);
                this.$slides.appendChild(slide2);
            }

            let autoSlider = $core.modules.autoSlider;
            if (autoSlider) this.autoSlider = autoSlider;

            this.slides.afterChange = function (can, val) {

                let slides = this.$slides.children;

                if (val > 0 && this.slides.slide > 1) {
                    setTransform(slides[0].style, 'translate(100%)');
                    setTransform(slides[0].style, 'translate(100%)');
                    this.$slides.insertBefore(slides[0], slides[slides.length]);
                    this.slides.slide--;
                } else if (val < 0) {
                    setTransform(slides[slides.length - 1].style, 'translate(-100%)');
                    this.$slides.insertBefore(slides[slides.length - 1], slides[0]);
                    this.slides.slide++;
                }

                //this.slides.change(1);
                //if(autoSlider.work) autoSlider.restart();
                return can;
            }.bind(this);
        }
    }
}

class ArrowChanger{
    constructor($core){
        document.onkeydown =_=> {
            switch (_.which) {
                case 37:
                    $core.modules.slides.change(-1);
                    break;
                case 39:
                    $core.modules.slides.change(1);
                    break;
            }
            if((_.which == 37 || _.which == 39) && $core.modules.autoSlider) $core.modules.autoSlider.restart(5000);
        }
    }
}

class Dots{
    constructor($core){
        let domModules = $core.domModules;

        if(domModules.dots){
            [this.$dots, this.slides] = [domModules.dots, $core.modules.slides];

            this.slides.broadcast.push( _=> this.lightDot(_) );

            this.fillDots();
        }
    }
    makeDot(){
        let dot = document.createElement('div');
        dot.className = 'dot';
        this.$dot = dot;
    }
    lightDot(which){
        let id = which || this.slides.slide,
            $dots = this.$dots.children;

        if(this.$prevDot != undefined) $dots[this.$prevDot].style.background = '#eee';

        $dots[id].style.background = mainColor;
        this.$prevDot = id;
    }
    fillDots(){
        let dotsId = this.slides.$slides.children.length,
            $dots = [];

        this.$dots.innerHTML = '';
        if(!this.$dot) this.makeDot();

        while(dotsId--) $dots.push(this.$dot.cloneNode());

        $dots.forEach( ($dot, id) => {
            $dot.onclick =_=> this.slides.changeTo(id);
            this.$dots.appendChild($dot)
        });

        this.lightDot();
    }
}

class dualView{
    constructor($core){
        this.dots = $core.modules.dots;
        this.slides = $core.modules.slides;
        this.$slides = this.slides.$slides;

        this.slide = document.createElement('div');
        this.slide.className = 'slide';
        this.slide.style.position = 'absolute';

        this.mq = window.matchMedia('(min-width: 800px)');

        this.mq.addListener( mq => mq.matches ? this.dualView() : this.oneView() );
        this.mq.matches ? this.dualView() : null;
    }
    oneView(){
        let $slides = this.$slides,
            arr = [];

        [].forEach.call( $slides.getElementsByClassName('slide'), slide => arr.push(slide));

        [].forEach.call($slides.children, $slide => {
            $slides.appendChild($slide.children[0]);
            $slides.appendChild($slide.children[0]);
        });
        arr.forEach( _=>_.remove() );
        [].forEach.call($slides.children, $slide => {
            $slide.className = 'slide';
            $slide.style.position = 'absolute';
        });

        this.slides.slide = 0;
        $slides.className = 'slides';
        $slides.children[0].style.position = 'relative';
        this.dots.fillDots();
    }
    dualView(){
        let $slides = this.$slides,
            arr = [],
            prev;

        $slides.className += ' dualView';

        [].forEach.call($slides.children, $slide => arr.push($slide) );

        arr.forEach(($slide, i) => {
            $slide.className = '';
            $slide.style.position = 'relative';

            if(i % 2 == 0){
                let slid = this.slide.cloneNode(true);

                prev = slid;
                slid.appendChild($slide);
                $slides.appendChild(slid);
            }else{
                prev.appendChild($slide);
            }
        });

        this.slides.slide = 0;
        $slides.children[0].style.position = 'relative';
        this.dots.fillDots();
    }
}

class Touch{
    constructor($core){
        this.hammer = new Hammer($core.domModules.slides);
        this.slides = $core.modules.slides;
        this.autoSlider = $core.modules.autoSlider;
        this.hammer.on('panstart', _=> {
            let $img = this.slides.$slides.children[this.slides.slide],
                $imgs = [$img.previousElementSibling, $img, $img.nextElementSibling];

            $imgs.forEach($img =>  $img ? $img.style.transition = '0s' : null);
            if(this.autoSlider) this.autoSlider.stop();
        });
        this.hammer.on('panend', _=> {
            let $img = this.slides.$slides.children[this.slides.slide],
                $imgs = [$img.previousElementSibling, $img, $img.nextElementSibling];

            $img.style.transform = `translateX(0px)`;

            $img.previousElementSibling ? $img.previousElementSibling.style.transform = `translateX(-100%)`: null;
            $img.nextElementSibling ? $img.nextElementSibling.style.transform = `translateX(100%)`: null;

            $imgs.forEach($img => {
                $img ? $img.style.transition = '1s' : null;
            });
            if(this.autoSlider){
                this.autoSlider.work = true;
                this.autoSlider.restart(5000);
            }

            if( Math.abs(_.deltaX) > ($img.offsetWidth / 2)) this.slides.change(_.deltaX > 0 ? -1 : 1);
        });

        this.hammer.on('pan', e => {
            let $img = this.slides.$slides.children[this.slides.slide],
                delta = e.deltaX;

            $img.style.transform = `translateX(${delta}px)`;

            $img.previousElementSibling ? $img.previousElementSibling.style.transform = `translateX(${ -$img.offsetWidth + delta }px)`: null;
            $img.nextElementSibling ? $img.nextElementSibling.style.transform = `translateX(${ +$img.offsetWidth + delta }px)` : null;
        });

        this.hammer.on('swipe', e =>{
            setTimeout(_=> {
                if (e.direction == 2) this.slides.change(1);
                else this.slides.change(-1);
            },50);
            if(this.autoSlider) this.autoSlider.restart(5000);
        });

    }
}

class ArrowButtons {
    constructor($core) {
        if($core.domModules.arrows) {
            let $arrows = $core.domModules.arrows.children,
                slides = $core.modules.slides;

            [ this.$prev, this.$next ] = [$arrows[0], $arrows[1]];

            this.stop = _=> [ this.$prev, this.$next ] = null;

            this.$prev.onclick = _=> slides.change(-1);
            this.$next.onclick = _=> slides.change(1);
        }
    }
}

class AutoSlider{
    constructor($core){
        this.work = false;
        this.interval = 1000;

        this.start = this.start;
        this.restart = this.restart;
        this.stop = this.stop;

        this.slides = $core.modules.slides;
        if(!$core.domModules.autoSlider){
            log(`[${$core.id}]`, '[ modules-dom ]','missing autoSlider');
        }else{
            this.autoSlider = $core.domModules.autoSlider.firstElementChild;
            log(`[${$core.id}]`, '[ modules-dom ]','succesfully integrate with dom-autoSlider');
        }
    }
    start(interval){
        this.restarting = false;
        log('autoSlider ruszył');
        if(this.autoSlider) {
            this.autoSlider.style.transitionDuration = (interval || this.interval) + 'ms';
            this.autoSlider.style.webkitTransitionDuration = (interval || this.interval) + 'ms';
            setTimeout(_=>this.autoSlider.style.width = '100%', 10);
        }
        this.work = true;
        this.heart = setInterval(_=> {
            this.slides.change(1) ? null : this.stop();
            if(this.autoSlider) {
                    this.autoSlider.style.webkitTransitionDuration = '0ms';
                    this.autoSlider.style.transitionDuration = '0ms';
                    this.autoSlider.style.width = '0%';
                    setTimeout(_=> {
                        this.autoSlider.style.transitionDuration = (interval || this.interval) + 'ms';
                        this.autoSlider.style.webkitTransitionDuration = (interval || this.interval) + 'ms';
                        this.autoSlider.style.width = '100%';
                    }, 50);
            }
        }, (this.interval = interval || this.interval) - 50);
    }
    restart(delay){
        if(!this.restarting && this.work) {
            this.restarting = true;
            this.stop();
            log(`restart autoLoader ${this.interval + delay}ms `);
            setTimeout(_ => this.start(this.interval), delay);
        }
    }
    stop(){
        log('autoSlider został zatrzymany');
        this.autoSlider.style.width = 0;
        this.work = false;
        clearInterval(this.heart);
    }
}

let slidersId = {},
    sliders = [].map.call(document.getElementsByClassName('slider'), slider => new Slider(slider, slidersId));