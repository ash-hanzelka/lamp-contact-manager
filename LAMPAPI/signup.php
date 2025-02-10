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
        $existence_query = sprintf("SELECT COUNT(*) AS num_users FROM Users WHERE username = %s", $username);
        $existence_stmt = $db_connection->prepare($existence_query);
        if(!$existence_stmt->execute()) {
            $failure_msg = '{"msg":"sql failed idk sowwy! >_<"}';
            returnJson($failure_msg);
            die(1); // cooler version of exit
        }
        $existence_result = $existence_stmt->get_result();
        $num_users = $existence_result->fetch_assoc()['num_users'];
        
        $num_users_dtype = gettype($num_users);
        $final_msg = sprintf('{"data_type":"%s"}', $num_users_dtype);
        /*
        
        if($num_users == 1) {
            $user_exists_msg = '{"msg":"The user already exists"}';
            returnJson($user_exists_msg);
            die(1); // the objectively cooler version of exit
        } else {
            $user_dne_msg = '{"msg":"User does not exist"}';
            returnJson($user_dne_msg);
        }
        
        */
    }

    function returnJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }
    /*
    Sign-up Flow
        1. check if the user is in the database
            1.1 yes -> send a message saying it already exists
            1.2 no -> make a new row with the passed username and password
                send a message informing the user has been created successfully
    */
?>