'use strict';

let log = require('@sled/log');

module.exports = class Slider {
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
      log(`[${this.id}]`, '[modules]', 'loaded', Module.name);
      this.modules[Module.name.toLowerCase()] = new Module(this);
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
};
