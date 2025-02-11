<?php 
    // read the data http body into $in_data
    $in_data = json_decode(file_get_contents('php://input'), true);
    $username = $in_data["username"];
    $password = $in_data["password"];

    // make a connection to the database
    $conn = new mysqli("localhost", "Admin", "administratorpriveleges", "Contact");
    if(conn->connect_error) {
        returnMsg("Connection Error");
    } else {
        returnMsg(sprintf("username: %s", $username));
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