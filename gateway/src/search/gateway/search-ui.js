/**
 * @file gwsearch.js
 * @description GCPedia logic for gateway search implementation.
 */

import text from './data/i18n';

let $resultsDataTable = null;

const
  lang = $("html").attr( "lang" ),

  $searchForm = $("#gwSearchForm"),

  resultsContainer = '#searchResultsTable',

  DEFAULT_HIGHLIGHT_TAGS = {
    start: "<span class=\"fa fa-tint bg-primary\">",
    end: "</span>"
  },

  /**
    * @function highlightText
    * @description
    * @param {String} text Text to highlight
    * @param {Array[Number[]]} indices Highlight location indices
    */
  highlightText = ( text, indices, highlightTag = DEFAULT_HIGHLIGHT_TAGS ) => {
    let
      i = null,
      s = null,
      e = null,
      highlightedText = "";

    for (i in text) {
      i = parseInt( i );
      
      // Insert highlight span opening
      for (s in indices) {
        if ( i === indices[ s ][ 0 ] ) {
          highlightedText += highlightTag.start;
          break;
        }
      }

      if ( text[ i ] !== undefined ) {
        highlightedText += text[ i ];
      }

      // Insert highlight span closing
      for (e in indices) {
        if ( i === indices[ e ][ 1 ] ) {
          highlightedText += highlightTag.end;
          break;
        }
      }
    }

    return highlightedText;
  },

  /**
   * @function doSearch
   * @description Performs a search, taking query from URL, invoking the search tool and displaying the results in the UI
   */
  doSearch = async ev => {
    const
      // Get query from URL
      query = ( new URLSearchParams( window.location.search ) ).get("q"),

      // Get search results, or create empty array if there is no query
      { results } = ( query && typeof query === "string" )
        ? await ( await fetch( `/api/search/gateway/${ encodeURIComponent( query ) }` ) ).json()
        : { results: [ ] };

    $("#txtSearchSoftware").val( query );

    if ( ev && "type" in ev && /wb.ready|wb.tables/ig.test( ev.type ) ) {
      $("#gw-search").val( query );
    }

    // Destroy old results
    if ( $resultsDataTable ) {
      try {
        $resultsDataTable.fnDestroy();
      }
      catch(err) { console.log(err); }
    }

    // Display results in table
    $resultsDataTable = $( resultsContainer ).dataTable({
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
        aaSorting: [ ], // Disable initial sorting
        bFilter: false, // Disable filter box
        ordering: true,
        scrollX: true,
        columns: [
          {
            sWidth: "25%",
            title: "Page",
            // orderable: true,
            data: `${lang}.title`,
            render: function( data, type, full ) {
              const
                score = `${ ( ( 1 - full.score ) * 100 ).toFixed(2) }%`,
                // Get HREF, use 404 if falsey value is present in data
                href = `/${ lang }/${ full.url }` || "/404.html";

              // TODO: Translate 'relevancy'
              return `<a href="${ href }">${ data || "Page" }</a><br /><br />${ text[ lang ].relevancy }: ${ score }`;
            }
          },
          {
            sWidth: "75%",
            // TODO: Bilingual
            title: text[ lang ].description,
            // orderable: true,
            data: `${lang}.description`,
            render: function( data, type, full ) {
              // If sorting return score
              if ( type === 'sort' ) {
                return full.score;
              }
              
              // Results highlighting
              // const textMatches = full.matches.find(match => match.key === `${lang}.text`);
              // if ( textMatches && 'indices' in textMatches ) {  
              //   return highlightText( data, textMatches.indices );
              // }
              
              return data;
            }
          }
        ]
      });
  };

  // Perform search on wet-ready
  $( document ).one( 'wb-ready.wb-tables', doSearch );

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
    scrollTop: $( "#gwSearchForm" ).offset().top
  }, 'fast');
  
  setTimeout( () => { $( `${ resultsContainer } tbody tr` ).first().focus(); }, 33 );
} );

