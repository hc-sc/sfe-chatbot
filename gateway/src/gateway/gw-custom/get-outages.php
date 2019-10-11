<?php
  define('URL_EVENTS', 'http://www.gcpedia.gc.ca/gcwiki/images/4/4c/SSMEvents.txt');
  /*define('URL_EVENTS', 'http://www.gcpedia.gc.ca/gcwiki/images/7/72/1Event.txt');*/
  /*define('URL_EVENTS', 'http://www.gcpedia.gc.ca/gcwiki/images/c/c8/2Events.txt');*/
  /*define('URL_EVENTS', 'http://www.gcpedia.gc.ca/gcwiki/images/6/66/RyanEvents.txt');*/
  try {
    foreach(file(URL_EVENTS) as $data) {
      echo $data;
    }
  }
   catch(excepction $e) {
   echo $e;
  }
?>