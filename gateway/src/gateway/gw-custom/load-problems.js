$( document ).one( 'wb-ready.wb-tables', function(){
  var
    $problemTable = $("#problems"),
    lang = $("html").attr("lang");

  var url = window.location.href.replace(/(?:en|fr)\/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))(?:.*)?/i, "gw-custom/report-problem.php?dump");

  $.ajax({
    url: url,
    method: "GET",
    contentType: false,
    processData: false,
    cache: false,
    success: function( response, status, xhr ) {
      response = JSON.parse( response );

      $problemTable.DataTable({
        language: {
          search: lang === "fr" 
            // FIXME: TRANSLATION
            ? "FRENCH Filter: "
            : "Filter: "
        },
        data: response,
        destroy: true,
        paging: true,
        order: [
          [ 2, "asc" ]
        ],
        columnDefs: [
          { targets: [ 2 ], type: 'Date' }
        ],
        columns: [
          {
            sWidth: "40%",
            // FIXME: VERIFY TRANSLATION
            title: "Problem",
            orderable: false,
            data: "problem",
            render: function ( data ) {
              var
                problems = null,
                $list = $("<ul>");

              try {
                // Parse data assuming newer stringified array approach
                problems = Array.isArray( data )
                  ? data
                  : JSON.parse( data );
              }
              catch( err ) {
                // Data is in old (string.join(",")) format
                problems = data.split(",");
              }

              problems = problems.filter( function( p ) { return !!p; } );

              if ( problems.length ) {
                for ( let i = 0; i < problems.length; i++ ) {
                  $list.append( $("<li>").text( problems[ i ] ) );
                }
              }
              else {
                $list.append( $("<li>").text( "User did not specify any problems." ) );
              }

              return $list.prop( 'outerHTML' );
            }
          },
          {
            sWidth: "40%",
            // FIXME: VERIFY TRANSLATION
            title: "Page",
            orderable: false,
            data: "page",
            render: function ( data ) { return data; }
          },
          {
            sWidth: "20%",
            // FIXME: VERIFY TRANSLATION
            title: "Date",
            orderable: true,
            data: "date",
            render: function ( data, type ) { 
              if ( type === 'sort' ) {
                return data;
              }

              return data; 
            }
          }
        ],
        initComplete: function( ) {
          $("#problems > thead > tr > th:last-child").click()
        }
      });
    }
  });
} );
