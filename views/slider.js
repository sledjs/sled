'use strict';

let mainColor = "#EE3326";

var log = (...logs) => console.log(`[${new Date().toLocaleTimeString()}]` ,...logs);


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
    changeTo(which){
        this.change(which - this.slide);
    }
    change(val){

        if(!this.changeAcces) return false;
        this.changeAcces = false;

        let $prev = this.$slides.children[this.slide],
            next = this.slide + val,
            $next = this.$slides.children[next],
            forward =  val > 0 ;

        if(next >= 0 && $next){
            this.slide += val;
            $prev.style.position = 'absolute';
            $prev.style.transform = `translateX(${ forward ? -100 : 100}%)`;
            $prev.style.webkitTransform = `translateX(${ forward ? -100 : 100}%)`;

            if($prev.previousElementSibling){
                $prev.previousElementSibling.style.position = 'absolute';
                $prev.previousElementSibling.style.transform = 'translateX(-100%)';
                $prev.previousElementSibling.style.webkitTransform = 'translateX(-100%)';
            }
            $next.style.position = 'relative';
            $next.style.transform = 'translateX(0)';
            $next.style.webkitTransform = 'translateX(0)';

            this.broadcast.forEach(_=>_(this.slide));

            setTimeout(_=> this.changeAcces = true, 750);
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

        [].forEach.call(this.slides.$slides.children, slide => slide.style.position = 'absolute');
        this.slides.change(1);


        if(this.$slides.children.length == 2){
            let slide1 = this.$slides.children[0].cloneNode(true),
                slide2 = this.$slides.children[1].cloneNode(true);
            slide1.style.transform ='translateX(100%)';
            slide1.style.webkitTransform ='translateX(100%)';
            slide1.style.position = 'absolute';
            slide2.style.transform ='translateX(100%)';
            slide2.style.webkitTransform ='translateX(100%)';
            slide2.style.position = 'absolute';
            this.$slides.appendChild(slide1);
            this.$slides.appendChild(slide2);
        }

        let autoSlider = $core.modules.autoSlider;
        if(autoSlider) this.autoSlider = autoSlider;

        this.slides.afterChange = function(can, val){

            let slides = this.$slides.children;

            if(val > 0 && this.slides.slide > 1) {
                slides[0].style.transform = 'translate(100%)';
                slides[0].style.transform = 'translate(100%)';
                this.$slides.insertBefore(slides[0], slides[slides.length]);
                this.slides.slide--;
            }else if(val < 0){
                slides[slides.length - 1].style.transform = 'translate(-100%)';
                slides[slides.length - 1].style.webkitTransform = 'translate(-100%)';
                this.$slides.insertBefore(slides[slides.length - 1], slides[0]);
                this.slides.slide++;
            }

            //this.slides.change(1);
            //if(autoSlider.work) autoSlider.restart();
            return can;
        }.bind(this);

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

class Touch{
    constructor($core){
        this.hammer = new Hammer($core.domModules.slides);
        this.slides = $core.modules.slides;
        this.autoSlider = $core.modules.autoSlider;

        this.hammer.on('swipe', e =>{
            if(e.direction == 2) this.slides.change(1);
            else this.slides.change(-1);

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
            this.autoSlider.style.width = 0;
            log(`restart autoLoader ${this.interval + delay}ms `);
            setTimeout(_ => this.start(this.interval), delay);
        }
    }
    stop(){
        log('autoSlider został zatrzymany');
        this.work = false;
        clearInterval(this.heart);
    }
}

let slidersId = {},
    sliders = [].map.call(document.getElementsByClassName('slider'), slider => new Slider(slider, slidersId));

slidersId['banner'].load(
    Slides,
    AutoSlider,
    Carousel,
    Touch
);

slidersId['objects'].load(
    Slides,
    Touch,
    AutoSlider,
    ArrowChanger,
    ArrowButtons,
    Dots
);

slidersId['banner'].slider.modules.autoSlider.start(5000);
