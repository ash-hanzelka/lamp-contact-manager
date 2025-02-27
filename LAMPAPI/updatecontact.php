<?php
    $inData = json_decode(file_get_contents("php://input"), true);

    $contactId = (int)$inData["contactId"];
    if (!$contactId) {
        returnError("No contactId found");
    }

    $firstName = $inData["firstName"];
    if (!$firstName) {
        returnError("No first name found");
    }
    $lastName = $inData["lastName"];
    if (!$lastName) {
        returnError("No last name found");
    }
    $email = $inData["email"];
    if (!$email) {
        returnError("No email address found");
    }
    $phone = $inData["phone"];
    if (!$phone) {
        returnError("No phone number found");
    }

    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    if ($conn->connect_error) {
        returnError($conn->connect_error);
    }
    else {
        $stmt = $conn->prepare(
            "UPDATE Contacts SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE contactId = ?"
        );
        if (!$stmt) {
            returnError("Prepare failed: " . $conn->error);
            exit;
        }

        $stmt->bind_param("ssssi", $firstName, $lastName, $email, $phone, $contactId);
        $stmt->execute();

        if ($conn->affected_rows > 0) {
            returnSuccess("Contact updated successfully");
        }
        else {
            returnError("Error updating contact or contact not found");
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
        exit();
    }
?>
