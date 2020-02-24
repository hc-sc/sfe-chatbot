import path from 'path';
import webpack from 'webpack';
import config from '../../webpack.server.common';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';

const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");

async function startDevServer() {
  console.log('\n\n************ STARTING DEV SERVER ************\n\n');
  
  const
    // Load core server components
    { startServer, default: app } = ( await import( './' ) ),

    // Load webpack config for HMR
    compiler = webpack( config ),

    // Instantiate rotating dev log stream
    stream = rfs( 'gateway-dev.log', {
      interval: '1d', // Rotate log files daily
      path: path.join( __dirname, 'dev-logs' ),
    } );
    
  /**
   * Include DEV middleware
   */
  
  app.use( devMiddleware( compiler, {
    logLevel: 'warn',
    publicPath: config.output.publicPath,
  } ) );
  
  app.use( hotMiddleware( compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  } ) );
  
  // Initialize dev logging
  app.use( morgan( 'dev', {
    stream,
    skip: ( req, res ) => res.statusCode < 400,
  } ) );

  startServer( app );  
}

startDevServer( );
