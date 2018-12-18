const fs = require('fs');

function getAllApps(base_path){
  return fs.readdirSync(base_path)
    .filter(s => !/\./gi.test(s) );
}

module.exports = getAllApps;
