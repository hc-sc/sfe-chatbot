import util from 'util';
import path from 'path';
import Http from 'http';
import express from 'express';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import helmet from "helmet";
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import swaggerPath from "./docs/swagger.yaml";
// import swaggerDocs from "./docs/swagger";
import SocketIO from 'socket.io';
import controllers from './controllers';

/**
 * Log errors
 */
process.on('uncaughtException', function (exception) {
  console.log( exception ); 
});

// Instantiate server object
const app = express( );

/**
 * SOCKET.IO
 */

function ioConnect( socket ) {
  console.log( 'DEBUG, SOCKET.IO: USER CONNECTED' );

  socket.on( 'disconnect', ioDisConnect );
}

function ioDisConnect( a ) {
  console.log( 'DEBUG, SOCKET.IO: USER DISCONNECTED' );
}

/**
 * @function startServer
 * @description Starts Service Gateway API on port 3000, initializes SocketIO
 */
export function startServer( app ) {
  // Put on a helmet, for safety
  // https://github.com/helmetjs/helmet
  app.use( helmet() );
  
  // Import controllers
  app.use( controllers );

  // TODO: Add OpenAPI documentation plugin if available
  const swaggerDocs = YAML.load( path.join( __dirname, swaggerPath ) );
  app.use( '/api/docs', swaggerUI.serve, swaggerUI.setup( swaggerDocs ) );

  // TODO: Alfred middleware?

  /**
   * Set default route handling to redirect to 404 page
   * Set it here to not interfere with DEV routes.
   */

  app.use( ( req, res ) => {
    res
      .status( 404 )
      .redirect( '/404' );
  } );

  const http = Http.Server( app );
  // const io = SocketIO( http );

  // io.on( 'connection', ioConnect );

  http.listen( 3000, () => {
    const { address, port } = http.address();
    console.log( `listening on - ${ address }:${ port }` );
  } );
}

// Start server if this module is being invoked - skip if being imported. (Dev will create server instance)
if ( !( 'parents' in module ) || !module.parents.length ) {
  console.log('\n\n************ STARTING PROD SERVER ************\n\n');

  // Initialize logging
  const stream = rfs( 'gateway.log', {
    compress: true,
    interval: '7d', // Rotate log files weekly
    path: path.join( __dirname, 'logs' ),
  } );

  app.use( morgan( 'common', {
    stream,
  } ) );

  startServer( app );
}

export default app;
