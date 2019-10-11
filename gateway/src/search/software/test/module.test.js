const 
  SGSearch = require( "../" ).default,
  // langs = [
  //   'en',
  //   'fr'
  // ],
  resultKeys = [
    'id',
    'en',
    'fr',
    'application',
    'language',
    'shortName',
    'name',
    'compatibility',
    'cost',
    'version',
    'edition',
    'vendor',
    'restricted',
    'score',
    'exceptionEmail',
  ];

let
  searchTool = null,
  results = null;

describe( 'SGSeaech()', () => {
  
  it( 'should be defined', () => {
    expect( SGSearch ).toBeTruthy();
    expect( typeof SGSearch ).toBe( 'function' );
  } );
  
  it( 'should instantiate a new search tool', () => {
    searchTool = new SGSearch();
    expect( searchTool ).toBeTruthy();
    expect( searchTool instanceof SGSearch ).toBeTruthy();
  } );
  
  it( 'should have all required properties', () => {
    expect( 'search' in searchTool ).toBeTruthy();
    expect( typeof searchTool.search ).toEqual( 'function' );
    expect( typeof searchTool.getEntry ).toEqual( 'function' );
    expect( typeof searchTool.entries ).toEqual( 'object' );
    expect( typeof searchTool.idx ).toEqual( 'object' );
    expect( typeof searchTool.mapFullResults ).toEqual( 'function' );
  } );
  
  it( 'should have a working search method that returns array of results', () => {
    results = searchTool.search( "microsoft access" );
    expect( Array.isArray( results ) ).toBeTruthy();
  } );
  
  it( 'returns properly formatted results', () => {
    for ( const result of results ) {
      
      // Check against resultKeys
      for ( const key of Object.keys( result ) ) {
        expect( resultKeys.includes( key ) ).toBeTruthy( );
        
        if ( result.restricted === true ) {
          expect( typeof result.en.context ).toBe( "string" );
          expect( typeof result.fr.context ).toBe( "string" );
          expect( typeof result.exceptionEmail ).toBe( "string" );
        }
      }

      // Matches should no be preserved
      expect( 'matches' in result ).toBeFalsy();
      
      // Score should be a number between 0 and 1
      expect( typeof result.score === "number" ).toBeTruthy();
      expect( result.score ).toBeLessThanOrEqual( 1 );
      expect( result.score ).toBeGreaterThanOrEqual( 0 );
    }
  } );

  // TODO:
  it .skip ( 'should handle searching for english results', () => {} );
  it .skip ( 'should handle searching for french results', () => {} );
} );