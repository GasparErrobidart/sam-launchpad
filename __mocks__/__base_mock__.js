// __mocks__/__base_mock__.js
'use strict';

class BaseMock{

  constructor(){
    this.mockResponses = {};
  }

  __exists(method,key){
    if(!this.mockResponses[method]){
      throw new Error(`No method '${method}'.`);
    }else if(!this.mockResponses[method][key]){
      throw new Error(`No such key '${key}' found for method '${method}'.`);
    }
  }

  __clearResponses(){
    this.mockResponses = {};
  }

  __setResponses(responses){
    this.__clearResponses();
    responses.forEach((response)=>{
      if(!this.mockResponses[response.method]) this.mockResponses[response.method] = {};
      this.mockResponses[response.method][response.key] = response.data;
    });
  }

  __respondTo(method,key){
    this.__exists(method,key);
    return this.mockResponses[method][key];
  }

}

module.exports = BaseMock;
