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