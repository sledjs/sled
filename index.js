'use strict';

let log = require('@sled/log');
let slug = require('to-slug-case');

module.exports = class Slider {
  constructor($slider) {
    this.$ = $slider;
    this.domModules = {};
    this.modules = {};
    this.id = $slider.id || 'slider';

    log({ id: this.id }, `created`);
    this.loadDomModules(...this.$.children);
  }

  module(name) {
    return new Promise((res, rej) => {
      if (this.modules[name])
        res({
          $: this.domModules[name],
          _: this.modules[name],
        });
      else
        rej(new Error('missing module', name));
    });
  }

  loadModules(...modules) {
    if (!modules.length)
      log(`[${this.id}]`, '[modules]', '0 modules to load');
    else modules.forEach(Module => {
      let name = slug(Module.name);
      log(`[${this.id}]`, '[modules]', 'loaded', name);
      this.modules[name] = new Module(this);
    });

    return new Promise(res => res(this));
  }

  loadDomModules(...modules) {
    modules.forEach(domModule => {
      this.domModules[domModule.className] = domModule;
      log(`[${this.id}]`, '[modules-dom]', `loaded ${domModule.className}`);
    });
  }
};
