'use strict';

let mainColor = "#EE3326";

class Slider{
    constructor($slider, moduleLoader){
        this.$domCore = $slider;
        this.domModules = {};
        this.modules = {};

        [].forEach.call(this.$domCore.children, domModule => this.domModules[domModule.className] = domModule );

        if($slider.id && moduleLoader) moduleLoader[$slider.id] = this.loadModules.bind(this);
    }
    loadModules(modules){
        console.log('load modules init');
        if(!modules.length) console.log('0 modules to load');
        else modules.forEach(Module => {
            let moduleName = Module.name.charAt(0).toLowerCase() + Module.name.slice(1);

            this.modules[moduleName] = new Module(this);
        });
    }
}
