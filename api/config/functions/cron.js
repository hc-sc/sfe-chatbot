'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

module.exports = {
  /**
   * Every monday at 11pm.
   */
  '0 23 * * 1': () => {
    console.log( 'cron test' );
      // TODO: Recalculate software search index when new set is published (monday after hours?)
      //       Could also do a POST hook on the API...
      const { GATEWAY_SEARCH_INDEX, SOFTWARE_SEARCH_INDEX } = strapi.elastic.config;

      try {
        strapi.elastic.client.indices.refresh({ index: GATEWAY_SEARCH_INDEX });
      }
      catch( err ) {
        console.log( err );
      }

      try {
        strapi.elastic.client.indices.refresh({ index: SOFTWARE_SEARCH_INDEX });
      }
      catch( err ) {
        console.log( err );
      }
  },
  // '*/1 * * * * *': () => {
  //   console.log( 'cron test' );
  // },
};
