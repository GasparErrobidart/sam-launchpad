const options     = require('./options');
const onCompleted = require('./on-completed');
const exec        = require('child_process').exec;
const colors      = require('colors');


/**
  package() : Uses AWS SAM to package a project for deployment.
*/

function SAMpackage(opts){

  return new Promise((resolve,reject)=>{

    let { args, apps, config } = options(opts);
    let completed = 0;
    let errors = [];

    console.log("\n",`  PACKING THINGS UP  `.bgCyan.black,"\n");

    apps.forEach(app=>{
      exec(`sam package --template-file ${config.base_path}/${app}/template.yaml --s3-bucket ${config.project_name} --s3-prefix ${args.environment}/${app} --output-template-file ${config.base_path}/${app}/packaged-${args.environment}.yaml`,
      (error, stdout, stderr) => {

          if (error !== null) {
            console.log(`  ✖ ${app}  `.red);
            errors.push({app,error,stderr});
          }else{
            console.log(`  ✔ ${app}  `.green);
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
} // <---- package() end

module.exports = SAMpackage;
