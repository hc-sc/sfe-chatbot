/**
 * @file sgsearch.js
 * @description UI Logic for the IM/IT Gateway software search implementation .
 * Last modified Feb 13, 2019
 */

import text from './data/i18n';

let $resultsDataTable = null;

const
  $searchForm = $("#swSearchForm"),

  resultsWrapper = "#searchResultsWrapper",

  resultsContainer = '#searchResultsTable',

  multiExceptionRegex = /\([0-9]\)(?:.|\r?\n?)*\([0-9]\)/,

  /**
   * @function setRequestModalContents
   * @description Populates inline modal with updated name and body content
   * @param {string} shortName Software name
   * @param {string} modalBody String representing HTML modal body content
   */
  setRequestModalContents = ( shortName, modalBody, lang ) => {
    const 
      $requestModalBody = $( "#sw-request-modal .modal-body" ),
      $requestModalHeader = $( "#sw-request-modal .modal-title" );

    // Set modal contents
    $requestModalBody.html( modalBody );
    $requestModalHeader.html( `${ text[ lang ].requestDetails }: '${ shortName }'` );

    if ( !wb || !wb.doc ) {
      throw new Error("WET document reference not initialized!");
    }

    // Show modal
    wb.doc.trigger(
      "open.wb-lbx",
      [
        [{
          src: "#sw-request-modal",
          type: "inline" 
        }],
        true 
      ]
    );
  },

  /**
   * @function getActionUrl
   * @description Return correct url for costed/free applications
   * @param {bool} cost Cost flag, set to true for cost url and false for free
   */
  getActionUrl = ( cost, lang = "en" ) => cost
    ? "https://sap-portal.hc-sc.gc.ca:8445/irj/portal"
    : `http://nsdonline-bsnenligne.hc-sc.gc.ca/${ lang }/request/software_new_unlicensed/software_configure`,

  /**
   * @constant {Object} splitModalReplacement
   * @description Replacement items for split modal content
   */
  splitModalReplacement = {
    en: {
      cegReplace:/(Client\sEngagement\sand\sGovernance\s\(CEG\)\srepresentative|CEG\srepresentative)/ig,
      cegLink: "http://mysource.hc-sc.gc.ca/eng/ss/programs-services/information-management-information-technology/technical-support/client",
    },
    fr: {
      cegReplace: /(représentant\sPersonnes\-ressources\sde\smobilisation\sdes\sclients\set\sla\sgouvernance)/ig,
      cegLink: "http://mysource.hc-sc.gc.ca/fra/sp/programmes-services/gestion-linformation-technologie-linformation/soutien-technique/personnes"
    },
  },

  /**
   * @function doSearch
   * @description Main search method: performs search if query is present then displays results using datatables plugin. 
   */
  doSearch = async ( query = ( new URLSearchParams( window.location.search ) ).get("q") ) => {
    const lang = $("html").attr( "lang" );

    if ( !query ) {
      // No query, abort search!
      return;
    }
    
    // Show results wrapper
    $( resultsWrapper )
      .show()
      .removeClass('hidden');

    // Get search results, or create empty array if there is no query
    const { results } = ( query && typeof query === "string" )
      ? await ( await fetch( `/api/search/software/${ encodeURIComponent( query ) }` ) ).json()
      : { results: [ ] };

    if ( results.length ) {
      $("#txtSearchSoftware").val( query );
    }

    if ( $resultsDataTable ) {
      try {
        $resultsDataTable.fnDestroy();
      }
      catch(err) { console.log(err); }
    }

    $resultsDataTable = $( resultsContainer ).dataTable(
      // DT Config
      {
        language: {
          info: text[ lang ].info,
          infoEmpty: text[ lang ].infoEmpty,
          infoFiltered: text[ lang ].infoFiltered,
          lengthMenu: text[ lang ].lengthMenu,
          paginate: {
            previous: text[ lang ].previous,
            next: text[ lang ].next,
          },
          search: text[ lang ].filter,
        },
        data: results,
        destroy: true,
        paging: true,
        aaSorting: [], // Disable initial sorting
        bSort: true,
        ordering: true,
        scrollX: true,
        columnDefs: [
          {
            ordering: true,
            targets: "no-sort",
          },
          {
            defaultContent: "-",
            targets: "_all",
          }
        ],
        createdRow: ( row, data ) => {
          $( row ).attr( 'tabindex', 0 );

          // Check if entry is exception
          if ( !data.restricted ) return;

          let { shortName, exceptionEmail } = data;
          let userContext = data[ lang ].context;
          const $requestBtn = $( row ).find( '.btn-request-exception' );

          if ( exceptionEmail && typeof exceptionEmail === "string"  ) {
            // Create modal directing user to send email for exception

            const mailSubject = encodeURIComponent( text[ lang ].exceptionEmailSubject.replace( /_SOFTWARE_/i, data.shortName ) );

            // TODO: Email subject
            const modalBody = `
<ul class='list-group'>
  <li class='list-group-item'>
    <div class="row">
      <div class="col-xs-12">
        ${ text[ lang ].exceptionEmail }
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 text-center">
        <a role="button" target="_blank" class="btn btn-default" href="mailto:${ exceptionEmail }?subject=${ mailSubject }">${ text[ lang ].request }</a>
      </div>
    </div>
  </li>
</ul>
              `.trim();

              $requestBtn.on( 'click', function( ev ) {
                ev.preventDefault && ev.preventDefault();
                setRequestModalContents( shortName, modalBody, lang );
              } );
          }
          else if ( userContext && typeof userContext === 'string' ) {
            // Create modal explaining and presenting restriction options to user
            userContext = userContext.replace(/\r?\n|\r/gm, "");

            if ( multiExceptionRegex.test( userContext ) ) {
              // Format user context text into manageable paragraphs
              userContext = userContext
                .split( /\([0-9]\)/ )
                .filter( s => !!s )
                // Apply text formatting
                .map( s => s
                  .replace( splitModalReplacement[ lang ].cegReplace, `<a href="${ splitModalReplacement[ lang ].cegLink }" target="_blank">$1</a>` )
                  .replace( /([^\.]*)\./, "$1.%%%%" )
                  .trim()
                  .split( "%%%%" )
                );

              const modalBody = `
<ul class='list-group'>
  <li class='list-group-item'>
    <div class="row">
      <div class="col-xs-12">
        <h3 class="h5">${ userContext[ 0 ][ 0 ] }</h3>
        <p>${ userContext[ 0 ][ 1 ] }</p>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 text-center">
        <a role="button" target="_blank" class="btn btn-default" href="${ getActionUrl( false, lang ) }">${ text[ lang ].request }</a>
      </div>
    </div>
  </li>
  <li class='list-group-item'>
    <div class="row">
      <div class="col-xs-12">
        <h3 class="h5">${ userContext[ 0 ][ 0 ] }</h3>
        <p>${ userContext[ 1 ][ 1 ] }</p>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 text-center">
        <a role="button" target="_blank" class="btn btn-default" href="http://mysource.hc-sc.gc.ca/sites/default/files/non-standard-it-approval-request-eng.xlsx">${ text[ lang ].request }</a>
      </div>
    </div>
  </li>
</ul>
              `.trim();

              $requestBtn.on( 'click', function( ev ) {
                ev.preventDefault && ev.preventDefault();
                setRequestModalContents( shortName, modalBody, lang );
              } );
            }
          }


        },
        columns: [
          {
            width: "25%",
            title: text[ lang ].software,
            data: "shortName",
            render: ( data, type, full ) => {
              if ( type === 'sort' ) {
                return data;
              }

              let softwareInfo = '<dl class="dl-horizontal brdr-0">';

              if ( data && typeof data === 'string' ) {
                softwareInfo = `${ softwareInfo }<dt>${ text[ lang ].name }</dt><dd>${ data }</dd>`;
              }
            
              if ( full.version && typeof full.version === 'string' ) {
                softwareInfo = `${ softwareInfo }<dt>${ text[ lang ].version }</dt><dd>${ full.version }</dd>`;
              }

              if ( full.edition && typeof full.edition === 'string' ) {
                softwareInfo = `${ softwareInfo }<dt>${ text[ lang ].edition }</dt><dd>${ full.edition }</dd>`;
              }
              
              softwareInfo = `${ softwareInfo }</dl>`;

              return softwareInfo;
            }
          },
          {
            width: "25%",
            title: text[ lang ].type,
            data: `${ lang }.slsa`,
            render: ( data, /* type, full */ ) => {
              let
                // Format SLSA points
                // TODO: format in model instead?
                types = [
                  ...data.primary
                    .replace(/([A-Z])/g, ' $1').trim()
                    .split(/%%%%|,\s?|;\s?/g),
                  ...data.others
                    .replace(/([A-Z])/g, ' $1').trim()
                    .split(/%%%%|,\s?|;\s?/g)
                ].filter( item => !!item ),

                // Create list
                $list = $("<ul class='list-group'>");

              // Append types to list
              for ( let type of types ) {
                $list.append( $("<li>").text( type ) );
              }

              return $list.prop( 'outerHTML' );
            }
          },
          {
            width: "25%",
            title: text[ lang ].details,
            data: `${ lang }.context`,
            render: ( data, type, full ) => {
              // Use name as the orthogonal data source while sorting
              if ( type === 'sort' ) {
                return full.shortName;
              }

              // Construct details text
              let details = `<dl class="dl-horizontal brdr-0">`;

              if ( !full.vendor && !full.language && !full.compatibility && !data ) {
                details = "-";
              }
              else {
                if ( full.vendor && typeof full.vendor === 'string' ) {
                  details = `${ details }<dt>${ text[ lang ].vendor }</dt><dd>${ full.vendor }</dd>`;
                }

                if ( full.language && typeof full.language === 'string' ) {
                  details = `${ details }<dt>${ text[ lang ].language }</dt><dd>${ full.language }</dd>`;
                }
                
                if ( full.compatibility && typeof full.compatibility === 'string' ) {
                  details = `${ details }<dt>${ text[ lang ].compatibility }</dt><dd>${ full.compatibility.replace(";", ", ") }</dd>`;
                }
                
                details = `${ details }</dl>`;

                if ( data && typeof data === 'string' && !multiExceptionRegex.test( data ) ) {
                  // User context is not a multi-request exception, append to details
                  data = data.replace(/\r?\n|\r/gm, "");
                  details = `${ details }<p>${ data }</p>`;
                }
              }

              return details;
            }
          },
          {
            width: "10%",
            title: text[ lang ].cost,
            data: "cost",
            render: ( data, type, full ) => {
              // Generate cost text, checking if data is restricted
              return `${ /cost/i.test( data ) ? text[ lang ].cost : text[ lang ].free }${ full.restricted ? "(" + text[ lang ].restricted + ")" : "" }`;
            }
          },
          {
            width: "15%",
            title: text[ lang ].action,
            data: "cost",
            render: ( data, type, full ) => {
              // Use name as the orthogonal data source while sorting
              if ( type === 'sort' ) {
                return full.name;
              }

              const
                { restricted } = full,
                exception = 
                  multiExceptionRegex.test( full[ lang ].context )
                  || full.exceptionEmail,
                cost = /cost/i.test( data );

              if ( exception ) {
                // If exception, stage button for modal generation in 'createdRow' datatables callback
                return `<button class="btn btn-default btn-request-exception">${ text[ lang ].request }</a>`;
              }
              else if ( /recover/i.test( data ) || ( !cost && restricted ) ) {
                // Cost Recovery and Free + Restricted to NSD
                return `<a role="button" target="_blank" class="btn btn-default" href="${ getActionUrl( false, lang ) }">${ text[ lang ].request }</a>`;
              }
              else {
                return `<a role="button" target="_blank" class="btn btn-default" href="${ getActionUrl( cost, lang ) }">${ text[ lang ].request }</a>`;
              }
            }
          }
        ]
      }
    );
  };

// Perform search on wet-ready
$( document ).one( 'wb-ready.wb-tables', () => {
  // Hide results wrapper on load

  $( resultsWrapper )
    .hide()
    .addClass('hidden');

  const query = ( new URLSearchParams( window.location.search ) ).get("q");

  if ( query ) {
    doSearch( query );
  }
} );

// Perform search on form submit
$searchForm.on( 'submit', ev => {
  // Prevent page reload from form submit
  ev.preventDefault && ev.preventDefault();
  
  const 
    query = $("#txtSearchSoftware").val(),
    URL = `${ window.location.href.split("?")[0] }?q=${ query }`;

  window.history.replaceState( null, null, URL );

  doSearch();
} );

// Scroll to top of table while paginating
$( resultsContainer ).on( 'page.dt', () => {
  $('html, body').animate({
    scrollTop: $( "#swSearchForm" ).offset().top
  }, 'fast');

  setTimeout( () => { $( `${ resultsContainer } tbody tr` ).first().focus(); }, 33 );
} );
