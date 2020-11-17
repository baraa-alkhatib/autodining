import debug from 'debug';
import * as express from 'express';
import ServerApp from '../server';

// configure global environment variables.
require('dotenv').config();

const log = debug('server');

// get the singleton instance of the express app.
const app: express.Application = new ServerApp(express()).getApp();

// get port from environment and store in Express.
const port = process.env.PORT || 5000;

// set app port to normalized port.
app.set('port', port);

// create HTTP server
const server = app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`Express server listening on port ${app.get('port')}`);
});

/**
 * Event listener for HTTP server "error" event.
 * @param {*} error
 */
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.on('error', onError);
