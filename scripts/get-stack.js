const exec = require('child_process').exec;

/**
  getStackOutputs()
*/

function getStack(stackName){

  return new Promise((resolve,reject)=>{

    exec(`aws cloudformation describe-stacks --stack-name ${stackName}`,
    (error, stdout, stderr) => {
      
        if (error !== null) {
          reject(error);
        }else{
          try{
            resolve(JSON.parse(stdout).Stacks[0]);
          }catch(e){
            reject(e);
          }
        }

    })  // <---- Exec end


  }) // <---- Promise end
} // <---- getStackOutputs() end

module.exports = getStack;
