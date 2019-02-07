const options     = require('./options');
const onCompleted = require('./on-completed');
const exec        = require('child_process').exec;
const colors      = require('colors');

/**
  build() : recursively executes the build script for each project.
*/

function build(opts){

  return new Promise((resolve,reject)=>{

    let { args, apps, config } = options(opts);
    let completed = 0;
    let errors = [];

    console.log("\n",`  BUILDING PROJECTS  `.bgCyan.black,"\n");

    apps.forEach(app=>{
      process.chdir(`${config.base_path}/${app}`);
      exec(config.commands.build,
      (error, stdout, stderr) => {

          if (error !== null) {
            console.log(`  ✖ ${app}  `.red);
            errors.push({app,error,stderr});
          }else{
            console.log(`  ✔ ${app}  `.green);
            // console.log(stdout);
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
} // <---- build() end

module.exports = build;
