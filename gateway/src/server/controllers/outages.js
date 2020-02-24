/**
 * @file outages.js
 * @description Contains gateway API outages
 */

import { Router } from "express";
import fetch from "node-fetch";

const app = new Router();

const columnMap = [
  "planned",
  "red",
  "dDate",
  "fDate",
  "typeEn",
  "affectedEn",
  "impactEn",
  "typeFr",
  "affectedFr",
  "impactFr",
  "url",
  "mysterySlotOne", // TODO: Figure out correct label
  "mysterySlotTwo", // TODO: Figure out correct label
];

/**
 * @function getOutages
 * @description Retrieve outages from source, format into standard JSON format and return
 * @returns {OBject[]}
 */
const getOutages = async () => {
  const 
    requestTime = Date.now(),
    // FIXME: Cross origin issue with data hosted on GCPedia, figure out deployment solution. Might just fix itself if it can be hosted on Jamie's dev server.
    // const rawOutages = await ( await fetch( "https://sfe-chatbot-gateway:3000/gw-custom/get-outages.php" ) ).text();
    rawOutages = await ( await fetch( "http://sc-dev.hc-sc.gc.ca:90/gw-custom/get-outages.php" ) ).text();

  // TODO: Send back JSON, XML ?, CSV ?
  const outages = rawOutages
    // Split rows
    .replace(/\r/g, "")
    .split( /\n/g )
    // Map rows into JSON entries
    .map( outage => {
      const 
        outageCols = outage.split( /\|/g ),
        formatted = { };

      for ( const col in outageCols ) {
        switch ( col ) {
          case ( "0" ):
            formatted[ columnMap[ col ] ] = !/unplanned/i.test( outageCols[ col ] );
            break;
          case ( "1" ):
            formatted[ columnMap[ col ] ] = /yes/i.test( outageCols[ col ] );
            break;
          case ( "2" ):
          case ( "3" ):
            formatted[ columnMap[ col ] ] = new Date( outageCols[ col ] ).getTime();
            break;
          case ( "10" ):
            formatted[ columnMap[ col ] ] = /no/i.test( outageCols[ col ] )
              ? false
              : outageCols[ col ];
            break;
          default:
            formatted[ columnMap[ col ] ] = outageCols[ col ].replace( /%{2,}/g, "\n" );
            break;
        }
      }

      return formatted;
    } )
    // Filter out old outages
    .filter( outage => outage.fDate > requestTime );

    return outages;
};

/**
 * @function allOutagesController
 * @description Route handler for returning list of outages
 */
const allOutagesController = async ( req, res ) => {
  const outages = await getOutages();  

  res.send( {
    count: outages.length,
    outages,
  } );
};

app.get( '/api/outages', allOutagesController );

/**
 * @function countOutagesController
 * @description Route handler for returning list of outages
 */
const countOutagesController = async ( req, res ) => {
  const outages = await getOutages();  

  res.send( {
    count: outages.length,
  } );
};

app.get( '/api/outages/count', countOutagesController );

export default app;
