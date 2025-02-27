<?php
    $inData = json_decode(file_get_contents("php://input"), true);

    $contactId = (int)$inData["contactId"];
    if (!$contactId) {
        returnError("No contactId");
    }

    $conn = new mysqli("localhost", "theManager", "ContactManager", "Contact");
    
    if ($conn->connect_error) {
        returnError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE contactId = ?");
        if (!$stmt) {
            returnError("Prepare failed: " . $conn->error);
            exit;
        }
        $stmt->bind_param("i", $contactId);
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
