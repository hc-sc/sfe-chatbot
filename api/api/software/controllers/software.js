'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */


const R = require('ramda');

//  Helper to filter locale from search
const oppositeLocaleMap = { en: "fr", fr: "en" };
const queryWithLocale = ( query, locale = "en" ) => {
  const oppositeLocale = oppositeLocaleMap[ locale ];

  query.body[ '_source' ] = {
    exclude: [
      `slsa_primary_${ oppositeLocale }`,
      `slsa_others_${ oppositeLocale }`,
      `context_${ oppositeLocale }`,
    ]
  };
};

module.exports = {
  // Access elastic client and 
  // TODO: Fallback to mongo, error?
  async softwareSearch( obj, { query = "", locale = "" , all = false } ) {
    const { SOFTWARE_SEARCH_INDEX } = strapi.elastic.config;

    locale = locale.toLowerCase();

    if ( all ) { // Skip search, format and return all.
      const elasticQuery = {
        index: SOFTWARE_SEARCH_INDEX,
        from: 0,
        size: 10000,
        body: {
          query: {
            match_all: { },
          }
        },
      }
      
      const { body: allResult } = await strapi.elastic.client.search( locale ? queryWithLocale( elasticQuery, locale ) : elasticQuery );

      const results = R.map( hit => R.pick( [ '_id', '_score', '_source' ], hit ) , allResult.hits.hits );

      return results;
    }


    const elasticQuery = {
      index: SOFTWARE_SEARCH_INDEX,
      from: 0,
      size: 10000,
      body: {
        query: {
          multi_match: {
            query,
            fuzziness: "AUTO",
            prefix_length: 3,
            fields: [ 
              'slsa_primary_en^3',
              'slsa_primary_fr^3',
              'slsa_others_en^3',
              'slsa_others_fr^3',
              'context_en^3',
              'context_fr^3',
              'name^5.5',
              'acronym^5',
              'application^5',
              'businessAppType^3',
              'compatibility^3',
              'cost^2',
              'edition^3',
              'language^1',
              'shortName^6',
              'vendor^5',
              'version^3',
              'id^0.5',
            ],
          },
        },
      },
    };

    const { body: searchResult } = await strapi.elastic.client.search( elasticQuery );

    return searchResult.hits.hits;
  }
};
