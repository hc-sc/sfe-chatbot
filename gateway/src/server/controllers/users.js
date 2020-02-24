/**
 * @file users.js
 * @description Contains gateway API user routes
 */

import { Router } from "express";
import uniqid from "uniqid";

const app = new Router();

/**
 * @function newUserController
 * @description Route handler for creating a new user. Generates unique user ID
 * @todo TODO: User database? Sync with alfred database?
 */
const newUserController = ( req, res ) => {
  // Interweave timestamp and randomly generated hash to create unique id
  const
    time = `${ Date.now() }`,
    seedId = uniqid();

  let userId = "";

  for ( const i in time ) {
    userId = `${ userId }${ time[ i ] }${ seedId[ i ] }`;
  }

  userId = `${ seedId[ time.length ] }-${ userId }`;

  // Respond with new userId
  res.send( { userId } );
};

app.get( '/api/alfred/users/new', newUserController );

export default app;
