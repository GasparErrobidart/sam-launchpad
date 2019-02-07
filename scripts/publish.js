#!/usr/bin/env node
const join          =   require('path').join;
const argv          =   require('minimist')(process.argv.slice(2));
const build         =   require('./build');
const coverage      =   require('./coverage');
const validate      =   require('./validate');
const package       =   require('./package');
const deploy        =   require('./deploy');
const options       =   require('./options');
const hook         =   require('./hook');
let config          =   require(join( process.cwd() , 'sam-launchpad.config' ));

if(config.projects) config.base_path = config.projects;

(async ()=>{

  let apps = argv.app || [];
  let allApps = argv['all-apps'];
  if(apps && typeof apps == "string"){
    apps = apps.split(',');
  }

  const args = {
    "verbose" : argv.verbose || false,
    "all-apps" : (apps.length && !allApps) ? false : true,
    "environment" : argv.stage || "dev"
  };

  let opts =  options({ args, apps, config });


  // UNIT TESTS

  if(!argv['skip-coverage']){
    await hook( 'before-coverage' , opts );
    (await coverage(opts)) || opts;
    await hook( 'after-coverage' , opts );
  }



  // BUILD

  if(!argv['skip-build']){
    await hook('before-build' , opts);
    (await build(opts)) || opts;
    await hook('after-build' , opts);
  }



  // SAM TEMPLATE VALIDATION

  if(!argv['skip-validation']){
    await hook('before-validation' , opts);
    (await validate(opts)) || opts;
    await hook('after-validation' , opts);
  }



  // SAM PACKAGE

  if(!argv['skip-package']){
    await hook('before-package' , opts);
    (await package(opts)) || opts;
    await hook('after-package' , opts);
  }



  // SAM DEPLOYMENT

  if(!argv['skip-deploy']){
    await hook('before-deploy' , opts);
    (await deploy(opts)) || opts;
    await hook('after-deploy' , opts);
  }


  console.log("[SAM LAUNCHPAD]: Exiting process.");
  process.exit(0);
})();
