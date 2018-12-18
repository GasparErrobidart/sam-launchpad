jest.mock('child_process');

describe('getStack', () => {
  const stackName = "__test_stack__";
  const STACK_DATA = { Stacks : [ { "test_stack" : true } ] };
  const MOCK_RESPONSES = [
    {
      method : "exec",
      key : `aws cloudformation describe-stacks --stack-name ${stackName}`,
      data : (cb)=> cb(null,JSON.stringify( STACK_DATA ),"")
    }
  ];

  beforeAll(() => {
    require('child_process').__setResponses(MOCK_RESPONSES);
  });

  test('Get stack output data by name', async () => {
    const getStack = require('./get-stack');
    const response = await getStack(stackName);
    expect(response).toEqual(STACK_DATA.Stacks[0]);
  });

  afterAll(() => {
    require('child_process').__clearResponses();
  });
});
