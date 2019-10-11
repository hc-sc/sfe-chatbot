/**
 * @file search.js
 * @description Gateway API Search Controller
 */

import { Router } from "express";
import GWSearch from '../../search/gateway';
import SGSearch from '../../search/software';

const app = new Router();

/**
 * @function searchGatewayController
 * @description Route handler for searching gateway content, takes query and returns formatted JSON resutls
 * @todo TODO: User database? Sync with alfred database?
 * @todo TODO: Include parameters for custom search options
 */
const searchGatewayController = ( req, res ) => {
  let searchTool = new GWSearch( /* TODO: Lang, custom options */ );
  let status = 200;
  let results = [ ];

  try {
    const { query } = req.params;

    results = searchTool.search( query );
  }
  catch(err) {
    status = 500;
    results = null;

    console.log( err );
  }

  res
    .status( status )
    .send({ 
      results,
    });
};

app.get( '/api/search/gateway/:query', searchGatewayController );

/**
 * @function searchSoftwareController
 * @description Route handler for searching software content, takes query and returns formatted JSON resutls
 * @todo TODO: User database? Sync with alfred database?
 * @todo TODO: Include parameters for custom search options
 */
const searchSoftwareController = ( req, res ) => {
  let searchTool = new SGSearch( /* TODO: Lang, custom options */ );
  let status = 200;
  let results = [ ];

  try {
    const { query } = req.params;

    results = searchTool.search( query );
  }
  catch(err) {
    status = 500;
    results = null;

    console.log( err );
  }

  res
    .status( status )
    .send({ 
      results,
    });
};

app.get( '/api/search/software/:query', searchSoftwareController );

export default app;
