// __mocks__/child_process.js
'use strict';

const BaseMock = require('./__base_mock__');
const child_process = Object.assign(new BaseMock(),jest.genMockFromModule('child_process'));

child_process.exec = (function(command,args,callback){
  if(typeof args == 'function') callback = args;
  return this.__respondTo('exec',command)(callback);
}).bind(child_process);


module.exports = child_process;
