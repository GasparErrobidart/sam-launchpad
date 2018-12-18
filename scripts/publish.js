#!/usr/bin/env node
const join          =   require('path').join;
const argv          =   require('minimist')(process.argv.slice(2));
const build         =   require('./build');
const coverage      =   require('./coverage');
const validate      =   require('./validate');
const package       =   require('./package');
const deploy        =   require('./deploy');
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

  if(!argv['skip-build'])       await build({args,apps,config});
  if(!argv['skip-coverage'])    await coverage({args,apps,config});
  if(!argv['skip-validation'])  await validate({args,apps,config});
  if(!argv['skip-package'])     await package({args,apps,config});
  if(!argv['skip-deploy'])      await deploy({args,apps,config});
  console.log("Exiting process.");
  process.exit(0);
})();
