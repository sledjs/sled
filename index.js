'use strict';

let Core = require('@sled/core');
let Slides = require('@sled/slides');
let ArrowChanger = require('@sled/arrow-changer');

module.exports = function($slider) {
  return new Core($slider, Slides, ArrowChanger);
};
