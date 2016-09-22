'use strict';

var index = (options = {}) => options.condition && options.plugin || (() => {});

module.exports = index;
