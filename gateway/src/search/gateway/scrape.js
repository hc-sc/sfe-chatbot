/**
 * @file ~/scrape/index.js
 * @description This script scrapes static gateway content, compiling it into a JSON file for consumption by the search module
 * @todo TODO: Create a CRON job to scrape content at regular intervals - could benefit from the possibility of the integration of a CMS type framework
 * @todo TODO: CMS framework?
 */

const 
  util = require( 'util' ),
  path = require( 'path' ),
  fs = require( 'fs' ),
  cheerio = require( 'cheerio' ),
  pBar = require('cli-progress'),
  langs = [
    "en",
    "fr"
  ];

/**
 * @function cloneNewEntry 
 * @description Create new entry object with given id and url
 * @param {string} id Entry ID
 * @param {string} url Entry URL
 * @returns {Object}
 */
const cloneNewEntry = ( id, url ) => ( {
  id, url,
  en: {
    content: "",
    description: "",
    keywords: "",
    title: "",
  }, 
  fr: {
    content: "",
    description: "",
    keywords: "",
    title: "",
  },
} );

/**
 * @function getFrenchFilePaths
 * @description Returns list of all HTML files in the french directory of the static content
 */
const getFrenchFilePaths = new Promise( async ( resolve, reject ) => {
  const fileDir = path.join( __dirname, '../', '../', 'gateway', 'fr' );  
  fs.readdir( fileDir, ( err, files ) => {
    if ( err ) return reject( err );
    return resolve( files );
  } );
} );

/**
 * @function getEnglishFilePaths
 * @description Returns list of all HTML files in the english directory of the static content
 */
const getEnglishFilePaths = new Promise( async ( resolve, reject ) => {
  const fileDir = path.join( __dirname, '../', '../', 'gateway', 'en' );
  fs.readdir( fileDir, ( err, files ) => {
    if ( err ) return reject( err );    
    return resolve( files );
  } );
} );

/**
 * @function getStaticHTMLPaths
 * @description Returns set of unique HTML files contained in the en/fr directories of the static gateway content
 */
const getStaticHTMLPaths = async () => {
  const filePaths = await Promise.all([
    getFrenchFilePaths,
    getEnglishFilePaths,
  ]);

  // Flatten and return set of found files ( [ [ 1, 2, 3, 4 ], [ 1, 4, 5 ] ] -> [ 1, 2, 3, 4, 5 ] )
  return [ ...new Set(
    [].concat.apply( [], filePaths )
  ) ];
};

/**
 * @function getRawHTMLFromFile 
 * @description Loads file from given path and resolves it's raw text content
 * @param {string} filePath Path of the file to be loaded
 */
const getRawHTMLFromFile = async filePath => new Promise( ( resolve, reject ) => {
  // console.log( `SCRAPER DEBUG: READING FILE ${ filePath }` );
  // TODO: Validate path is directing to project's static content
  if ( !filePath || typeof filePath !== 'string' ) {
    return reject( new Error( "Error loading Raw HTML file, invalid path!" ) );
  }

  fs.readFile( filePath, "utf8", ( err, data ) => {
    if ( err ) return reject( err );    
    return resolve( data );
  } );
} );

/**
 * @function logMissingEntries
 * @description Logs missing file entries to the console to warn of content discrepancies
 * @param {Object[]} missing Array of missing entries
 */
const logMissingEntries = missing => {
  console.log( "WARNING: The following pages were detected to exist in one language only:\n" );

  for ( const entry of missing ) {
    console.log( ` -- Page: "${ entry.entry }" is missing for language: "${ entry.lang }".` );
  }

  return false;
}

/**
 * @function writeSearchData
 * @description Writes new search data to source file
 * @param {Object[]} entries 
 * @param {Object[]} missing 
 */
const writeSearchData = async ( entries ) => new Promise( ( resolve, reject ) => {
  const
    fileName = 'hcsc-gwsearch-sitelist.json',
    filePath = path.join( __dirname, 'data', fileName );

  fs.writeFile( filePath, JSON.stringify( entries ), 'utf8', err => {
    if (err) {
      console.log(`Error writing serialized model to file:\n${ util.inspect( err, { depth: null } ) }`);
      return reject( err );
    }
    else {
      console.log(`New page content scraped and updated to file:\n   ----------------   \n      ${ filePath }\n   ----------------   \n`);
      return resolve( );
    }
  } );
} );

/**
 * @function scrape
 * @description Scrape searchable data from static gateway content and store it as JSON for search modules
 */
const scrape = async () => {
  // TODO: Incorporate search into larger gateway project
  console.log( "Updating search content data with local static content...\n" );

  const bar = new pBar.Bar( {
    fps: 60,
    etaBuffer: 1,
    stream: process.stdout,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    format: 'progress [{bar}] {percentage}% | page {value}/{total} | Duration: {duration}s',
  }, pBar.Presets.shades_classic );

  const 
    files = await getStaticHTMLPaths(),
    MAX = ( files.length * langs.length ), // Number of pages to be scrapes
    missingEntries = [], // List to track missing entries
    entries = []; // List of completed entries

  let current = 1;

  // Start progress bar
  bar.start( MAX, current );

  // Create new entry for each file
  for ( const entry of files ) {
    // Skip files to be excluded from search
    if ( /(?:lock.cypher|problems|gateway.search.results|survey.popup|under.constr)\.html$/i.test( entry ) ) {
      current += langs.length;
      bar.update( current );
      continue;
    }

    // Create empty list for new entries
    const formatted = [ ];

    // Parse EN/FR for entry
    for ( const lang of langs ) {
      try {
        // Load raw contents from local file then parse out searchable content and meta data.
        const
          raw = await getRawHTMLFromFile( path.join( __dirname, "../", "../", "gateway", lang, entry ) ),
          $ = cheerio.load( raw ),
          $title = $( 'title' ),
          $metaKeywords = $( 'meta[name="keywords"]' ),
          $metaDesc = $( 'meta[name="description"]' ),
          $metaSplit = $( 'meta[name="split"]' ),
          $pageContent = $( "main p:not(.well), main li:not(.well)" );

        // TODO: Handle split entries    
        const subPages = $metaSplit.length
          ? $metaSplit
            .attr('content')
            .split( /\|/ig )
          : [ "" ];

        // Extract search data from page (sub-sections if split)
        // Content for split description, keywords and sections are pipe ("|") delineated
        for ( const i in subPages ) {
          // Create relative url, append section to url if split
          const url = `${ entry }${ subPages[ i ] }`;

          // Assign sub-section to content if split, else use page content
          const $entryContent = subPages.length > 1
            ? $( subPages[ i ] )
              .closest( "details" )
              .find( "p, li" )
            : $pageContent;

          // Create blank entry if not yet defined
          if ( !formatted[ i ] ) {
            formatted[ i ] = cloneNewEntry( `${ files.indexOf( entry ) + 1 }-${ i }`, url );
          }

          formatted[ i ][ lang ][ "title" ] = subPages.length > 1
            // Get split title from heading text
            ? $( subPages[ i ] ).text()
            // Get whole page title from title tag
            : $title.length
              ? $title.text()
              .split( /\-/i )[ 0 ]
              .trim()
              : "";

          // Get keywords from meta tag
          formatted[ i ][ lang ][ "keywords" ] = $metaKeywords.length
            ? $metaKeywords
            .attr( 'content' )
            .split( /\|/ig )[ i ]
            : "";  

          // Get description text from meta tag
          formatted[ i ][ lang ][ "description" ] = $metaDesc.length
            ? $metaDesc
            .attr( 'content' )
            .split( /\|/ig )[ i ]
            : "";
            
          // Get text from content container
          formatted[ i ][ lang ][ "content" ] = $entryContent.length
            ? $entryContent
            .text()
            .replace( /(?:\r|\n|\t)/ig, '' )
            .replace( /\s{2,}/g, "\s" )
            : "";
        }
      }
      catch( err ) {
        if ( err.code === 'ENOENT' ) {
          // Tried to scrape page that doesn't exist in current language, add to list of missedEntries for later logging
          missingEntries.push({ lang, entry, });
        }
        else {
          console.log( `\n\nSCRAPE ERROR: When parsing "${ entry }" for "${ lang }..." \n\n`, util.inspect( err, { depth: 0 } ) );
          bar.stop();
          return;
        }
      }
  
      bar.update( current++ );
    }

    // Add newly formatted entry to entries list
    for ( const completed of formatted ) entries.push( completed );
  }

  // Stop progress bar
  bar.stop();

  console.log( "\n" );

  // Write file to src
  await writeSearchData( entries );
  await logMissingEntries( missingEntries );
};

// Begin scraping
scrape( );
