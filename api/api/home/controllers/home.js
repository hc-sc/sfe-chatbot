'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const R = require('ramda');

module.exports = {
  // Search gateway content with elastic client
  async gatewaySearch( obj, { query = "", locale = "en" } ) {

    locale = locale.toLowerCase();

    const elasticQuery = {
      index: strapi.elastic.config.GATEWAY_SEARCH_INDEX,
      from: 0,
      size: 10000,
      body: {
        query: {
          multi_match: {
            query,
            fuzziness: "AUTO",
            prefix_length: 3,
            fields: [ 
              "name",
              "parent_page",
              "category",
              `header_${ locale }`,
              `description_${ locale }`,
              `content_${ locale }`,
              `tabs.header_${ locale }`,
              `tabs.description_${ locale }`,
              `tabs.content_${ locale }`,
              // TODO: results not populating margin_notes.. low priority - notes not used
              `margin_notes.header_${ locale }`,
              `margin_notes.description_${ locale }`,
              `margin_notes.content_${ locale }`,
            ],
          },
        },
      },
    };

    const { body: searchResults } = await strapi.elastic.client.search( elasticQuery );

    return R.map( hit => R.pick( [ '_id', '_score', '_source' ], hit ) , searchResults.hits.hits )

  }
};
