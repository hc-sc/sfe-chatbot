<?php
/**
 * @sendResponse
 * 
 * This function returns JSON success/error responses with a given message and status.
 * 
 * Defaults to error.
 */

// Use NCR timezone in this script
date_default_timezone_set("America/Toronto");

/**
 * @getCredentials
 * 
 * Loads credentials from outside public folder
 */
function getCredentials() {
  include(__DIR__.'\..\..\secret.php');
  
  if ( !isset( $credentials ) ) {
    return sendResponse( "Problem with database authentication." );
  }
  else {
    return $credentials;
  }
}

function sendResponse( $msg = "Error.", $status = "error" ) {
  $response = array(
    "message" => $msg,
    "status" => $status
  );

  header('Content-type: application/json', false);

  if ( $status == "error" ) {
    http_response_code(400);
  }
  else {
    http_response_code(200);
  }

  echo json_encode( $response );
  die();
}

/**
 * @insertReport
 * 
 * This function inserts a report into the gateway_problem table
 */
function insertReport($page, $problem, $language) {
  try {
    $credentials = getCredentials();

    $NOW = date("Y-m-d H:i:s");

    $dsn = "mysql:host=" . $credentials["host"] . ";dbname=" . $credentials["db"] . ";charset=" . $credentials["charset"] . ";";

    $db = new PDO( $dsn, $credentials["user"], $credentials["password"] );

    $queryString = "INSERT INTO " . $credentials["tables"]["problem"] . " (date, page, problem, language) VALUES (:date, :page, :problem, :language)";

    $query = $db->prepare( $queryString );

    // Validate successful transaction
    if ( 
      !$query->execute([
        'date' => $NOW,
        'page' => $page,
        'problem' => $problem,
        'language' => $language
      ])
    ) {
      $db = NULL;
      $query = NULL;
      return sendResponse( "Problem connecting to the database." );;
    }

    $db = NULL;
    $query = NULL;

    return sendResponse( "Report received.", "success" );
  }
  catch (Exception $e) {
    echo json_encode(array(
      'error' => array(
        'msg' => $e->getMessage(),
        'code' => $e->getCode(),
      ),
    ));
  }

  die();
}

/**
 * @handleInsertRequest
 * 
 * This function validates the request parameters and moves to inserts the report if valid
 */
function handleInsertRequest() {
  $problem = $_POST["problem"];
  $page = $_POST["page"];
  $language = $_POST["language"];

  if ( is_null( $problem ) || is_null( $page ) || is_null( $language ) ) {
    // Request missing information, return error
    return sendResponse( "Invalid request" );
  }
  
  insertReport($page, $problem, $language);
}

/**
 * @sortByDate
 * 
 * This function's intended use is as a 'usort' callback for sorting an array by date key
 */
function sortEntriesByDate($a, $b) {
  return strtotime($a['date']) - strtotime($b['date']);
}

/**
 * @handleDumpRequest
 * 
 * This function retrieves all reports in the database and returns them in JSON format.
 */
function handleDumpRequest() {
  $credentials = getCredentials();

  $dsn = "mysql:host=" . $credentials["host"] . ";dbname=" . $credentials["db"] . ";charset=" . $credentials["charset"] . ";";

  try {
    $db = new PDO( $dsn, $credentials["user"], $credentials["password"] );

    $queryString = "SELECT * FROM " . $credentials['tables']['problem'];

    $query = $db->prepare( $queryString );

    // Validate successful transaction
    if ( !$query->execute() ) {
      $db = NULL;
      $query = NULL;
      return sendResponse( "Problem communicating with the database" );
    }

    $result = $query->fetchAll( PDO::FETCH_GROUP | PDO::FETCH_ASSOC );

    // Format results
    $formatted = array();

    foreach ( $result as $row ) {
      $_nr = array();
      foreach ( $row[0] as $col => $val ) {
        $_nr[$col] = $val;
      }
      array_push( $formatted, $_nr );
    }

    // Sort by date
    usort($formatted, "sortEntriesByDate");

    // Close DB connections
    $db = NULL;
    $query = NULL;

    // Respond with dump
    http_response_code(200);
    echo json_encode( $formatted );
    die();

    return NULL;
  }
  catch (Exception $e) { }

  return sendResponse( "Problem connecting to the database" );
}

if ( $_SERVER['REQUEST_METHOD'] === 'POST' ) {
  // On post insert report
  handleInsertRequest();
}
elseif ( isset($_GET["dump"]) ) {
  // If getting dump return report dump
  handleDumpRequest();
}
else {
  header('Location: ../gateway/404.html', true, 403);
  die();
}
  
?>
