<?php 
    // read the data http body into $in_data
    $in_data = json_decode(file_get_contents('php://input'), true);
    
    // make a connection to the database
    $db_connection = new mysqli("localhost", "admin", "administratorpriveleges", "Contact");
    if( $db_connection->connect_error ) {
        header('Content-type: application/json');
        $error_json_msg = '{"msg":"WOMP WOMP"}';
        echo $error_json_msg;
    } else {
        header('Content-type: application/json');
        $success_message = '{"msg" : "SQL Server Connected"}';
        echo $success_message;
    }
?>