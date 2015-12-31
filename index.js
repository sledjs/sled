import log from './log.js';

export default class Slider {

  constructor($slider) {
    this.$domCore = $slider;
    this.domModules = {};
    this.modules = {};
    this.id = $slider.id;

    [].forEach.call(this.$domCore.children, domModule => {
      this.domModules[domModule.className] = domModule;
      log(`[${this.id}]`, '[modules-dom]', `loaded ${domModule.className}`);
    });
  }

  loadModules(...modules) {
    log(`[${this.id}]`, 'load modules init');
    if (!modules.length) log(`[${this.id}]`, '[modules]', '0 modules to load');
    else modules.forEach(Module => {
      let funcName = Module.toString().match(/^function\s*([^\s(]+)/)[1];
      let moduleName = funcName.charAt(0).toLowerCase() + funcName.slice(1);

      log(`[${this.id}]`, '[modules]', 'loaded', moduleName);
      this.modules[moduleName] = new Module(this);
    });

    return new Promise(res => res(this));
  }

  getModule(module, dom) {
    let moduleCont = this.modules;
    if (dom) moduleCont = this.domModules;

    return new Promise((res, rej) => {
      if (moduleCont[module]) res(moduleCont[module]);
      else rej(new Error('missing module', this.id));
    });
  }
}
