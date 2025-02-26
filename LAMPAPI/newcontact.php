<?php 
    // php error returning
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    
    $inData = json_decode(file_get_contents("php://input"), true);

    $userId = (int) $inData["userId"];
    if(!$userId) {
        returnError("No userId");
    }
    $firstName = $inData["firstName"]; 
    if(!$firstName) {
        returnError("No first Name");
    }
    $lastName = $inData["lastName"];
    if(!$lastName) {
        returnError("No last Name");
    }
    $email = $inData["email"];  
    if(!$email) {
        returnError("No email address");
    }
    $phone = $inData["phone"];
    if(!$phone) {
        returnError("No no phone number");
    }

    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    if($conn->connect_error) {
        returnError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("INSERT INTO Contacts (userid, firstName, lastName, email, phone) VALUES (?, ?, ?, ?, ?)");
        if(!$stmt) {
            returnError("Prepare failed" . $conn->error);
            exit;
        }

        $stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);
        $stmt->execute();

        if($conn->affected_rows > 0) {
            returnSuccess("Contact added successfully");
        } else {
            returnError("Error while adding happened");
        }
        $stmt->close();
        $con->close();
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
