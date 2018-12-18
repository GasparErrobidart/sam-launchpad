#!/usr/bin/env node

const metadata = require('./package.json');

module.exports = ()=> console.log(metadata.name,metadata.version);
