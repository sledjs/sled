'use strict';

import Core from '@sled/core';
import Slides from '@sled/slides';
import Keys from '@sled/keys';

module.exports = function($slider) {
  return new Core($slider, Slides, Keys);
};
