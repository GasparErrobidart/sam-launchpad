// __mocks__/fs.js
'use strict';

const BaseMock = require('./__base_mock__');
const fs = Object.assign(new BaseMock(),jest.genMockFromModule('fs'));

fs.readdirSync = (function (path){
  return this.__respondTo('readdirSync',path);
}).bind(fs);

module.exports = fs;
