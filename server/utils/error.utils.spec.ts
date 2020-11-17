import { describe, expect } from '@jest/globals';
import createError from './error.utils';

describe('Utils: error', () => {
  // test createError function
  it('createError(): returns modified error object', () => {
    // generate fake error object
    const actualErrorObj = createError(
      { client: 'clientMsgBefore' },
      {
        server: 'serverMsg',
        statusCode: 400,
        redirectTo: 'redirectToPath',
      }
    );

    // expect modified version
    const expectedErrorObj = {
      client: 'clientMsgBefore',
      server: 'serverMsg',
      statusCode: 400,
      redirectTo: 'redirectToPath',
    };

    expect(actualErrorObj).toMatchObject(expectedErrorObj);
  });
});
