const hook = require('./hook');
const join = require('path').join;

console.log = jest.fn(); // DO NOT SHOW LOGS
console.warn = jest.fn(); // DO NOT SHOW LOGS

jest.mock('child_process');

describe('hooks', () => {

  let errors;
  const testConfig = {
    "project_name" : "portal-driver-serverless",
    "projects" : join( __dirname , "./serverless" ),
    "commands" : {
      "build" : `npm i && npm run build`,
      "test" : `npm test`
    },
    "hooks" : {
      "before-build" : [
        "echo Hello Hook"
      ],
      "after-build" : [
        "test-error"
      ],
      "before-validation" : [
        (opts)=>{
          return new Promise((resolve,reject)=>{
            opts.args.modified = true;
            resolve(opts);
          });
        }
      ],
      "after-validation" : [
        (opts)=>{
          return new Promise((resolve,reject)=>{
            resolve({});
          });
        }
      ]
    }
  };

  const MOCK_RESPONSES_CHILD_PROCESS = [

    {
      method : "exec",
      key : `echo Hello Hook`,
      data : (cb)=> cb(null,"","")
    },
    {
      method : "exec",
      key : `test-error`,
      data : (cb)=> cb(true,"","test error")
    }

  ];

  beforeAll(async () => {
    require('child_process').__setResponses(MOCK_RESPONSES_CHILD_PROCESS);
  });

  test('It should just return the options, if no hook is available.', async () => {
    const opts = { args : { testArg : true} , apps : ["test-app"] , config : { } };
    let result = await hook('before-build',opts);
    expect(result).toMatchObject(opts);
  });

  test('Expect an error if something goes wrong.', async () => {
    const opts = { args : { testArg : true} , apps : ["test-app"] , config : testConfig };
    try {
      await hook('after-build',opts)
    } catch (e) {
      expect(e).toEqual('test error');
    }
  });

  // test('If hook is a string, it should execute it with arguments', async () => {
  //   const opts = { args : { testArg : true} , apps : ["test-app"] , config : { } };
  //   let result = await hook('before-build',opts);
  //   expect(result).toMatchObject(opts);
  // });
  //
  // test('If hook is a function, it should execute it with arguments', async () => {
  //   expect(0).toBe(0)
  // });

  test('If hook modified the options it should be returned by', async () => {
    const opts = { args : { testArg : true} , apps : ["test-app"] , config : testConfig };
    let result = await hook('before-validation',opts);
    expect(result.args.modified).toBe(true);
  });

  test('If hook modified the options incorrectly the original options should be returned', async () => {
    const opts = { args : { testArg : true} , apps : ["test-app"] , config : testConfig };
    let result = await hook('after-validation',opts);
    expect(result).toMatchObject(opts);
  });


  afterAll(() => {
    require('child_process').__clearResponses();
  });


});
