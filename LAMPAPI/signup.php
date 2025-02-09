<?php 
    // read the data http body into $in_data
    $in_data = json_decode(file_get_contents('php://input'), true);
    
    // make a connection to the database
    $db_connection = new mysqli("localhost", "admins", "administratorpriveleges", "Contact");
    if( $db_connection->connect_error ) {
        header('Content-type: application/json');
        $error_json_msg = '{"msg":"WOMP WOMP"}';
        echo $error_json_msg;
    }
?>