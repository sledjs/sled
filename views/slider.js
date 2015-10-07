'use strict';

let mainColor = "#EE3326";

class Slider{
    constructor($slider, moduleLoader){
        this.$domCore = $slider;
        this.domModules = {};
        this.modules = {};

        [].forEach.call(this.$domCore.children, domModule => this.domModules[domModule.className] = domModule );

        if($slider.id && moduleLoader) moduleLoader[$slider.id] = {
            slider: this,
            load: this.loadModules.bind(this)
        }
    }
    loadModules(...modules){
        console.log('load modules init');
        if(!modules.length) console.log('0 modules to load');
        else modules.forEach(Module => {
            let moduleName = Module.name.charAt(0).toLowerCase() + Module.name.slice(1);
            console.log('loaded', moduleName);
            this.modules[moduleName] = new Module(this);
        });
    }
}

class Slides{
    constructor($core){
        this.slides = $core.domModules.slides;
        this.slide = 0;
        this.change = this.change;
    }
    change(val){
        let $prev = this.slides.children[this.slide],
            next = this.slide + val,
            $next = this.slides.children[next];
        if(next >= 0 && $next){
            this.slide += val;
            $prev.style.position = 'absolute';
            $next.style.position = 'relative';
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
        this.start = this.start;
        this.slides = $core.modules.slides;
        if(!$core.domModules.autoSlider){
            console.log('missing autoSlider');
        }else{
            console.log('succesfully integrate with dom-autoSlider');
        }
    }
    start(interval){
        this.heart = setInterval(_=> this.slides.change(1), interval);
    }
    stop(){
        clearInterval(this.heart);
    }

}

let slidersId = {},
    sliders = [].map.call(document.getElementsByClassName('slider'), slider => new Slider(slider, slidersId));

slidersId['banner'].load(
    Slides,
    ArrowChanger,
    AutoSlider
);

slidersId['banner'].slider.modules.autoSlider.start(1500);