/**
 * @file model.js
 * @description Indexes search model for SFGW_SEARCH class
 */
const
  // Import node utils
  path = require("path"),
  fs = require("fs"),
  util = require("util"),
  Excel = require("exceljs"),

  /**
   * @function readData
   * @description Loads data from file located at specified path
   * @param {String} path File path
   * @returns {Promise<String>} Returns a promise, resolves to raw file data
   */
  readData = async _path => new Promise( async ( resolve, reject ) => {
    try {
      // const data = await csv().fromFile( _path );
      const xlsxReader = new Excel.Workbook();

      const workbook = await xlsxReader.xlsx.readFile( _path );

      const data = await workbook.getWorksheet( 1 );

      return resolve( data );
    }
    catch( err ) {
      return reject( err );
    }
  } ),

  /**
   * @function getRowValue
   * @description Gets row value at col index - used mainly to convert Null values to string
   * @param {Object} row 
   * @param {number} index 
   */
  getRowValue = ( row, index ) => row.getCell( index ).value || "",

  /**
   * @function formatData
   * @description Transforms data from Excel sheet into manageable JSON structure
   * Columns:
   *  1   -  SLSA (primary) (EN)
   *  2   -  SLSA (other) (EN)
   *  3   -  Application
   *  4   -  Acronym
   *  5   -  Application Edition (current)
   *  6   -  Application Version (current)
   *  7   -  Package Language
   *  8   -  Short Name
   *  9   -  Name
   *  10  -  Compatibility
   *  12  -  Vendor URL
   *  13  -  Free/Cost
   *  14  -  Standard item in SAP portal (Yes/No)
   *  15  -  Installation instructions
   *  16  -  Business App Type
   *  17  -  Branch
   *  18  -  Comments
   *  18  -  Version
   *  19  -  Edition
   *  20  -  Vendor
   *  21  -  Availability (Restricted / Not Applicable)
   *  22  -  SLSA (primary) (FR)
   *  23  -  SLSA (other) (FR)
   *  24  -  Context (EN)
   *  25  -  Context (FR)
   *  26  -  Restricted Exception Email
   * @param {String} sheet Excel worksheet
   * @returns {Object} Returns formatted data entry object
   */
  formatData = sheet => new Promise( ( resolve, reject ) => {
    const data = [ ];

    const rowIteratorOptions = { 
      includeEmpty: true ,
    };

    sheet.eachRow( rowIteratorOptions, ( row, index/* , _source */ ) => {
      const 
        keys = Object.keys( row ),
        newRow = {
          id: index,
          en: {
            slsa: {} 
          },
          fr: {
            slsa: {} 
          }, 
        };
  
      try {        
        newRow.en.slsa.primary = getRowValue( row, 1 ).replace(/[0-9]{2,}\s/g, "");
        newRow.en.slsa.others = getRowValue( row, 2 ).replace(/[0-9]{2,}\s/g, "");
        newRow.fr.slsa.primary = getRowValue( row, 22 ).replace(/[0-9]{2,}\s/g, "");
        newRow.fr.slsa.others = getRowValue( row, 23 ).replace(/[0-9]{2,}\s/g, "");
        newRow.en.context = getRowValue( row, 24 );
        newRow.fr.context = getRowValue( row, 25 );
        newRow.application = getRowValue( row, 3 );
        newRow.language = getRowValue( row, 7 ).replace("/", " / ");
        newRow.shortName = getRowValue( row, 8 );
        newRow.name = getRowValue( row, 9 );
        newRow.compatibility = getRowValue( row, 10 );
        newRow.cost = `${ getRowValue( row, 12 )[ 0 ].toUpperCase() }${ getRowValue( row, 12 ).slice(1).toLowerCase() }`;
        newRow.version = getRowValue( row, 18 );
        newRow.edition = getRowValue( row, 19 );
        newRow.vendor = getRowValue( row, 20 );
        newRow.restricted = /Restricted/i.test( getRowValue( row, 21 ) );
        newRow.exceptionEmail = getRowValue( row, 26 );
      }
      catch( err ) {
        console.log( "Data error: ", err );
        console.log( "Problem row: ", row );
        process.exit( );
      }
  
      for ( let item in newRow ) {
        if ( newRow[ item ] === "N/A" ) {
          newRow[ item ] = false;
        }
      }
  
      data.push( newRow );
      // return newRow;
    } );

    resolve( data );
  } ),

  /**
   * @function init
   * @description Main model method, loads SFGW data and uses it to index and save search model.
   */
  init = async () => new Promise(async ( resolve, reject ) => {
    const data_xlsx = path.join( __dirname, 'data', 'Gateway Software List.xlsx');

    // Retrieve and format data from csv source into JSON
    const sheet = ( await readData( data_xlsx ) )
    
    // Format data into manageable structure
    const data = ( await formatData( sheet ) )
      // Remove column headers row
      .slice( 1 );

    // Serialize then save search index to filesystem
    const
      serializedIndex = JSON.stringify( data ),
      fileName = 'hcsc-sftwrgtwy-searchdata.json',
      filePath = path.join( __dirname, 'data', fileName );

    fs.writeFile( filePath, serializedIndex, 'utf8', err => {
      if (err) {
        console.log(`Error writing serialized model to file:\n${ util.inspect( err, { depth: null } ) }`);
        return reject( err );
      }
      else {
        console.log(`New search model written to:\n   ----------------   \n      ${ filePath }\n   ----------------   \n`);
      }
    } );
  });
  
// Initialize script, exit process on completion.
init()
  .then( process.exit )
  .catch(err => {
    console.log(`Model script error:\n${ err }`);
    process.exit();
  });
