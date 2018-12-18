const coverage = require('./coverage');
const join  = require('path').join;

console.log = jest.fn(); // DO NOT SHOW LOGS

jest.mock('child_process');
jest.mock('fs');


describe('test', () => {

  const stackName = "core";
  let errors;
  const MOCK_RESPONSES_CHILD_PROCESS = [
    {
      method : "exec",
      key : `npm test`,
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
    errors = await coverage({args : {}, apps : ["core"], config : {
      base_path : join(__dirname,"../serverless"),
      commands : { test : "npm test" }
    } });
  });

  test('Should test each project in it\'s directory', async () => {
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
