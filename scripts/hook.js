const exec = require('child_process').exec;

const executeHook = (h,opts)=>{
  return new Promise(async (resolve,reject)=>{

    let _updatedOpts;

    const beforeResolve = ()=>{
      if(typeof _updatedOpts == 'object' && (!_updatedOpts.args || !_updatedOpts.config || !_updatedOpts.apps) ){
        console.warn("Your hook returned an object but it should have property 'args', 'config' and 'apps'.\nOptions will not be modified. ")
      }

      // Validate if the updated options object is valid
      if(!_updatedOpts || !_updatedOpts.args || !_updatedOpts.config || !_updatedOpts.apps){
        _updatedOpts = opts;
      }

      resolve(_updatedOpts);
    }

    if(typeof h == 'string'){

      // If hook is a string, treat it as a shell command
      exec( h , { env : { args : JSON.stringify(opts) } } , (error, stdout, stderr) => {


        if(error){
          reject(stderr);
        }else{
          _updatedOpts = stdout;
        };

        // If hook command has an output, try to parse it
        if(_updatedOpts){
          try{
            _updatedOpts = JSON.parse(_updatedOpts);
          }catch(e){
            _updatedOpts = undefined;
            console.warn('Warning: Your hook command output should be empty or a parsable JSON string.');
          }
        }

        beforeResolve();



      });


    }else if(typeof h == 'function'){

      // If hook is a function just execute it
      _updatedOpts = await h(opts);

      beforeResolve();

    }



  });
}

const hook = (name , opts)=>{
  return new Promise( async (resolve,reject)=>{

    const { config } = opts;
    const _hook = (config.hooks) ? config.hooks[name] : null;

    try{
      if(_hook){
        for(let i = 0; i < _hook.length; i++){
          opts = await executeHook(_hook[i],opts);
        }
      }
    }catch(e){
      reject(e);
    }

    resolve(opts);

  })
}

module.exports = hook;
module.exports._executeHook = executeHook;
