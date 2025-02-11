<?php 
    $inData = json_decode(file_get_contents("php://input"), true);

    $username = $inData["username"];
    $password = $inData["password"];

    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    if( $conn->connect_error ) {
        returnMsg("Connection failed: " . $conn->connect_error);
    } else {
        returnMsg("Connected successfully");
    }

    function returnMsg($string) {
        $retMsg = sprintf('{"msg":"%s"}', $string);
        returnJson($retMsg);
    }

    function returnJson($obj) {
        header('Content-Type: application/json');
        echo $obj;
    }
?>