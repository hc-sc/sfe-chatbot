const 
  GWSearch = require( "../" ).default,
  langs = [
    'en',
    'fr'
  ],
  resultKeys = [
    "url",
    "content",
    "description",
    "keywords",
    "title",
  ];
let
  searchTool = null,
  results = null;

describe( 'GWSearch', () => {
  it( 'should be defined', () => {
    expect( GWSearch ).toBeTruthy();
    expect( typeof GWSearch ).toBe( 'function' );
  } );
  
  it ( 'should have default options', () => {
    expect( typeof GWSearch.DEFAULT_SEARCH_OPTIONS ).toEqual( 'object' );
  } );
    
  it( 'should instantiate a new search tool', () => {
    searchTool = new GWSearch();
    expect( searchTool ).toBeTruthy();
    expect( searchTool instanceof GWSearch ).toBeTruthy();
  } );
  
  it( 'should have all required properties', () => {
    expect( 'search' in searchTool ).toBeTruthy();
    expect( typeof searchTool.search ).toEqual( 'function' );
    expect( typeof searchTool.getEntry ).toEqual( 'function' );
    expect( typeof searchTool.entries ).toEqual( 'object' );
    expect( typeof searchTool.searchOptions ).toEqual( 'object' );
    expect( typeof searchTool.idx ).toEqual( 'object' );
  } );

  // TODO:
  it .skip ( 'should apply default search options if none are passed', () => {} );

  it( 'should have search method', () => {
    expect( 'search' in searchTool ).toBeTruthy();
    expect( typeof searchTool.search ).toEqual( 'function' );
  } );
  
  it( 'should return an array of results', () => {
    results = searchTool.search( "IT" );
    expect( Array.isArray( results ) ).toBeTruthy();
  } );
  
  it( 'should have a correctly structured set of results', () => {
    for ( const result of results ) {
      expect( 'id' in result ).toBeTruthy();
      expect( typeof result.id === "string" ).toBeTruthy();
  
      expect( 'score' in result ).toBeTruthy();
      expect( typeof result.score === "number" ).toBeTruthy();
      expect( result.score ).toBeLessThanOrEqual( 1 );
      expect( result.score ).toBeGreaterThanOrEqual( 0 );
  
      expect( 'matches' in result ).toBeTruthy();
      expect( Array.isArray( result.matches ) ).toBeTruthy();
  
      for ( const match of result.matches ) {
        expect( typeof match === 'object' ).toBeTruthy();
        expect( 'key' in match ).toBeTruthy();
        expect( 'value' in match ).toBeTruthy();
        expect( 'indices' in match ).toBeTruthy();
  
        for (const index of match.indices ) {
          expect( Array.isArray( index ) ).toBeTruthy();
          expect( index.length ).toBe( 2 );
          expect( index[ 0 ] ).toBeLessThan( index[ 1 ] );
        }
      }
  
      for ( const lang of langs ) {
        expect( lang in result ).toBeTruthy();
        
        for ( const key in result[ lang ] ) {
          if ( lang === 'fr' ) break; // TODO: Enable french after implementation
          expect( resultKeys.includes( key ) ).toBeTruthy();
          expect( typeof result[ lang ][ key ] ).toBe( 'string' );
        }
      }
    }
  } );

  // TODO:
  it .skip ( 'should handle searching for english results', () => {} );
  it .skip ( 'should handle searching for french results', () => {} );
} );

