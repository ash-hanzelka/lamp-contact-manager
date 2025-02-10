<?php 
    // read the data http body into $in_data
    $in_data = json_decode(file_get_contents('php://input'), true);
    $username = $in_data["username"];
    $password = $in_data["password"];

    // make a connection to the database
    $db_connection = new mysqli("localhost", "Admin", "administratorpriveleges", "Contact");

    if( $db_connection->connect_error ) {
        $error_json_msg = '{"msg":"WOMP WOMP"}';
        returnJson($error_json_msg);
    } else {
        // TODO: Figure out why there is 500 Internal Server Error
        /*
        Possible solution, maybe use bind_params() method instead of sprintf to bind the parameters to the statement
        */
        // This follows the prepare - bind - execute model for SQL queries in PHP please work I am going to crash out
        $existence_stmt = db_connection->prepare("SELECT * FROM Users WHERE username = ?");
        returnMsg("preparing successful! ^-^");
        $existence_stmt->bind_param("s", $username);
        returnMsg("binding successful! ^-^");
        $existence_stmt->execute();
        returnMsg("executing successful! ^-^");
        $existence_result = $existence_stmt->get_result();
        returnMsg("fetching successful! ^-^");
        $query_result = $existence_result->fetch_assoc();
        returnMsg("setting to associative array successful! ^-^");
    }

    function returnJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnMsg($string) {
        $ret_msg = sprintf('{"msg":"%s"}', $string);
        returnJson($ret_msg);
    }
    /*
    Sign-up Flow
        1. check if the user is in the database
            1.1 yes -> send a message saying it already exists
            1.2 no -> make a new row with the passed username and password
                send a message informing the user has been created successfully
    */
?>