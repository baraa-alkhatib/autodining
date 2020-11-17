import { describe, expect } from '@jest/globals';
import * as express from 'express';
import ServerApp from './server';

describe('Calss: ServerApp', () => {
  // define variables
  let server: ServerApp;
  let expressApp: express.Application;

  // before each spec
  beforeEach(() => {
    // generate a new express applictaion instance
    expressApp = express();

    // generate a new server instance
    server = new ServerApp(expressApp);
  });

  // test getApp function
  it('getApp(): returns the same instance of express application that is passed to the constructor', () => {
    expect(server.getApp()).toBe(expressApp);
  });
});
