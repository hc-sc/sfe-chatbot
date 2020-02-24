/**
 * @file static.js
 * @description Static gateway routes
 */

import { Router, static as staticRoutes } from "express";
import path from 'path';

const app = new Router();

// Serve up gateway static assets
app.use( staticRoutes( path.resolve( __dirname, 'gateway' ), {
  extensions: [
    'html',
    'htm',
    'php',
  ],
} ) );

/**
 * @function faviconController
 * @description Favicon route controller, serves up favicon from gateway assets @ root level
 */
const faviconController = ( req, res ) => {
  const faviconPath = path.join( __dirname, 'gateway', 'assets', 'gw_favicon.ico' );
  res.sendFile( faviconPath );
};

app.get( '/favicon.ico', faviconController );

export default app;
