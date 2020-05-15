const options     = require('./options');
const onCompleted = require('./on-completed');
const exec        = require('child_process').exec;
const colors      = require('colors');
const getStack    = require('./get-stack');


/**
  deploy() : Uses AWS SAM for deploying a project.
*/

function deploy(opts){

  return new Promise((resolve,reject)=>{


    let { args, apps, config } = options(opts);
    let completed = 0;
    let errors = [];

    console.log("\n",`  DEPLOYING TO CLOUDFORMATION  `.bgYellow.black,"\n");

    let additionalParameters = "";

    if(config.template_parameters){
      Object.keys(config.template_parameters).forEach(key =>{
        if(config.template_parameters[key] && !['function','object','undefined'].includes(typeof config.template_parameters[key])){
          additionalParameters += ` ${key}="${config.template_parameters[key]}"`;
        }
      })
    }

    apps.forEach(app=>{
      let stackName = `${config.project_name}-${app}-${args.environment}`.replace(/[\W_]+/gi,'-').replace(/\-$/gi,'');
      exec(`sam deploy --template-file ${config.base_path}${app ? '/'+app : ''}/packaged-${args.environment}.yaml --s3-bucket ${config.project_name} --s3-prefix ${args.environment}/${app} --stack-name ${stackName} --capabilities CAPABILITY_IAM --confirm-changeset false --parameter-overrides Environment=${args.environment} ProjectName=${config.project_name + additionalParameters}`,
      async (error, stdout, stderr) => {

          if (error !== null) {
            console.log(`  ✖ ${app}  `.red);
            errors.push({app,error,stderr});
          }else{
            console.log(`  ✔ ${app}  `.green);
            let stack = await getStack(stackName);
            console.log(stack.Outputs);
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
} // <---- deploy() end

module.exports = deploy;
