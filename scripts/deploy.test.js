const deploy = require('./deploy');
jest.mock('child_process');

console.log = jest.fn(); // DO NOT SHOW LOGS

describe('deploy', () => {

  const STACK_DATA = { Stacks : [ { "test_stack" : true } ] };

  const MOCK_RESPONSES_CHILD_PROCESS = [
    {
      method : "exec",
      key : `sam deploy --template-file serverless/test/template.yaml --s3-bucket my-serverless --s3-prefix test/test --stack-name my-serverless-test-test --capabilities CAPABILITY_IAM --parameter-overrides Environment=test ProjectName=my-serverless`,
      data : (cb)=> cb(null,true,null) // error, stdout, stderr
    },
    {
      method : "exec",
      key : `aws cloudformation describe-stacks --stack-name my-serverless-test-test`,
      data : (cb)=> cb(null,JSON.stringify( STACK_DATA ),"")
    }
  ];

  let errors;

  beforeAll(async () => {
    require('child_process').__setResponses(MOCK_RESPONSES_CHILD_PROCESS);
    errors = await deploy({args : { environment : "test" }, apps : ["test"], config : { base_path : "serverless" , project_name : "my-serverless"} });
  });


  test('Should not return any errors', () => {
    expect(errors).toEqual([]);
  });


  afterAll(() => {
    require('child_process').__clearResponses();
  });


});
