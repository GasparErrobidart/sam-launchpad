const options     = require('./options');
const onCompleted = require('./on-completed');
const exec        = require('child_process').exec;
const colors      = require('colors');

/**
  test() : recursively executes the test script for each project.
*/

function test(opts){

  return new Promise((resolve,reject)=>{

    let { args, apps, config } = options(opts);
    let completed = 0;
    let errors = [];

    console.log("\n",`  TESTING PROJECTS  `.bgCyan.black,"\n");

    apps.forEach(app=>{
      process.chdir(`${config.base_path}/${app}`);
      exec(config.commands.test,
      (error, stdout, stderr) => {

          if (error !== null) {
            console.log(`  ✖ ${app}  `.red);
            errors.push({app,error,stderr});
          }else{
            console.log(`  ✔ ${app}  `.green);
            console.log(stdout);
          }

          completed++;

          // ON FINISH
          if(completed == apps.length){
            onCompleted({ errors, args, apps });
            resolve(errors);
          }

      })  // <---- Exec end
    })  // <---- For each end
  }) // <---- Promise end
} // <---- test() end

module.exports = test;
