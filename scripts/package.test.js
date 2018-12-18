const SAMpackage = require('./package');
jest.mock('child_process');

console.log = jest.fn(); // DO NOT SHOW LOGS

describe('package', () => {

  const MOCK_RESPONSES_CHILD_PROCESS = [
    {
      method : "exec",
      key : `sam package --template-file serverless/test/template.yaml --s3-bucket portal-driver-serverless-test --s3-prefix test/test --output-template-file serverless/test/packaged-test.yaml`,
      data : (cb)=> cb(null,true,null) // error, stdout, stderr
    }
  ];

  let errors;

  beforeAll(async () => {
    require('child_process').__setResponses(MOCK_RESPONSES_CHILD_PROCESS);
    errors = await SAMpackage({args : { environment : "test" }, apps : ["test"], config : { base_path : "serverless" , project_name : "portal-driver-serverless-test"} });
  });


  test('Should not return any errors', () => {
    expect(errors).toEqual([]);
  });
  
  afterAll(() => {
    require('child_process').__clearResponses();
  });


});
