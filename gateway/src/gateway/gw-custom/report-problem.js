function createModal(title, body, closeBtnBody) {
  var 
    closeBtnHiddenTxt = closeBtnBody.substring( 6, closeBtnBody.length ),
    closeBtnTitle = closeBtnHiddenTxt.replace( /(&nbsp;|<([^>]+)>)/ig, "" );
  
  return (
    '<section id="report-modal" class="wb-overlay modal-content overlay-def wb-popup-mid gw-wb-popup-mid-sm" aria-hidden="true">' +
      '<header class="modal-header">' +
        '<h2 class="modal-title">' + title + '</h2>' +
      '</header>' +
      '<div class="modal-body"> ' +
        '<p class="mrgn-tp-lg">' + body + '</p>' +
      '</div>' +
      '<div class="modal-footer" style="border: 0px;">' +
        '<button type="button" class="btn btn-sm btn-primary pull-left overlay-close" title="' + closeBtnTitle + '">' +
          closeBtnBody +
        '</button>' +
      '</div>' +
      '<button type="button" class="mfp-close overlay-close" title="' + closeBtnTitle + '">' +
        "x" + closeBtnHiddenTxt +
      '</button>' +
    '</section>'
  );
}

function init( ) {
  var
    lang = $("html").attr( "lang" ),
    $reportBtn = $( "#rprtBtn" ),
    $reportForm = $( "#reportProblemForm" );

  $reportBtn.on( 'click vclick', function( ) {
    // Perform form validation
    var $validator = $reportForm.validate();

    $validator.form();
    
    if ( !$validator.valid() ) {
      // Form fields do not pass validation
      return;
    }
    
    // Collate form fields in FormData
    var
      reportData = new FormData(),
      problem = [];

    $reportForm.find(".checkbox input:checked").each(function( ) {
      problem.push( $( this ).attr("value") );
    });

    var detailsText = $reportForm.find("#problem-details").val();

    if ( detailsText ) {
      detailsText = "Additional information: " + detailsText;
      problem.push( detailsText );
    }

    problem = JSON.stringify( problem );

    reportData.append( "problem", problem );
    reportData.append( "page", window.location.pathname );
    reportData.append( "language", lang );
  
    var 
      $reportModal = false,
      url = window.location.href.replace(/(?:en|fr)\/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))(?:.*)?/i, "gw-custom/report-problem.php");

    // Request insertion of report into problems DB
    $
      .ajax({
        url: url,
        method: "POST",
        data: reportData,
        contentType: false,
        processData: false
      })
      .done(function ( ) {
        var modal = createModal(
          lang === 'en'
            ? 'Thank you for your help!'
            : 'Merci de votre aide!',
          lang === 'en'
            ? 'You will not receive a reply. For enquiries, please email <a href="mailto:hc.imsdbusinessimprovementoffice-bureaudelameliorationdumilieuorganisationneldsgi.sc@canada.ca"><span class="glyphicon glyphicon-envelope"></span> Business Improvement Office (BIO) </a>.'
            : "Vous ne recevrez pas de réponse. Pour toute question, s’il vous plaît envoyer un courriel à <a href=\"mailto:hc.imsdbusinessimprovementoffice-bureaudelameliorationdumilieuorganisationneldsgi.sc@canada.ca\"><span class=\"glyphicon glyphicon-envelope\"></span> Bureau de l'amélioration du milieu organisationnel (BAMO) </a>.",
          lang === 'en'
            ? 'Close  <span class="wb-inv">(escape key)</span>'
            : "Fermer <span class=\"wb-inv\">Fermer la fenêtre superposée (touche d'échappement)</span>"
        );

        $( document.body ).append( modal );

        $reportModal = $( "#report-modal" );

        // Show confirmation modal
        $reportModal.trigger( "open.wb-overlay" );

        // Remove modal from DOM on close
        // FIXME: "closed.wb-overlay" event is not firing
        // $reportModal.one( "closed.wb-overlay", function() {
        $('.overlay-close').one( "click vclick", function() {
          $reportModal.remove();
        } );
      })
      .fail(function( a, b, c ) {
        // TODO: Handle report failure - suggestion: show modal suggesting user email BIO directly with problem (mailto:hc.imsdbusinessimprovementoffice-bureaudelameliorationdumilieuorganisationneldsgi.sc@canada.ca)
        console.log('DEBUG: report - failed');
        console.log( this, a, b ,c );

        var modal = createModal(
          lang === 'en'
            ? 'Error!'
            : 'Erreur!',
          lang === 'en'
            ? 'There was a problem submitting this report. If you still wish to report this problem please email the <a href="mailto:hc.imsdbusinessimprovementoffice-bureaudelameliorationdumilieuorganisationneldsgi.sc@canada.ca"><span class="glyphicon glyphicon-envelope"></span> Business Improvement Office (BIO) </a>.'
            // TODO: Translate above for french!!! 
            : "S’il vous plaît envoyer un courriel à <a href=\"mailto:hc.imsdbusinessimprovementoffice-bureaudelameliorationdumilieuorganisationneldsgi.sc@canada.ca\"><span class=\"glyphicon glyphicon-envelope\"></span> Bureau de l'amélioration du milieu organisationnel (BAMO) </a>.",
          lang === 'en'
            ? 'Close <span class="wb-inv">(escape key)</span>'
            : "Fermer <span class=\"wb-inv\">Fermer la fenêtre superposée (touche d'échappement)</span>"
        );

        $( document.body ).append( modal );

        $reportModal = $( "#report-modal" );

        // Show confirmation modal
        $reportModal.trigger( "open.wb-overlay" );

        // Remove modal from DOM on close
        // FIXME: "closed.wb-overlay" event is not firing
        // $reportModal.one( "closed.wb-overlay", function() {
        $('.overlay-close').one( "click vclick", function() {
          $reportModal.remove();
        } );
      })
      .always(function ( ) {
        $reportBtn.hide();
        $reportForm.closest('details').find('summary').click();
        $validator.resetForm();
        $validator.destroy();
      });

    return false;
  } );
}

// Defer script initialization until wet and forms have finished initializing

var queue = [ new $.Deferred(), new $.Deferred() ];

$( document ).one( "wb-ready.wb", function( ) {
  queue[ 0 ].resolve();
} );

$( document ).one( "formLanguages.wb", function( ) {
  queue[ 1 ].resolve();
} );

$
  .when.apply( $, queue )
  .done( init );
