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
  await hook( 'before-coverage' , opts );
  if(!argv['skip-coverage']) (await coverage(opts)) || opts;
  await hook( 'after-coverage' , opts );


  // BUILD
  await hook('before-build' , opts);
  if(!argv['skip-build'])    (await build(opts)) || opts;
  await hook('after-build' , opts);


  // SAM TEMPLATE VALIDATION
  await hook('before-validation' , opts);
  if(!argv['skip-validation']) (await validate(opts)) || opts;
  await hook('after-validation' , opts);


  // SAM PACKAGE
  await hook('before-package' , opts);
  if(!argv['skip-package'])  (await package(opts)) || opts;
  await hook('after-package' , opts);


  // SAM DEPLOYMENT
  await hook('before-deploy' , opts);
  if(!argv['skip-deploy'])   (await deploy(opts)) || opts;
  await hook('after-deploy' , opts);

  console.log("Exiting process.");
  process.exit(0);
})();
