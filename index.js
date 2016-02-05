'use strict';

let Core = require('@sled/core');
let Slides = require('@sled/slides');

module.exports = function($slider) {
  return new Core($slider, Slides);
};
