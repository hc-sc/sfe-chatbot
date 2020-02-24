/**
 * @file module.js
 * @description _GWSearch search class module for used to facilitate the gateway search
 */

import data from './data/hcsc-gwsearch-sitelist.json';
import Fuse from 'fuse.js';

class _GWSearch {
  constructor( searchOptions = null, lang = "en" ) {    
    this.entries = data;
    this.searchOptions = typeof searchOptions === 'object'
      ? Object.assign( { }, _GWSearch.DEFAULT_SEARCH_OPTIONS, searchOptions )
      : _GWSearch.DEFAULT_SEARCH_OPTIONS;

    this.searchOptions.keys = this.searchOptions.keys.map( key => {
      key.name = key.name.replace(/{LANG}/, lang);
      return key;
    } );

    this.idx = new Fuse( data, this.searchOptions );
  }

  /**
   * @prop {Object} DEFAULT_SEARCH_OPTIONS
   * @description Default fuse search options
   */
  static DEFAULT_SEARCH_OPTIONS = {
    maxPatternLength: 64,
    minMatchCharLength: 2,
    includeScore: true, // A score of 0 indicates a perfect match, while a score of 1 indicates a complete mismatch.
    includeMatches: true,
    findAllMatches: true,
    shouldSort: true,
    tokenize: true, // Search words individually when true, whole phrase when false
    // tokenize: false, // Search words individually when true, whole phrase when false
    // The following options only apply when tokenization is set to true
    // matchAllTokens: false,
    // The following options only apply when tokenization is set to false
    // threshold: 0.3,
    // location: 0,
    // distance: 500,
    keys: [
      {
       name: "{LANG}.title",
      //  weight: 0.2
       weight: 0.95
      },
      {
       name: "{LANG}.keywords",
      //  weight: 0.7
       weight: 0.85
      },
      {
       name: "{LANG}.content",
      //  weight: 0.8
       weight: 0.8
      },
      {
       name: "{LANG}.description",
      //  weight: 0.85
       weight: 0.7
      },
      {
       name: "url",
      //  weight: 0.95
       weight: 0.2
      },
    ]
  }

  /**
   * @prop {Object[]} entries
   * @description Gateway search data entries
   */
  set entries( data ) {
    if ( !Array.isArray( data ) ) {
      throw new Error( "Fuse data is not an array!" );
    }

    this._data = data;
  }
  
  get entries() {
    return this._data;
  }

  /**
   * @method getEntry
   * @description Gets entry at specified index from entries list
   * @param {Number} id Entry index id
   */
  getEntry( id ) {
    return this._data[ id ];
  }

  /**
   * @method search
   * @description Performs tipue search on provided pages with user query
   * @param {String} query User search query
   * @param {Object} searchOptions Query specific search options, optional override for instantiated defaults
   * @returns {Object[]} Returns array of search results containing reference ids and score values
   */
  search = ( query, searchOptions = {} ) => {
    // Apply custom search options on top of defaults
    if ( typeof searchOptions !== 'object' ) {
      throw new Error( 'Invalid search options used, please see "http://fusejs.io/" for details on how to configure customized search options.' );
    }
    else {
      searchOptions = Object.assign( {}, this.searchOptions, searchOptions );
    }

    // Query only max length
    query = query.substr( 0, this.searchOptions.maxPatternLength );

    return this.idx.search( query, this.searchOptions ).map( result => {
      const { item, score, matches } = result;
      return { ...item, score, matches };
    } );
  }
}

// Make class global if not being required/imported
global.GWSearch = _GWSearch;

// Export _GWSearch as the default module
export default _GWSearch;
