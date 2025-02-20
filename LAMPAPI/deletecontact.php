<?php
    $inData = json_decode(file_get_contents("php://input"), true);

    $userId = (int)$inData["userId"];
    if (!$userId) {
        returnError("No userId");
    }
    $firstName = $inData["firstName"];
    if (!$firstName) {
        returnError("No first name");
    }
    $lastName = $inData["lastName"];
    if (!$lastName) {
        returnError("No last name");
    }
    $email = $inData["email"];
    if (!$email) {
        returnError("No email address");
    }
    $phone = $inData["phone"];
    if (!$phone) {
        returnError("No phone number");
    }

    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");

    
    if ($conn->connect_error) {
        returnError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE userid = ? AND firstName = ? AND lastName = ? AND email = ? AND phone = ?");
        if (!$stmt) {
            returnError("Prepare failed: " . $conn->error);
            exit;
        }
        $stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);
        $stmt->execute();

        if ($conn->affected_rows > 0) {
            returnSuccess("Contact deleted successfully");
        } else {
            returnError("Error deleting contact or contact not found");
        }

        $stmt->close();
        $conn->close();
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
        $retMsg = sprintf('{"status":"failure","msg":"%s"}', $string);
        returnJson($retMsg);
    }
?>
