const build = require('./build');
const join  = require('path').join;

console.log = jest.fn(); // DO NOT SHOW LOGS

jest.mock('child_process');
jest.mock('fs');


describe('build', () => {


  const stackName = "core";
  let errors;
  const MOCK_RESPONSES_CHILD_PROCESS = [
    {
      method : "exec",
      key : `npm i && npm run build`,
      data : (cb)=> cb(null,"","")
    }
  ];


  const MOCK_RESPONSES_FS = [
    {
      method : "readdirSync",
      data : ["core"],
      key : "serverless"
    }
  ];


  beforeAll(async () => {
    require('child_process').__setResponses(MOCK_RESPONSES_CHILD_PROCESS);
    require('fs').__setResponses(MOCK_RESPONSES_FS);
    errors = await build({args : {}, apps : ["core"], config : {
      base_path : join(__dirname,"../serverless"),
      commands : { build : "npm i && npm run build" }
    } });
  });


  test('Should install and build each project in it\'s directory', () => {
    expect(process.cwd()).toEqual(join(__dirname,"../serverless/core"));
  });


  test('Should not return any errors', () => {
    expect(errors).toEqual([]);
  });


  afterAll(() => {
    require('child_process').__clearResponses();
    require('fs').__clearResponses();
  });


});
