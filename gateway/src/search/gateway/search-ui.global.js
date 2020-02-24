const performSearch = ev => {
  ev.preventDefault && ev.preventDefault();

  const
    lang = $("html").attr( "lang" ),
    query = encodeURIComponent( $( "#gw-search" ).val() ),
    redirectUrl = `${ window.location.origin }/${ lang }/gateway-search-results?q=${ query }`;

  window.location.href = redirectUrl;
};

const enableSearch = () => {
  const $searchForm = $( "#gw-search-form" );

  $searchForm.on( 'submit', performSearch );
};

$( document ).on( 'wb-ready.wb', enableSearch );
