'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

const util = require( 'util' );
const R = require( 'ramda' );
const { Client } = require( '@elastic/elasticsearch' );

const delay = ( ms = 5000 ) => new Promise( ( resolve, reject ) => {
  try {
    if ( !parseInt( ms ) ) {
      ms = 5000;
    }
    setTimeout( resolve, ms );
  }
  catch ( e ) { reject( e ); }
} ) ;

module.exports = async () => {
  // FIXME: May be initializing elasticsearch in the wrong strapi lifecycle phase -> api container resets until elastic accepts connection, despite docker-compose 'depends_on'
  // Initialize elasticsearch globals
  // TODO: Writable as a plugin? There official one seems to have gone nowhere.
  strapi.elastic = {};

  strapi.elastic.isConnected = false;

  const {
    GATEWAY_SEARCH_INDEX,
    SOFTWARE_SEARCH_INDEX,
    GATEWAY_SEARCH_PROPERTIES,
    SOFTWARE_SEARCH_PROPERTIES,

    // Add elasticConfig to strapi global
  } = strapi.elastic.config = {

    GATEWAY_SEARCH_INDEX: 'servicegateway',
    
    SOFTWARE_SEARCH_INDEX: 'servicegateway-software',

    GATEWAY_SEARCH_PROPERTIES: {
      name: { type: 'text' },
      parent_page: { type: 'text' },
      category: { type: 'text' },
      header_en: { type: 'text' },
      header_fr: { type: 'text' },
      description_en: { type: 'text' },
      description_fr: { type: 'text' },
      content_en: { type: 'text' },
      content_fr: { type: 'text' },
      tab_groups: {
        tabs: { 
          category: { type: 'text' },
          header_en: { type: 'text' },
          header_fr: { type: 'text' },
          content_en: { type: 'text' },
          content_fr: { type: 'text' },
        },
      },
      tabs: { 
        category: { type: 'text' },
        header_en: { type: 'text' },
        header_fr: { type: 'text' },
        content_en: { type: 'text' },
        content_fr: { type: 'text' },
      },
      margin_notes: { 
        header_en: { type: 'text' },
        header_fr: { type: 'text' },
        content_en: { type: 'text' },
        content_fr: { type: 'text' },
      },
      actions: { 
        header_en: { type: 'text' },
        header_fr: { type: 'text' },
        content_en: { type: 'text' },
        content_fr: { type: 'text' },
      },
      id: { type: 'text' },
    },

    SOFTWARE_SEARCH_PROPERTIES: {
      slsa_primary_en: { type: 'text' },
      slsa_primary_fr: { type: 'text' },
      slsa_others_en: { type: 'text' },
      slsa_others_fr: { type: 'text' },
      context_en: { type: 'text' },
      context_fr: { type: 'text' },
      name: { type: 'text' },
      acronym: { type: 'text' },
      application: { type: 'text' },
      businessAppType: { type: 'text' },
      compatibility: { type: 'text' },
      cost: { type: 'text' },
      edition: { type: 'text' },
      language: { type: 'text' },
      restricted: { type: 'boolean' },
      shortName: { type: 'text' },
      standard: { type: 'boolean' },
      vendor: { type: 'text' },
      version: { type: 'text' },
      id: { type: 'text' },
    },
  };


  // Strapi elastic initialize method
  strapi.elastic.init = async () => {
    // Initialize elasticsearch client
    do {
      try {
        strapi.elastic.client = new Client({
          log: 'error',
          node: 'http://sfe-chatbot-elasticsearch:9200',
          maxRetries: 5,
          requestTimeout: 600000,
        });
  
        strapi.elastic.isConnected = true;
        break;
      }
      catch( err ) {
        // TODO: Err, max retries...
        console.log( err );
        strapi.elastic.isConnected = false;
        await delay();
      }
  
    } while ( !strapi.elastic.isConnected );
  
  
    // Initialize software search
    const softwareSearchExistsResponse = await strapi.elastic.client.indices.exists({
      index: SOFTWARE_SEARCH_INDEX,
    });
  
    // console.log( util.inspect(softwareSearchExistsResponse, { depth: 6 }) );
  
    // Create and index sw search if not exists
    if ( !softwareSearchExistsResponse.body ) {
     
      const softwares = (await strapi.query( 'software' ).model
        .find(
          { },
           R.keys( SOFTWARE_SEARCH_PROPERTIES ).join( " " ).trim(),
        ))
        // spread object with id (keeps consistency from mongoose), pick only keys from properties
        .map( item => R.pick( R.keys( SOFTWARE_SEARCH_PROPERTIES ), { ...item._doc, ...R.pick( [ 'id' ], item ) } ) );
  
      // Create index
      try {
        await strapi.elastic.client.indices.create({
          index: SOFTWARE_SEARCH_INDEX,
          body: {
            mappings: {
              properties: SOFTWARE_SEARCH_PROPERTIES
            }
          }
        }, { ignore: [404] });
    
      }
      catch( err ) {
        console.log( util.inspect(err, { depth: 6 }) );
      }
  
      // Create and batch index
      try {
        const batchCollection = softwares.flatMap( item => [{ index: { _index: SOFTWARE_SEARCH_INDEX, _id: item.id } }, item ] );
      
        const { body: bulkResponse } = await strapi.elastic.client.bulk({ refresh: true, body: batchCollection });
      
        // console.log( util.inspect(bulkResponse, { depth: 6 }) );
  
        // Refresh index
        await strapi.elastic.client.indices.refresh({ index: SOFTWARE_SEARCH_INDEX });
  
        // const { body: count } = await strapi.elastic.client.count({ index: SOFTWARE_SEARCH_INDEX });
          
        // console.log( '******* SEARCH INDEX COUNT:' );
        // console.log( util.inspect(count, { depth: 6 }) );
      
        // const { body: testResults } = await strapi.elastic.client.search({
        //   index: SOFTWARE_SEARCH_INDEX,
        //   body: {
        //     query: {
        //       fuzzy: { shortName: 'firefox' }
        //     },
        //   },
        // });
      
        // console.log( util.inspect(testResults, { depth: 6 }) );
      }
      catch ( err ) {
        //TODO: Handle errors
        console.log( util.inspect(err, { depth: 6 }) );
      }
  
    }
  
  
    // Initialize gateway search
    const gatewaySearchExistsResponse = await strapi.elastic.client.indices.exists({
      index: GATEWAY_SEARCH_INDEX,
    });
  
    // Create and index gw search if not exists
    if ( !gatewaySearchExistsResponse.body ) {
  
      // query mongoose for pages
      /* TODO: Other categories... global list?*/
      // console.log( strapi.api );

      const entries = [];
  
        try {
          // const page = await strapi.query( pageName ).model.findOne() 
          const page = await strapi.query( 'home-pages' ).model.find() 
            .populate({ path: "sub_pages", })
            .populate({ path: "sub_pages.actions", })
            .populate({ path: "sub_pages.margin_notes", })
            .populate({ path: "sub_pages.tab_groups.tabs", })
            .populate({ path: "sub_pages.tab_groups.tabs.notes", })
            .populate({ path: "sub_pages.tab_groups.tabs.actions", });
    
          // page && entries.push( page );
          if ( page ) entries.push( ...page );
        }
        catch( err ) {
          console.log( "Error fetching pages:\n", err );
        }
      
      // console.log( entries );

      // flatten pages, spreading sub-pages to same search scope as parent and picking only keys required from props
      // TODO: Separate tabbed content from sub-pages to be searched independently if tab.is_searched_independently === true
      const formattedEntries = R.flatten(
        R.map( page => {
          return [
            // Flatten with id to force consistency from mongoose.
            R.pick( R.keys( GATEWAY_SEARCH_PROPERTIES ), { ...page._doc, ...R.pick( [ 'id' ], page ) } ),

            ...R.map( subPage => {  

              return R.pick( R.keys( GATEWAY_SEARCH_PROPERTIES ), { ...subPage._doc, ...R.pick( [ 'id' ], subPage ) } );

            }, page.sub_pages )

          ];

        }, entries )
      );
  
      // Create index
      try {
        await strapi.elastic.client.indices.create({
          index: GATEWAY_SEARCH_INDEX,
          body: {
            mappings: {
              properties: GATEWAY_SEARCH_PROPERTIES
            }
          }
        }, { ignore: [404] });
    
      }
      catch( err ) {
        console.log( util.inspect(err, { depth: 6 }) );
      }
  
      // Create bulk request
      try {
        const batchCollection = formattedEntries.flatMap( page => [{ index: { _index: GATEWAY_SEARCH_INDEX, _id: page.id } }, page ] );
      
        const { body: bulkResponse } = await strapi.elastic.client.bulk({ refresh: true, body: batchCollection });
      
        // console.log( util.inspect(bulkResponse, { depth: 6 }) );
  
        // Refresh index
        await strapi.elastic.client.indices.refresh({ index: GATEWAY_SEARCH_INDEX });
  
        // const { body: count } = await strapi.elastic.client.count({ index: GATEWAY_SEARCH_INDEX });
          
        // console.log( '******* GATEWAY INDEX COUNT:' );
        // console.log( util.inspect(count, { depth: 6 }) );
      
        // const { body: testResults } = await strapi.elastic.client.search({
        //   index: GATEWAY_SEARCH_INDEX,
        //   body: {
        //     query: {
        //       fuzzy: { header_en: 'get' }
        //     },
        //   },
        // });
      
        // console.log( util.inspect(testResults, { depth: 6 }) );
      }
      catch ( err ) {
        //TODO: Handle errors
        console.log( util.inspect(err, { depth: 6 }) );
      }
  
  
    }

  };

  // Reset search indices method
  strapi.elastic.resetIndices = async () => {
    strapi.elastic.isConnected = false;
    
    // delete indices
    await strapi.elastic.client.indices.delete({
      index: [
        GATEWAY_SEARCH_INDEX,
        SOFTWARE_SEARCH_INDEX,
      ]
    });

    // re-initialize
    await strapi.elastic.init();
  };

  // init on startup
  await strapi.elastic.init();


};
