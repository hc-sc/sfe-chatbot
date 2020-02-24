const performSearch = ev => {
  ev.preventDefault && ev.preventDefault();

  const 
    lang = $("html").attr( "lang" ),
    query = encodeURIComponent( $( "#txtSearchSoftware" ).val() ),
    redirectUrl = `${ window.location.origin }/${ lang }/s-get.html?q=${ query }`;

  window.location.href = redirectUrl;
};

const enableSearch = () => {
  const $searchForm = $( "#gw-search-software-form" );

  $searchForm.on( 'submit', performSearch );
};

$( document ).on( 'wb-ready.wb', enableSearch );
