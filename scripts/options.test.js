jest.mock('fs');

const opts = ()=> ({args : {},apps : [],config : {}});
const options = require('./options');

console.log = jest.fn(); // DO NOT SHOW LOGS

describe('options', () => {

  const MOCK_RESPONSES = [
    {
      method : "readdirSync",
      data : ["option-test-app"],
      key : "/__test__"
    }
  ];

  beforeAll(() => {
    require('fs').__setResponses(MOCK_RESPONSES);
  })



  test('Environment should always be set', () => {
    const response = options(opts());
    expect(response.args.environment).toEqual('dev');
  })


  test('If no apps are specified, a warning should pop', () => {
    const spyConsole = jest.spyOn(console, 'log');
    const response = options(opts());
    expect(spyConsole).toHaveBeenCalled();
  })


  test('Additional arguments should be kept', () => {
    const o = opts();
    o.args = { verbose : true , testArg : "testing"};
    const response = options(o);
    expect(response.args).toHaveProperty('verbose',true,'testArg','testing');
  })


  test('If all apps is true, fs should fetch all app names', () => {
    const o = opts();
    o.args['all-apps'] = true;
    o.config.base_path = MOCK_RESPONSES[0].key;
    const response = options(o);
    expect(response.apps).toEqual(MOCK_RESPONSES[0].data);
  })



  afterAll(() => {
    require('fs').__clearResponses();
  })

})
