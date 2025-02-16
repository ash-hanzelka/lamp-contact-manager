<?php 
    $inData = json_decode(file_get_contents("php://input"), true);

    $userId = $inData["userId"];
    $firstName = $inData["firstName"]; 
    $lastName = $inData["lastName"];
    $email = $inData["email"];  
    $phone = $inData["phone"];

    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    if($conn->connection_error) {
        returnError($conn->connection_error);
    } else {
        $paramsPassed = sprintf('{"userId":"%s","firstName":"%s","lastName":"%s","email":"%s","phone":"%s"}',
            $userId, $firstName, $lastName, $email, $phone);

        returnJson($paramsPassed);
    }

    function returnMsg($string) {
        $retMsg = sprintf('{"msg":"%s"}', $string);
        returnJson($retMsg);
    }
    
    function returnSuccess($string) {
        $retMsg = sprintf('{"status":"success","msg":"%s"}', $string);
        returnJson($retMsg);
    }

    function returnError($string) {
        $retMsg = sprintf('{"status":"error","msg":"%s"}', $string);
        returnJson($retMsg);
    }

    function returnJson($obj) {
        header('Content-Type: application/json');
        echo $obj;
    }
?>
