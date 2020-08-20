const fs = require( 'fs' );
const path = require( 'path' );
const fetch = require( 'node-fetch' );

const uploadSoftwareToStrapi = async () => {
  const softwareData = JSON
    .parse(
      fs.readFileSync( path.join( __dirname, 'software-catalog.json' ), 'utf8' )
    )
    .map( entry => Object.assign( {}, entry, {
      vendor: entry.vendor || "",
    } ) );
  
  console.log( softwareData.length );
  
  for ( const entry of softwareData ) {
    try {
      const resp = await fetch( `http://localhost:1337/softwares`, {
        method: 'POST',
        body: JSON.stringify( entry ),
      } );
  
      const data = await resp.json();
      
      const { statusCode } = data;
      if ( statusCode >= 400 ) {
        console.log( "Bad request uploading software entry!!", require( 'util' ).inspect( entry, { depth: 8 } ) );
        console.log( data );
      }
      
    }
    catch( err ) {
      console.log( "Error uploading software entry!!", err, require( 'util' ).inspect( entry, { depth: 8 } ), err );
    }
  }
};

uploadSoftwareToStrapi();
