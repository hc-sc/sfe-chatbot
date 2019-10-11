/**
 * @file module.js
 * @description _SGSearch search class module for used to search for software in the HC Software Gateway currently hosted on GCPedia
 */
import data from "./data/hcsc-sftwrgtwy-searchdata.json";
import Fuse from 'fuse.js';

/**
 * @class _SGSearch
 * @description Search library class for the Software Gateway. Provides methods for searching through a pre-indexed search model.
 * @prop {Object} Fuse Fuse.js reference
 * @prop {Object} idx Search index object
 * @prop {Method} mapFullResults Used to map basic search results into set of results containing full document entries
 * @prop {Method} getEntry Returns document with given reference id
 * @prop {Method} entries Getter for returning array of all data entries
 * @prop {Method} search Main search function. Takes options to refine search results
 */
class _SGSearch {
  /**
   * @constructor
   * @description Initializes search index as object property
   * @param {Object} searchOptions Customizable search options, merged on top of defaults
   * @param {string} lang Search language
   */
  constructor( searchOptions = null, lang = "en" ) {
    this.entries = data;
    this.searchOptions = typeof searchOptions === 'object'
      ? Object.assign( { }, _SGSearch.DEFAULT_SEARCH_OPTIONS, searchOptions )
      : _SGSearch.DEFAULT_SEARCH_OPTIONS;

    this.searchOptions.keys = this.searchOptions.keys.map( key => {
      key.name = key.name.replace(/{LANG}/, lang);
      return key;
    } )

    this.idx = new Fuse( data, this.searchOptions );
  }

  /**
   * @prop {Object} DEFAULT_SEARCH_OPTIONS
   * @description Default fuse search options
   * // TODO: Bilingual options
   */
  static DEFAULT_SEARCH_OPTIONS = {
    maxPatternLength: 64,
    minMatchCharLength: 2,
    includeScore: true,
    shouldSort: true,
    tokenize: false, // Search words individually when true, whole phrase when false
    // The following options only apply when tokenization is set to true
    // matchAllTokens: true,
    // The following options only apply when tokenization is set to false
    threshold: 0.35,
    location: 0,
    distance: 100,
    keys: [
      {
       name: "shortName",
       weight: 0.9
      },
      {
       name: "application",
       weight: 0.9
      },
      {
       name: "name",
       weight: 0.85
      },
      {
       name: "acronym",
       weight: 0.8
      },
      {
       name: "vendor",
       weight: 0.65
      },
      {
       name: "business",
       weight: 0.65
      },
      {
       name: "{LANG}.slsa.primary",
       weight: 0.55
      },
      {
       name: "{LANG}.slsa.others",
       weight: 0.55
      },
      {
       name: "version",
       weight: 0.5
      },
      {
       name: "edition",
       weight: 0.5
      },
      {
       name: "language",
       weight: 0.5
      },
    ]
  }

  /**
   * @property {Object} Fuse
   * @description Fuse.js reference, conveniently wrapped as static member of the SGSearch class
   * @returns {Object} Fuse.js object ()
   */
  static get Fuse() { return Fuse; }

  /**
   * @method mapFullResults
   * @description Used to map basic search results into full results, containing the entire document entry
   * @param {Object[]} searchResults Array of elasticlunr search results
   * @returns {Object} Software document entry
   */
  mapFullResults = searchResults => searchResults.map(({ ref, score }) => {
    const doc = this.getEntry( ref );
    return { ...doc, score, ref };
  })
  
  /**
   * @method getEntry
   * @description Gets document with given id from indexed documents
   * @param {Number} id Document reference id
   * @returns {Object} Software document entry
   */
  getEntry = id => this.idx
    ? this.entries[ id ]
    : () => { throw new Error('CRITICAL ERROR - search index not present.'); };

  /**
   * @method search
   * @description Perform a search query on the model
   * @param {String} query Search query string
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

    return this.idx.search( query, this.searchOptions ).map( result => ({
      ...result.item,
      score: result.score,
    }) );
  }

}

// Make class global if not being required/imported
global.SGSearch = _SGSearch;

// Export _SGSearch as default the module
export default _SGSearch;
