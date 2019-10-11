/**
 * @file cipher.js
 * @description Cipher route, takes asset tag and returns lock password
 */

import { Router } from "express";

const app = new Router();

/**
 * @function reverseString
 * @description Reverses a string
 * @param {string} str 
 */
const reverseString = str => str === ""
  ? ""
  : reverseString( str.substr( 1 ) ) + str[ 0 ]

/**
 * @function cipher
 * @description Generates lock password from asset number
 * @param {string} asset
 */
const cipher = asset => {  
  asset = asset.replace( /(?:HC|PH)/g, "" );
  
  if ( !/^\d{4,}$/.test( asset ) ) {
    throw new Error( `Cipher error: Invalid asset tag: "${ asset }"` );
  }

  //Take the number, reverse it and take the first 4 numbers
  let password = parseInt( reverseString( asset ).substring( 0, 4 ) );

  //Add 1358
  password += 1358;

  //only use the first 4 digits
  password = `${ password }`.substring( 0, 4 );

  // finally reverse numbers
  return reverseString( password );
}

/**
 * @function allOutagesController
 * @description Route handler for returning list of outages
 */
const allOutagesController = async ( req, res ) => {
  const { asset } = req.params;

  try {
    const password = cipher( asset );

    res.send( { password } );
  }
  catch( err ) {
    console.log( err );

    res.send({
      error: "Could not generate password.",
    })
  }
};

app.get( '/api/cipher/:asset', allOutagesController );


export default app;
