'use strict';

let Core = require('babel!@sled/core');
let Slides = require('@sled/slides');
let Keys = require('@sled/keys');

module.exports = function($slider) {
  return new Core($slider, Slides, Keys);
};
