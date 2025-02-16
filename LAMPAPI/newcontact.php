<?php 
    $inData = json_decode(file_get_contents("php://input"), true);

    $userId = $indata["userId"];
    $firstName = $indata["firstName"]; 
    $lastName = $indata["lastName"];
    $email = $indata["email"];  
    $phone = $indata["phone"];

    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    if($conn->connection_error) {
        returnError($conn->connection_error);
    } else {
        $stmt = $conn->prepare("INSERT INTO Contacts (userid, firstName, lastName, email, phone) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);
        $stmt->execute();


        if($conn->affected_rows > 0) {
            returnSuccess("Contact added successfully");
        } else {
            returnError("Error adding contact: " . $conn->error);
        }
    }


    function returnJson($obj) {
        header('Content-Type: application/json');
        echo $obj;
    }

    function returnSuccess($string) {
        $retMsg = sprintf('{"status":"success","msg":"%s"}', $string);
        returnJson($retMsg);
    }

    function returnError($string) {
        $retMsg = sprintf('{"status":"error","msg":"%s"}', $string);
        returnJson($retMsg);
    }
?>
