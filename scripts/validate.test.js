const validate = require('./validate');
jest.mock('child_process');

console.log = jest.fn(); // DO NOT SHOW LOGS

describe('validate', () => {

  const MOCK_RESPONSES_CHILD_PROCESS = [
    {
      method : "exec",
      key : `sam validate -t serverless/core/template.yaml`,
      data : (cb)=> cb(null,true,null) // error, stdout, stderr
    },
    {
      method : "exec",
      key : `sam validate -t serverless/test/template.yaml`,
      data : (cb)=> cb(true,"","")
    }
  ];
  let response;

  beforeAll(async () => {
    require('child_process').__setResponses(MOCK_RESPONSES_CHILD_PROCESS);
    response = await validate({args : {}, apps : ["core","test"], config : { base_path : "serverless"} });
  });


  test('It should return valid apps',() => {
    expect(response).toHaveProperty('valid');
    expect(response.valid).toEqual(['core']);
  });

  test('It should return invalid apps', () => {
    expect(response).toHaveProperty('invalid');
    expect(response.invalid[0].app).toEqual('test');
  });

  afterAll(() => {
    require('child_process').__clearResponses();
  });


});
