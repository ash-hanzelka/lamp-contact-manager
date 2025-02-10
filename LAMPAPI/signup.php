<?php 
    // read the data http body into $in_data
    $in_data = json_decode(file_get_contents('php://input'), true);
    $username = $in_data["username"];
    $password = $in_data["password"];

    // make a connection to the database
    $db_connection = new mysqli("localhost", "Admin", "administratorpriveleges", "Contact");
    if( $db_connection->connect_error ) {
        header('Content-type: application/json');
        $error_json_msg = '{"msg":"WOMP WOMP"}';
        echo $error_json_msg;
    } else {
        header('Content-type: application/json');
        $success_message = sprintf('{"username":"%s","password":"%s"}', $username, $password);
        echo $success_message;
    }
    /*
    Sign-up Flow
    */
?>