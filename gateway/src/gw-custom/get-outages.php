<?php
ini_set('display_errors', '1');
ini_set('allow_url_fopen', '1');
// file://///Ncr-a-irbv1s/irbv1/HC/CSB/IMSD/CIO-002-Restricted-All IMSD Staff/IMSD Portal - GCPedia files/Tools/SSM/SSMEvents2.txt
// \\Ncr-a-irbv1s\irbv1\HC\CSB\IMSD\CIO-002-Restricted-All IMSD Staff\IMSD Portal - GCPedia files\Tools\SSM\SSMEvents2.txt
  /*define('URL_EVENTS', 'https://www.gcpedia.gc.ca/gcwiki/images/4/4c/SSMEvents.txt');*/

//  define('URL_EVENTS', 'https://www.gcpedia.gc.ca/gcwiki/images/2/23/SSMEvents2.txt');

//  define('URL_EVENTS', 'file://///Ncr-a-irbv1s/irbv1/HC/CSB/IMSD/CIO-002-Restricted-All IMSD Staff/IMSD Portal - GCPedia files/Tools/SSM/SSMEvents2.txt');

    define('URL_EVENTS', '\\Ncr-a-irbv1s\irbv1\HC\CSB\IMSD\CIO-002-Restricted-All IMSD Staff\IMSD Portal - GCPedia files\Tools\SSM\SSMEvents2.txt');

  /*define('URL_EVENTS', 'http://www.gcpedia.gc.ca/gcwiki/images/7/72/1Event.txt');*/
  /*define('URL_EVENTS', 'http://www.gcpedia.gc.ca/gcwiki/images/c/c8/2Events.txt');*/
  /*define('URL_EVENTS', 'http://www.gcpedia.gc.ca/gcwiki/images/6/66/RyanEvents.txt');*/
/*  try {
    foreach(file(URL_EVENTS) as $data) {
      echo $data;
    }
  }
   catch(excepction $e) {
   echo $e;
   } */
/*  try {
    $options = array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => false,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_ENCODING => "",
        CURLOPT_AUTOREFERER => true,
    );

    $ch = curl_init( 'file://\\Ncr-a-irbv1s\irbv1\HC\CSB\IMSD\CIO-002-Restricted-All IMSD Staff\IMSD Portal - GCPedia files\Tools\SSM\SSMEvents2.txt' );
    curl_setopt_array( $ch, $options );

    $content = curl_exec( $ch );

    curl_close( $ch );

    echo $content;
  }
  catch(excepction $e) {
   echo $e;
  }*/

  echo file( 'file://\\Ncr-a-irbv1s\irbv1\HC\CSB\IMSD\CIO-002-Restricted-All IMSD Staff\IMSD Portal - GCPedia files\Tools\SSM\SSMEvents2.txt' );
?>
