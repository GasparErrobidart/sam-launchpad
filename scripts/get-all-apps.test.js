jest.mock('fs');

describe('getAllApps', () => {

  const MOCK_RESPONSES = [
    {
      method : "readdirSync",
      data : ["ok",".DS_store","test.jpeg"],
      key : "/__test__"
    }
  ];

  beforeAll(() => {
    require('fs').__setResponses(MOCK_RESPONSES);
  });

  test('includes all files in the directory in the summary', () => {
    const getAllApps = require('./get-all-apps');
    const response = getAllApps('/__test__');
    expect(response).toEqual(["ok"]);
  });

  afterAll(() => {
    require('fs').__clearResponses(MOCK_RESPONSES);
  });

});
