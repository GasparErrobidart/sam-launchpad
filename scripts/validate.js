const options     = require('./options');
const exec        = require('child_process').exec;
const colors      = require('colors');




/**
  validate() : Uses AWS SAM to validate Cloud Formation templates.
*/

function validate(opts){

  return new Promise((resolve,reject)=>{

    let { args, apps, config } = options(opts);
    let completed   =  0;
    let valid       = [];
    let invalid     = [];

    console.log("\n",`  VALIDATING TEMPLATES  `.bgGreen.black,"\n");

    apps.forEach(app=>{
      exec(`sam validate -t ${config.base_path}/${app}/template.yaml`,
      (error, stdout, stderr) => {

          if (error !== null) {
            console.log(`  ✖ ${app}  `.red);
            invalid.push({app,error,stderr});
          }else{
            console.log(`  ✔ ${app}  `.green);
            valid.push(app);
          }

          completed++;

          // ON FINISH
          if(completed == apps.length){
            console.log("\n  ------------------------------------------\n");
            if(invalid.length && args.verbose){
              invalid.forEach(err=>{
                console.log("\n\n",`${err.app}`.red,"\n",err.error,"\n");
              });
            }
            console.log(
              `  (${valid.length}) Valid template(s).`.green,
              `  (${invalid.length}) Invvalid template(s).`.red,
              "\n\n",
              "  VALIDATION PROCESS COMPLETED  ".bgWhite.black,
              "\n\n"
            );
            resolve({valid,invalid});
          }

      })  // <---- Exec end
    })  // <---- For each end

  }) // <---- Promise end
} // <---- validate() end

module.exports = validate;
