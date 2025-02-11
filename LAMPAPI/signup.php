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
        // check if the user is in the database
        $stmt = $conn->prepare("SELECT * FROM Users WHERE username=?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if(result->num_rows > 0) {
            returnMsg("User already exists");
        } 
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